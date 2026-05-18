require('dotenv').config({ path: '../.env' });
const { User } = require('../src/models');
const { sequelize } = require('../src/config/database');
const bcrypt = require('bcrypt');

async function fixOfficerAccount() {
  try {
    await sequelize.authenticate();
    
    // Tìm tài khoản cán bộ có thể bị sai role hoặc password.
    // Thường email của cán bộ sẽ là officer@... hoặc ta có thể tìm user có officerCode
    // Hoặc ta reset người dùng có cccd '012345678901' (nếu đó là cán bộ mặc định).
    
    // Let's find any user that has 'officer' in email, or just find the one that should be officer
    const officer = await User.findOne({
      where: {
        email: 'officer@example.com' // Thay đổi nếu email cán bộ khác
      }
    });

    if (!officer) {
        // Nếu không tìm thấy bằng email, ta có thể tìm theo officerCode
        const officerByCode = await User.findOne({ where: { officerCode: 'CB001' } });
        if (officerByCode) {
            await officerByCode.update({
                role: 'officer',
                password: 'password123', // hooks beforeUpdate sẽ hash cái này
                isVerified: true
            });
            console.log('✅ Đã khôi phục tài khoản cán bộ (CB001). Mật khẩu mới là: password123');
        } else {
            console.log('❌ Không tìm thấy tài khoản cán bộ mặc định.');
        }
    } else {
        await officer.update({
            role: 'officer',
            password: 'password123', // hooks beforeUpdate sẽ hash cái này
            isVerified: true
        });
        console.log(`✅ Đã khôi phục tài khoản cán bộ (${officer.email}). Mật khẩu mới là: password123`);
    }

  } catch (error) {
    console.error('Lỗi:', error);
  } finally {
    await sequelize.close();
  }
}

fixOfficerAccount();
