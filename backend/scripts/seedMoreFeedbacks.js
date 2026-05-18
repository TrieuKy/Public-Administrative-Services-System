require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/database');
const { Comment, User } = require('../src/models');

const MORE_FEEDBACKS = [
  {
    type: 'feedback',
    topic: 'An ninh trật tự',
    title: 'Trộm cắp xe máy tại khu vực chợ',
    content: 'Gần đây tại khu vực chợ trung tâm phường thường xuyên xảy ra tình trạng mất trộm xe máy của người đi chợ. Đề nghị công an phường tăng cường tuần tra và lắp thêm camera an ninh.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'An ninh trật tự',
    title: 'Thường xuyên đánh nhau tại quán nhậu',
    content: 'Quán nhậu XYZ trên đường Lê Lợi thường xuyên mở cửa quá giờ, khách nhậu say xỉn la hét và đánh nhau làm mất trật tự công cộng. Mong cơ quan có thẩm quyền xử lý nghiêm.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Môi trường',
    title: 'Đốt rác thải nhựa gây ô nhiễm không khí',
    content: 'Có một số hộ dân ở bãi đất trống cuối khu phố 2 thường xuyên gom rác thải nhựa và cao su đốt vào chiều muộn, khói đen mù mịt bay vào khu dân cư gây khó thở. Đề nghị phường xuống nhắc nhở.',
    status: 'resolved'
  },
  {
    type: 'feedback',
    topic: 'Môi trường',
    title: 'Khu vực hồ điều hòa bị xả rác bốc mùi',
    content: 'Hồ điều hòa của khu vực đang trở thành nơi tập kết rác thải của một số người dân thiếu ý thức. Nước hồ chuyển màu đen và bốc mùi hôi thối, ảnh hưởng sức khỏe người dân quanh hồ.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Giao thông đô thị',
    title: 'Lấn chiếm vỉa hè làm nơi đỗ xe',
    content: 'Các cửa hàng kinh doanh trên đường Nguyễn Huệ lấn chiếm toàn bộ vỉa hè để bày hàng và đậu xe cho khách, người đi bộ buộc phải đi xuống lòng đường rất nguy hiểm. Kính nghị cơ quan trật tự đô thị dọn dẹp vỉa hè.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Giao thông đô thị',
    title: 'Xe tải chạy quá tốc độ trong khu dân cư',
    content: 'Đường liên ấp hiện nay có rất nhiều xe tải chở vật liệu xây dựng chạy tốc độ cao, bóp còi inh ỏi bất kể ngày đêm, gây nguy hiểm cho trẻ em và người già. Mong có biện pháp hạn chế tốc độ.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Thủ tục hành chính',
    title: 'Ứng dụng dịch vụ công thường xuyên báo lỗi',
    content: 'Khi tôi cố gắng nộp hồ sơ xin giấy phép xây dựng qua ứng dụng, đến bước đính kèm tệp tin thì hệ thống cứ báo lỗi và văng ra ngoài. Rất bất tiện, mong đội ngũ kỹ thuật sớm khắc phục.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Thủ tục hành chính',
    title: 'Cán bộ từ chối hồ sơ không rõ lý do',
    content: 'Tôi nộp hồ sơ đăng ký kinh doanh online nhưng bị trả lại với lý do chung chung là "Hồ sơ không hợp lệ" mà không chỉ rõ sai ở đâu để tôi sửa. Việc này gây mất thời gian cho công dân.',
    status: 'resolved'
  },
  {
    type: 'feedback',
    topic: 'Hạ tầng',
    title: 'Bóng đèn đường bị cháy hỏng nhiều ngày',
    content: 'Dãy cột đèn chiếu sáng công cộng từ số nhà 10 đến 50 trên đường Trần Phú đã bị cháy bóng hơn một tuần nay. Buổi tối đường rất tối, tiềm ẩn nguy cơ tai nạn giao thông và trộm cắp.',
    status: 'pending'
  },
  {
    type: 'feedback',
    topic: 'Hạ tầng',
    title: 'Đường nội bộ khu dân cư bị sụt lún',
    content: 'Sau đợt mưa bão vừa qua, đoạn đường bê tông vào hẻm 88 bị sụt lún tạo thành một hố sâu khá lớn. Người dân đã tạm che chắn nhưng cần chính quyền hỗ trợ sửa chữa để đảm bảo lưu thông.',
    status: 'pending'
  }
];

async function seed() {
  try {
    console.log('🔄 Đang kết nối database...');
    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Lấy một số user citizen để gán làm author
    const citizens = await User.findAll({ where: { role: 'citizen' }, limit: 5 });
    
    const feedbacksToInsert = MORE_FEEDBACKS.map((fb, index) => {
      // Gán random citizen nếu có, nếu không thì null
      if (citizens.length > 0) {
        fb.authorId = citizens[index % citizens.length].id;
      }
      return fb;
    });

    await Comment.bulkCreate(feedbacksToInsert);
    console.log(`✅ Đã tạo thêm thành công ${feedbacksToInsert.length} phản ánh, kiến nghị!`);

  } catch (err) {
    console.error('❌ Lỗi khi seed:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
