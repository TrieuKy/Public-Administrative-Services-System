$html = @"
<html>
<head>
<meta charset='utf-8'>
<style>
  body { font-family: 'Times New Roman', serif; font-size: 14pt; line-height: 1.5; }
  .header-table { width: 100%; border-collapse: collapse; margin-bottom: 20pt; }
  .header-table td { text-align: center; vertical-align: top; border: none; padding: 0; }
  .bold { font-weight: bold; }
  .title { text-align: center; font-weight: bold; font-size: 15pt; margin-top: 10pt; }
  .subtitle { text-align: center; font-weight: bold; font-size: 14pt; margin-bottom: 20pt; text-transform: uppercase; }
  .section-title { text-align: center; font-weight: bold; font-size: 14pt; margin: 15pt 0; }
  .content { text-align: justify; margin-bottom: 10pt; line-height: 1.6; }
  .footer-table { width: 100%; border-collapse: collapse; margin-top: 30pt; }
  .footer-table td { text-align: center; vertical-align: top; border: none; }
</style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 40%;">
        THÀNH PHỐ HỒ CHÍ MINH<br>
        <span class="bold">QUẬN BÌNH THẠNH</span><br>
        <span class="bold" style="text-decoration: underline;">UBND PHƯỜNG 11</span><br><br>
        Số: {applicationCode}/UBND-XNTTHN
      </td>
      <td style="width: 60%;">
        <span class="bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</span><br>
        <span class="bold" style="text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</span><br><br>
        <i style="font-size: 13pt;">TP.Hồ Chí Minh, ngày {day} tháng {month} năm {year}</i>
      </td>
    </tr>
  </table>

  <div class="title">GIẤY XÁC NHẬN TÌNH TRẠNG HÔN NHÂN</div>
  <div class="subtitle">UBND PHƯỜNG 11, QUẬN BÌNH THẠNH, THÀNH PHỐ HỒ CHÍ MINH</div>

  <div class="content">
    Xét đề nghị của ông/bà: {officerName}, Công chức tư pháp hộ tịch<br>
    về việc cấp Giấy xác nhận tình trạng hôn nhân cho {fullName}
  </div>

  <div class="section-title">XÁC NHẬN:</div>

  <div class="content">
    Họ, chữ đệm, tên: <span class="bold">{fullName}</span><br>
    Ngày, tháng, năm sinh: {dob}<br>
    Giới tính: {gender} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Dân tộc: {ethnicity} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Quốc tịch: {nationality}<br>
    Giấy tờ tùy thân: {idNumber} do {issuePlace} cấp ngày {issueDate}<br>
    Nơi cư trú: {address}<br>
    Trong thời gian cư trú tại: Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh<br>
    từ ngày ............................................ đến ngày ............................................<br>
    Tình trạng hôn nhân: Chưa đăng ký kết hôn với ai.<br>
    Giấy này có giá trị sử dụng trong thời hạn 6 tháng, kể từ ngày cấp, được sử dụng để: Bổ sung hồ sơ đăng ký kết hôn.
  </div>

  <table class="footer-table">
    <tr>
      <td style="width: 50%;"></td>
      <td style="width: 50%;">
        <span class="bold">NGƯỜI KÝ GIẤY XÁC NHẬN</span><br>
        <i>(Ký, ghi rõ họ tên, chức vụ và đóng dấu)</i><br><br><br><br><br>
      </td>
    </tr>
  </table>
</body>
</html>
"@

Set-Content -Path "template.html" -Encoding UTF8 -Value $html

$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("$PWD\template.html")
$doc.SaveAs([ref]"$PWD\Hộ tịch\Giấy xác nhận tình trạng hôn nhân- cán bộ_template.docx", [ref]16)
$doc.Close()
$word.Quit()
Write-Host 'HTML converted to DOCX successfully'
