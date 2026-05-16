const fs = require("fs");
const { Document, Packer, Paragraph, TextRun, TabStopPosition, TabStopType, AlignmentType } = require("docx");

const doc = new Document({
    sections: [
        {
            properties: {
                page: {
                    margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
                }
            },
            children: [
                // Header Row 1
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 2000 },
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\tTHÀNH PHỐ HỒ CHÍ MINH\tCỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", size: 26 })
                    ]
                }),
                // Header Row 2
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 2000 },
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\t", size: 26 }),
                        new TextRun({ text: "QUẬN BÌNH THẠNH", bold: true, size: 26 }),
                        new TextRun({ text: "\tĐộc lập - Tự do - Hạnh phúc", bold: true, underline: {}, size: 26 })
                    ]
                }),
                // Header Row 3
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 2000 },
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\t", size: 26 }),
                        new TextRun({ text: "UBND PHƯỜNG 11", bold: true, underline: {}, size: 26 }),
                        new TextRun({ text: "\t", size: 26 })
                    ]
                }),
                // Spacer
                new Paragraph({ text: "", size: 26, spacing: { after: 100 } }),
                // Header Row 4 (Date & No)
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 2000 },
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\tSố: {applicationCode}/UBND-XNTTHN\t", size: 26 }),
                        new TextRun({ text: "Phường 11, ngày {day} tháng {month} năm {year}", italics: true, size: 26 })
                    ]
                }),
                
                new Paragraph({ text: "", spacing: { after: 400 } }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 150 }, children: [new TextRun({ text: "GIẤY XÁC NHẬN TÌNH TRẠNG HÔN NHÂN", bold: true, size: 30 })] }),
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [new TextRun({ text: "UBND PHƯỜNG 11, QUẬN BÌNH THẠNH, THÀNH PHỐ HỒ CHÍ MINH", bold: true, size: 26 })] }),
                
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "\tXét đề nghị của ông/bà: ", size: 28 }),
                    new TextRun({ text: "{officerName}", bold: true, size: 28 }),
                    new TextRun({ text: ", Công chức tư pháp hộ tịch", size: 28 }),
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 400, line: 360 }, children: [
                    new TextRun({ text: "về việc cấp Giấy xác nhận tình trạng hôn nhân cho ông/bà ", size: 28 }),
                    new TextRun({ text: "{fullName}", bold: true, size: 28 }),
                    new TextRun({ text: ".", size: 28 })
                ]}),
                
                new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [new TextRun({ text: "XÁC NHẬN:", bold: true, size: 28 })] }),
                
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Họ, chữ đệm, tên: ", size: 28 }),
                    new TextRun({ text: "{fullName}", bold: true, size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Ngày, tháng, năm sinh: ", size: 28 }),
                    new TextRun({ text: "{dob}", size: 28 })
                ]}),
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.LEFT, position: 3500 },
                        { type: TabStopType.LEFT, position: 7000 }
                    ],
                    spacing: { after: 200, line: 360 },
                    children: [
                        new TextRun({ text: "Giới tính: {gender}\tDân tộc: {ethnicity}\tQuốc tịch: {nationality}", size: 28 }),
                    ]
                }),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Giấy tờ tùy thân: CCCD ", size: 28 }),
                    new TextRun({ text: "{idNumber}", size: 28 }),
                    new TextRun({ text: " do ", size: 28 }),
                    new TextRun({ text: "{issuePlace}", size: 28 }),
                    new TextRun({ text: " cấp ngày ", size: 28 }),
                    new TextRun({ text: "{issueDate}", size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Nơi cư trú: ", size: 28 }),
                    new TextRun({ text: "{address}", size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Trong thời gian cư trú tại: Phường 11, Quận Bình Thạnh, Thành phố Hồ Chí Minh", size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Từ ngày ..................................................... đến ngày .....................................................", size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 200, line: 360 }, children: [
                    new TextRun({ text: "Tình trạng hôn nhân: ", size: 28 }),
                    new TextRun({ text: "Chưa đăng ký kết hôn với ai.", size: 28 })
                ]}),
                new Paragraph({ alignment: AlignmentType.JUSTIFIED, spacing: { after: 400, line: 360 }, children: [
                    new TextRun({ text: "Giấy này có giá trị sử dụng trong thời hạn 6 tháng, kể từ ngày cấp, được sử dụng để: ", size: 28 }),
                    new TextRun({ text: "Bổ sung hồ sơ đăng ký kết hôn.", size: 28 })
                ]}),
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\tNGƯỜI KÝ GIẤY XÁC NHẬN", bold: true, size: 28 })
                    ]
                }),
                new Paragraph({
                    tabStops: [
                        { type: TabStopType.CENTER, position: 7500 }
                    ],
                    children: [
                        new TextRun({ text: "\t(Ký, ghi rõ họ tên, chức vụ và đóng dấu)", italics: true, size: 28 })
                    ]
                })
            ]
        }
    ]
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync(__dirname + "/templates/Giay_xac_nhan_tinh_trang_hon_nhan_can_bo_template.docx", buffer);
    console.log("Document created successfully");
});
