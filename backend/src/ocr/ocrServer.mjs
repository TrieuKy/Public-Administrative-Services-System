// backend/src/ocr/ocrServer.mjs
// ─────────────────────────────────────────────────────────────
// OCR Microservice — chạy port 5050
// Được gọi từ ai.service.js qua HTTP fetch
// Khởi động: node src/ocr/ocrServer.mjs
// ─────────────────────────────────────────────────────────────

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

const app = express();
app.use(cors());
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.get('/health', (req, res) => res.json({ status: 'ok', provider: 'gemini', port: 5050 }));

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// ── Gemini models theo thứ tự ưu tiên ────────────────────────
const MODELS = [
  { model: 'gemini-2.5-flash',      apiVersion: 'v1beta' },
  { model: 'gemini-2.0-flash',      apiVersion: 'v1beta' },
  { model: 'gemini-2.0-flash-lite', apiVersion: 'v1beta' },
];

// ── Gọi Gemini với retry + model fallback ─────────────────────
async function callGemini(apiKey, body, maxRetries = 3) {
  const errors = [];

  for (const { model, apiVersion } of MODELS) {
    const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`;
    console.log(`🔄 Trying model: ${model}`);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      console.log(`   attempt ${attempt} → status ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        console.log(`✅ OK with ${model}. Text length: ${text.length}`);
        return { text, model };
      }

      const errData = await response.json().catch(() => ({}));
      const errMsg = errData?.error?.message || `HTTP ${response.status}`;

      if (response.status === 404) {
        errors.push(`${model}: không tìm thấy`);
        break;
      }

      if (response.status === 429) {
        if (errMsg.toLowerCase().includes('quota') || errMsg.includes('limit: 0')) {
          errors.push(`${model}: hết quota`);
          break;
        }
        const match = errMsg.match(/retry in ([\d.]+)s/i);
        const waitSec = match ? Math.ceil(parseFloat(match[1])) + 2 : 15;
        if (attempt < maxRetries) {
          console.log(`   ⏳ Rate limited. Waiting ${waitSec}s...`);
          await sleep(waitSec * 1000);
          continue;
        }
        errors.push(`${model}: rate limit`);
        break;
      }

      if (response.status === 403) {
        errors.push(`${model}: forbidden`);
        break;
      }

      if (response.status === 400 && errMsg.toLowerCase().includes('api key')) {
        throw new Error(
          'API Key Gemini không hợp lệ.\n' +
          'Lấy key mới tại: https://aistudio.google.com/app/apikey'
        );
      }

      throw new Error(errMsg);
    }
  }

  throw new Error(
    'Tất cả Gemini models đều không khả dụng.\n' +
    'Chi tiết: ' + errors.join(' | ')
  );
}

// ── JSON extractor (có xử lý JSON bị truncated) ──────────────
function extractJSON(raw) {
  let text = raw.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  const start = text.indexOf('{');
  if (start === -1) throw new Error('Không tìm thấy JSON trong kết quả.');
  text = text.slice(start).replace(/[\u0000-\u001F\u007F]/g, ' ');

  // 1. Thử parse thẳng (JSON hoàn chỉnh)
  try { return JSON.parse(text); } catch (_) {}

  // 2. Thử sửa ký tự nháy kép trong giá trị
  try {
    const fixed = text.replace(/: ?"((?:[^"\\]|\\.)*?)"/g, (m, val) =>
      `: "${val.replace(/(?<!\\)"/g, "'")}"`
    );
    return JSON.parse(fixed);
  } catch (_) {}

  // 3. Sửa JSON bị cắt ngắn (truncated) — tìm group cuối hợp lệ
  const lastValidMarker = Math.max(
    text.lastIndexOf('"warningLevel"'),
    text.lastIndexOf('"message"'),
    text.lastIndexOf('"issues"'),
    text.lastIndexOf('"isValid"'),
    text.lastIndexOf('"isReadable"'),
  );
  if (lastValidMarker !== -1) {
    const braceClose = text.indexOf('}', lastValidMarker);
    if (braceClose !== -1) {
      const repaired = text.substring(0, braceClose + 1) + ']}';
      try { return JSON.parse(repaired); } catch (_) {}
    }
  }

  throw new Error('Không thể parse JSON từ response AI (có thể bị truncated).');
}

// ── POST /api/vision — 1 ảnh ─────────────────────────────────
app.post('/api/vision', async (req, res) => {
  const { apiKey, base64, mediaType, prompt, maxOutputTokens } = req.body;

  // Dùng GEMINI_API_KEY từ env nếu không truyền apiKey
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || !base64 || !prompt)
    return res.status(400).json({ error: { message: 'Thiếu apiKey, base64 hoặc prompt' } });

  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mediaType || 'image/jpeg', data: base64 } },
        { text: prompt },
      ],
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: maxOutputTokens || 2000 },
  };

  try {
    const { text, model } = await callGemini(key, body);
    res.json({ content: [{ text }], model });
  } catch (err) {
    console.error('/api/vision error:', err.message);
    res.status(400).json({ error: { message: err.message } });
  }
});

// ── POST /api/vision-multi — nhiều ảnh ───────────────────────
app.post('/api/vision-multi', async (req, res) => {
  const { apiKey, images, prompt, maxOutputTokens } = req.body;
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || !images?.length || !prompt)
    return res.status(400).json({ error: { message: 'Thiếu apiKey, images hoặc prompt' } });

  const parts = [];
  images.forEach((img, i) => {
    parts.push({ text: `=== Trang ${i + 1}${img.label ? ` — ${img.label}` : ''} ===` });
    parts.push({ inline_data: { mime_type: img.mediaType || 'image/jpeg', data: img.base64 } });
  });
  parts.push({ text: prompt });

  const body = {
    contents: [{ parts }],
    generationConfig: { temperature: 0.1, maxOutputTokens: maxOutputTokens || 8000 },
  };

  try {
    const { text, model } = await callGemini(key, body);
    res.json({ content: [{ text }], model });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

// ── POST /api/detect-type — nhận diện loại giấy tờ ───────────
app.post('/api/detect-type', async (req, res) => {
  const { apiKey, base64, mediaType } = req.body;
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || !base64)
    return res.status(400).json({ error: { message: 'Thiếu apiKey hoặc base64' } });

  const body = {
    contents: [{
      parts: [
        { inline_data: { mime_type: mediaType || 'image/jpeg', data: base64 } },
        { text: `Nhìn vào ảnh, xác định loại giấy tờ Việt Nam. Chỉ trả về JSON thuần:
{
  "loai_giay_to": "cccd|gplx|giay_chung_sinh|giay_dang_ky_ket_hon|xac_nhan_hon_nhan|ho_khau|khac",
  "chat_luong_anh": "tot|trung_binh|xau",
  "mo_ta": "mô tả ngắn tiếng Việt"
}` },
      ],
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 300 },
  };

  try {
    const { text } = await callGemini(key, body);
    res.json(extractJSON(text));
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

// ── GET /api/list-models ──────────────────────────────────────
app.get('/api/list-models', async (req, res) => {
  const apiKey = req.query.key || process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(400).json({ error: 'Thiếu API key' });
  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}&pageSize=50`
    );
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json(data);
    const models = (data.models || [])
      .filter(m => m.supportedGenerationMethods?.includes('generateContent'))
      .map(m => ({ name: m.name, displayName: m.displayName }));
    res.json({ count: models.length, models });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ── POST /api/extract-fields — trích xuất trường thông tin từ template ───────────
app.post('/api/extract-fields', async (req, res) => {
  const { apiKey, text } = req.body;
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key || !text)
    return res.status(400).json({ error: { message: 'Thiếu apiKey hoặc text' } });

  const body = {
    contents: [{
      parts: [
        { text: `Đây là nội dung của một mẫu đơn / giấy tờ. Hãy trích xuất tất cả các thông tin mà người dân cần phải điền vào (ví dụ: Họ và tên, Ngày sinh, Địa chỉ, Số CMND...). Trả về định dạng JSON thuần là một mảng các chuỗi. Ví dụ: ["Họ và tên", "Ngày sinh", "Số CMND/CCCD", "Nơi cấp"].\n\nNội dung văn bản:\n${text}` },
      ],
    }],
    generationConfig: { temperature: 0.1, maxOutputTokens: 1000 },
  };

  try {
    const { text: aiText } = await callGemini(key, body);
    res.json({ fields: extractJSON(aiText) });
  } catch (err) {
    res.status(400).json({ error: { message: err.message } });
  }
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: { message: err.message } });
});

const PORT = process.env.OCR_PORT || 5050;
app.listen(PORT, () => {
  console.log(`🚀 OCR Microservice → http://localhost:${PORT}`);
  console.log(`   GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? '✅ Đã set' : '❌ Chưa set'}`);
  console.log(`   Models: ${MODELS.map(m => m.model).join(', ')}`);
});
