$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("d:\Learning HUTECH\Đồ án cơ sở\WebsiteProject\Hộ tịch\Giấy xác nhận tình trạng hôn nhân- cán bộ.docx")

function FindReplace($findText, $replaceText) {
    $word.Selection.HomeKey(6) | Out-Null
    $word.Selection.Find.Execute($findText, $false, $false, $false, $false, $false, $true, 1, $false, $replaceText, 2) | Out-Null
}

FindReplace "Họ, chữ đệm, tên:" "Họ, chữ đệm, tên: {fullName}"
FindReplace "Ngày, tháng, năm sinh:" "Ngày, tháng, năm sinh: {dob}"
FindReplace "Giới tính:............................" "Giới tính: {gender}       "
FindReplace "Dân tộc:........................................." "Dân tộc: {ethnicity}           "
FindReplace "Quốc tịch:" "Quốc tịch: {nationality}"
FindReplace "Giấy tờ tùy thân:." "Giấy tờ tùy thân: {idNumber}"
FindReplace "Nơi cư trú: " "Nơi cư trú: {address}"

$doc.SaveAs([ref]"d:\Learning HUTECH\Đồ án cơ sở\WebsiteProject\Hộ tịch\Giấy xác nhận tình trạng hôn nhân- cán bộ_template.docx", [ref]16)
$doc.Close()
$word.Quit()
Write-Host 'Done'
