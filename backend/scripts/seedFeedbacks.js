require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const { Comment, User } = require('../src/models');

const FEEDBACKS = [
  {
    type: 'feedback',
    topic: 'An ninh trật tự',
    title: 'Tụ tập hát karaoke quá giờ quy định',
    content: 'Tại khu phố 3, hẻm 123 thường xuyên có tình trạng tụ tập hát karaoke bằng loa kéo âm lượng lớn sau 22h đêm, gây ảnh hưởng đến giấc ngủ của người dân xung quanh. Đề nghị cơ quan chức năng xuống kiểm tra và nhắc nhở.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Môi trường',
    title: 'Rác thải đổ trộm tại hẻm 456',
    content: 'Tại khu vực bãi đất trống hẻm 456 có rất nhiều người đem rác thải sinh hoạt và xà bần đến đổ trộm vào ban đêm. Bãi rác tự phát này gây bốc mùi hôi thối và mất mỹ quan đô thị. Mong chính quyền có biện pháp xử lý triệt để.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Giao thông đô thị',
    title: 'Hệ thống đèn tín hiệu giao thông hỏng',
    content: 'Đèn giao thông tại ngã tư đường ABC giao với đường XYZ đã bị hỏng đèn đỏ hơn 3 ngày nay, gây lộn xộn và nguy cơ tai nạn giao thông vào giờ cao điểm. Kính mong cơ quan chức năng cử người sửa chữa gấp.',
    status: 'resolved'
  },
  {
    type: 'feedback',
    topic: 'Thủ tục hành chính',
    title: 'Thái độ phục vụ của cán bộ',
    content: 'Tôi đến làm thủ tục xác nhận tình trạng hôn nhân vào sáng thứ 3 tuần trước. Tuy nhiên cán bộ tiếp nhận hồ sơ có thái độ chưa nhiệt tình, cáu gắt và hướng dẫn không rõ ràng khiến tôi phải đi lại nhiều lần để bổ sung giấy tờ. Mong cơ quan xem xét chấn chỉnh.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Hạ tầng',
    title: 'Đường ống nước bị vỡ gây ngập lụt',
    content: 'Trước cửa nhà số 789 đường DEF có một đường ống nước máy bị vỡ từ sáng hôm qua, nước chảy lênh láng gây trơn trượt cho người đi đường và thất thoát nước sạch. Đề nghị công ty cấp nước xử lý.',
    status: 'resolved'
  },
  {
    type: 'feedback',
    topic: 'An ninh trật tự',
    title: 'Mất trật tự tại chợ tự phát',
    content: 'Khu vực đường GHI có chợ tự phát mọc lên, người buôn bán lấn chiếm hết lòng lề đường, gây ùn tắc giao thông vào buổi sáng sớm và xả rác bừa bãi. Đề nghị dẹp bỏ chợ tự phát này.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Môi trường',
    title: 'Xả nước thải chưa qua xử lý ra kênh',
    content: 'Cơ sở sản xuất ở cuối hẻm 111 thường xuyên xả nước thải màu đen ngòm và bốc mùi hóa chất trực tiếp ra con kênh phía sau khu dân cư. Kính đề nghị phòng Tài nguyên Môi trường kiểm tra và xử phạt.',
    status: 'dismissed'
  },
  {
    type: 'feedback',
    topic: 'Khác',
    title: 'Kiến nghị lắp thêm thùng rác công cộng',
    content: 'Khu vực công viên trung tâm hiện nay có quá ít thùng rác công cộng, dẫn đến tình trạng người dân đi dạo hay xả rác bừa bãi ra thảm cỏ. Đề nghị ban quản lý công viên bổ sung thêm thùng rác.',
    status: 'pending'
  }
];

async function seed() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Đồng bộ schema nếu cần
    await sequelize.sync({ alter: true });
    console.log('✅ Đồng bộ schema thành công!');

    // Đảm bảo cột applicationId cho phép null
    try {
      await sequelize.query('ALTER TABLE "comments" ALTER COLUMN "applicationId" DROP NOT NULL;');
      console.log('✅ Đã xóa ràng buộc NOT NULL của cột applicationId');
    } catch (e) {
      console.log('ℹ️ Cột applicationId đã cho phép null hoặc có lỗi:', e.message);
    }

    // Lấy một số user citizen để gán làm author
    const citizens = await User.findAll({ where: { role: 'citizen' }, limit: 5 });
    
    const feedbacksToInsert = FEEDBACKS.map((fb, index) => {
      // Gán random citizen nếu có, nếu không thì null
      if (citizens.length > 0) {
        fb.authorId = citizens[index % citizens.length].id;
      }
      return fb;
    });

    await Comment.bulkCreate(feedbacksToInsert);
    console.log(`✅ Đã tạo thành công ${feedbacksToInsert.length} phản ánh, kiến nghị!`);

  } catch (err) {
    console.error('❌ Lỗi khi seed:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
