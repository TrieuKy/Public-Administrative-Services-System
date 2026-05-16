$word = New-Object -ComObject Word.Application
$doc = $word.Documents.Open("$PWD\template.html")
$doc.SaveAs([ref]"$PWD\backend\templates\template_final.docx", [ref]16)
$doc.Close()
$word.Quit()
