const { error } = require('../utils/response');

/**
 * Middleware kiểm tra dữ liệu đầu vào.
 * Sử dụng: validate(schema) — schema là một object { field: validators[] }
 *
 * Ví dụ:
 *   validate({
 *     email:    [required(), isEmail()],
 *     password: [required(), minLength(6)],
 *   })
 */

// --- Helper validators ---

const required = (msg) => (val) =>
  val === undefined || val === null || val === ''
    ? msg || 'Trường này là bắt buộc'
    : null;

const minLength = (n, msg) => (val) =>
  val && val.length < n ? msg || `Tối thiểu ${n} ký tự` : null;

const maxLength = (n, msg) => (val) =>
  val && val.length > n ? msg || `Tối đa ${n} ký tự` : null;

const isEmail = (msg) => (val) =>
  val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
    ? msg || 'Email không hợp lệ'
    : null;

const isCccd = (msg) => (val) =>
  val && !/^\d{12}$/.test(val)
    ? msg || 'CCCD phải gồm đúng 12 chữ số'
    : null;

const isUUID = (msg) => (val) =>
  val && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val)
    ? msg || 'ID không hợp lệ (phải là UUID)'
    : null;

// --- Middleware factory ---

const validate = (schema) => (req, res, next) => {
  const errors = {};

  for (const [field, validators] of Object.entries(schema)) {
    const val = req.body[field];
    for (const validator of validators) {
      const msg = validator(val);
      if (msg) {
        errors[field] = msg;
        break;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return error(res, 'Dữ liệu không hợp lệ', 422, errors);
  }

  next();
};

// Export middleware + helpers để dùng trong routes
module.exports = validate;
module.exports.required  = required;
module.exports.minLength = minLength;
module.exports.maxLength = maxLength;
module.exports.isEmail   = isEmail;
module.exports.isCccd    = isCccd;
module.exports.isUUID    = isUUID;
