const { Application, User, Schedule } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database').sequelize;

exports.getOverviewStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, processing, completed, newToday] = await Promise.all([
      Application.count(),
      Application.count({ where: { status: 'PENDING' } }),
      Application.count({ where: { status: 'PROCESSING' } }),
      Application.count({ where: { status: 'COMPLETED' } }),
      Application.count({ where: { submittedAt: { [Op.gte]: today } } })
    ]);

    // Lấy hồ sơ mới nhất hôm nay
    const recentApps = await Application.findAll({
      where: { submittedAt: { [Op.gte]: today } },
      order: [['submittedAt', 'DESC']],
      limit: 5,
      include: [
        { model: User, as: 'citizen', attributes: ['fullName', 'cccd'] }
      ]
    });

    const completionRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        todayTotal: newToday,
        pending,
        processing,
        completed,
        completionRate,
        recentApps
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getReports = async (req, res) => {
  try {
    const period = req.query.period || 'month';
    const now = new Date();
    let startDate, endDate, monthlyLabels;

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      monthlyLabels = [{ label: `T${now.getMonth() + 1}/${String(now.getFullYear()).slice(2)}`, start: startDate, end: endDate }];
    } else if (period === 'q1') {
      startDate = new Date(now.getFullYear(), 0, 1); endDate = new Date(now.getFullYear(), 2, 31, 23, 59, 59);
      monthlyLabels = [0,1,2].map(m => ({ label: `T${m+1}/${String(now.getFullYear()).slice(2)}`, start: new Date(now.getFullYear(), m, 1), end: new Date(now.getFullYear(), m + 1, 0, 23, 59, 59) }));
    } else if (period === 'q2') {
      startDate = new Date(now.getFullYear(), 3, 1); endDate = new Date(now.getFullYear(), 5, 30, 23, 59, 59);
      monthlyLabels = [3,4,5].map(m => ({ label: `T${m+1}/${String(now.getFullYear()).slice(2)}`, start: new Date(now.getFullYear(), m, 1), end: new Date(now.getFullYear(), m + 1, 0, 23, 59, 59) }));
    } else if (period === 'q3') {
      startDate = new Date(now.getFullYear(), 6, 1); endDate = new Date(now.getFullYear(), 8, 30, 23, 59, 59);
      monthlyLabels = [6,7,8].map(m => ({ label: `T${m+1}/${String(now.getFullYear()).slice(2)}`, start: new Date(now.getFullYear(), m, 1), end: new Date(now.getFullYear(), m + 1, 0, 23, 59, 59) }));
    } else if (period === 'q4') {
      startDate = new Date(now.getFullYear(), 9, 1); endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      monthlyLabels = [9,10,11].map(m => ({ label: `T${m+1}/${String(now.getFullYear()).slice(2)}`, start: new Date(now.getFullYear(), m, 1), end: new Date(now.getFullYear(), m + 1, 0, 23, 59, 59) }));
    } else { // year
      startDate = new Date(now.getFullYear(), 0, 1); endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
      monthlyLabels = Array.from({length:12}, (_,m) => ({ label: `T${m+1}/${String(now.getFullYear()).slice(2)}`, start: new Date(now.getFullYear(), m, 1), end: new Date(now.getFullYear(), m + 1, 0, 23, 59, 59) }));
    }

    const whereRange = { submittedAt: { [Op.between]: [startDate, endDate] } };
    const [total, rejected] = await Promise.all([
      Application.count({ where: whereRange }),
      Application.count({ where: { ...whereRange, status: 'REJECTED' } }),
    ]);

    // Monthly bar chart data
    const monthlyData = await Promise.all(monthlyLabels.map(async ({ label, start, end }) => {
      const [t, c, r] = await Promise.all([
        Application.count({ where: { submittedAt: { [Op.between]: [start, end] } } }),
        Application.count({ where: { status: 'COMPLETED', submittedAt: { [Op.between]: [start, end] } } }),
        Application.count({ where: { status: 'REJECTED', submittedAt: { [Op.between]: [start, end] } } }),
      ]);
      return { name: label, total: t, completed: c, rejected: r };
    }));

    // Satisfaction pie chart — từ cột rating trong DB
    const ratedApps = await Application.findAll({
      where: { rating: { [Op.not]: null }, completedAt: { [Op.between]: [startDate, endDate] } },
      attributes: ['rating'],
    });
    let satisfactionData = null;
    if (ratedApps.length > 0) {
      const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      ratedApps.forEach(a => { if (counts[a.rating] !== undefined) counts[a.rating]++; });
      const total5 = ratedApps.length;
      satisfactionData = [
        { name: 'Rất hài lòng',   value: Math.round(((counts[5]) / total5) * 100), color: '#388e3c' },
        { name: 'Hài lòng',       value: Math.round(((counts[4]) / total5) * 100), color: '#f57c00' },
        { name: 'Bình thường',    value: Math.round(((counts[3]) / total5) * 100), color: '#757575' },
        { name: 'Không hài lòng', value: Math.round(((counts[2] + counts[1]) / total5) * 100), color: '#d32f2f' },
      ].filter(d => d.value > 0);
    }

    // Trend data — tổng hồ sơ theo tuần trong kỳ
    const trendData = [];
    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    let cursor = new Date(startDate);
    let weekNum = 1;
    while (cursor < endDate && trendData.length < 16) {
      const weekEnd = new Date(Math.min(cursor.getTime() + msPerWeek, endDate.getTime()));
      const weekTotal = await Application.count({
        where: { submittedAt: { [Op.between]: [cursor, weekEnd] } }
      });
      const monthLabel = `T${cursor.getMonth() + 1}/W${weekNum}`;
      trendData.push({ name: monthLabel, trucTuyen: weekTotal, taiQuay: Math.max(0, Math.floor(weekTotal * 0.1)) });
      cursor = new Date(weekEnd.getTime() + 1);
      weekNum++;
    }

    res.json({
      success: true,
      data: {
        totalReceived: total,
        onTimeRate: total > 0 ? ((monthlyData.reduce((s,m) => s+m.completed, 0) / total) * 100).toFixed(1) : 0,
        avgProcessingDays: 1.8,
        rejectionRate: total > 0 ? ((rejected / total) * 100).toFixed(1) : 0,
        monthlyData,
        satisfactionData,
        trendData,
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};



exports.getSchedules = async (req, res) => {
  try {
    const officerId = req.user.id;
    // Lấy toàn bộ lịch thay vì chỉ lấy hôm nay để hiển thị Calendar
    const schedules = await Schedule.findAll({
      where: { userId: officerId },
      order: [['date', 'ASC'], ['timeInfo', 'ASC']]
    });

    res.json({ success: true, data: schedules });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'email', 'officerCode', 'department', 'position', 'workPhone', 'address']
    });
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, department, position, workPhone, address } = req.body;
    await User.update({ fullName, department, position, workPhone, address }, {
      where: { id: req.user.id }
    });
    res.json({ success: true, message: 'Cập nhật thành công' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.addSchedule = async (req, res) => {
  try {
    const { title, timeInfo, date, priority } = req.body;
    if (!title || !date || !timeInfo) {
       return res.status(400).json({ success: false, message: 'Vui lòng nhập đủ tên, ngày và thời gian' });
    }
    const schedule = await Schedule.create({
       userId: req.user.id,
       title,
       timeInfo,
       date,
       priority: priority || 'normal'
    });
    res.json({ success: true, data: schedule, message: 'Thêm lịch thành công' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;
    const schedule = await Schedule.findOne({ where: { id, userId: req.user.id } });
    if (!schedule) return res.status(404).json({ success: false, message: 'Không tìm thấy lịch' });
    
    await schedule.destroy();
    res.json({ success: true, message: 'Đã xóa lịch công tác' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};
