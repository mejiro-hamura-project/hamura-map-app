import type { PartialMessages } from '../index';

// Tiếng Việt (Vietnamese). Được phân giải từ vi, vi-VN.
const vi: PartialMessages = {
  common: {
    start: 'Bắt đầu',
    ok: 'OK',
    cancel: 'Hủy',
    back: 'Quay lại',
    resetConfirm:
      'Xóa toàn bộ tiến trình (con dấu, đăng ký, lịch sử đổi quà) và bắt đầu lại từ đầu?',
    resetButton: '(Thử nghiệm) Đặt lại tiến trình và bắt đầu lại',
  },
  header: { line1: 'Lễ hội', line2: 'Rally con dấu' },
  notice: {
    iconAlt: 'Biểu tượng Rally con dấu lễ hội',
    title: 'Lưu ý',
    safetyHeading: 'Đề nghị về an toàn',
    safetyBody:
      'Khuôn viên đền rất đông người. Hãy chú ý xung quanh, không chạy và không va vào người khác. Vừa đi vừa nhìn điện thoại rất nguy hiểm, hãy dừng lại trước khi dùng ứng dụng.',
    privacyHeading: 'Về thông tin cá nhân',
    privacyBody:
      'Thông tin đã đăng ký chỉ được dùng để tổ chức sự kiện, xác nhận đổi quà và mục đích thống kê. Không dùng cho mục đích khác và không cung cấp cho bên thứ ba.',
    otherHeading: 'Khác',
    otherBody:
      'Số lượng quà có hạn và việc đổi quà có thể kết thúc khi hết quà. Mong bạn thông cảm.',
  },
  howto: {
    title: 'Cách chơi',
    imagePlaceholder: 'Hình ảnh',
    steps: [
      { title: 'Tìm mã QR trong khuôn viên!', body: 'Các mã QR của rally được giấu khắp khuôn viên đền. Hãy đi tìm nhé!' },
      { title: 'Quét bằng camera!', body: 'Chỉ cần hướng camera của ứng dụng vào mã QR. Sau khi đọc được sẽ tự động kiểm tra.' },
      { title: 'Thu thập ký tự!', body: 'Mỗi lần quét được một ký tự. Thu đủ 7 ký tự để hoàn thành cụm từ bí ẩn.' },
      { title: 'Hoàn thành cụm từ và đổi quà!', body: 'Khi có đủ 7, hãy đến chính điện. Cho nhân viên xem màn hình ứng dụng để nhận quà!' },
    ],
  },
  register: {
    title: 'Đăng ký người tham gia',
    nicknameLabel: 'Biệt danh (không bắt buộc)',
    nicknamePlaceholder: 'ví dụ: Người đi hội',
    genderLabel: 'Giới tính',
    ageLabel: 'Nhóm tuổi',
    required: 'Bắt buộc',
    selectPlaceholder: 'Vui lòng chọn',
    genderError: 'Vui lòng chọn giới tính',
    ageError: 'Vui lòng chọn nhóm tuổi',
    submit: 'Tham gia',
    gender: { male: 'Nam', female: 'Nữ', other: 'Khác' },
    age: { student: 'Học sinh/Sinh viên', '10s': 'Thiếu niên', '20s': '20–29', '30s': '30–39', '40s': '40–49', '50s': '50–59', '60plus': '60 trở lên' },
  },
  rally: {
    countLabel: 'Số con dấu đã có',
    completeBanner1: 'Bạn đã thu đủ 7 con dấu!',
    completeBanner2: 'Hãy nghĩ đúng thứ tự và thử thách cụm từ.',
    phraseSolvedBanner: 'Đã hoàn thành cụm từ! Đổi quà tại chính điện',
    exchangedBanner: 'Việc đổi quà đã hoàn tất',
    challengeCta: 'Thử thách',
    exchangeCta: 'Đến phần đổi quà',
    cameraCta: '📷 Bật camera',
  },
  camera: {
    instruction: 'Đưa mã QR vào trong khung',
    permissionDenied: 'Chưa được phép truy cập camera. Hãy cho phép camera trong cài đặt trình duyệt.',
    duplicate: 'Bạn đã có mã QR này rồi',
    invalid: 'Mã QR này không thuộc rally',
    demoScanButton: 'Tải mã QR demo',
    debugLabel: 'Gỡ lỗi (ẩn ở bản chính thức): cấp con dấu không cần camera',
  },
  reveal: { title: 'Nhận được ký tự!', stampGet: 'NHẬN ĐƯỢC CON DẤU!', close: 'Đóng' },
  challenge: {
    title: 'Thử thách cụm từ',
    instruction: 'Sắp xếp lại 7 ký tự để tạo thành cụm từ đúng!',
    wrong: 'Tiếc quá, chưa đúng. Hãy thử lại!',
    available: 'Ký tự của bạn (chạm để đặt)',
    checkCta: 'Kiểm tra thứ tự này',
    exchangeCta: 'Đến phần đổi quà',
    correctTitle: 'Chính xác! Hoàn thành!',
    correctBody: 'Chúc mừng! Bạn đã hoàn thành cụm từ.',
  },
  exchange: {
    phraseLabel: 'Cụm từ đã hoàn thành',
    title1: 'Rally con dấu',
    title2: 'Phần thưởng hoàn thành — Quầy đổi quà',
    staffNotice1: 'Việc đổi quà phải do nhân viên thao tác.',
    staffNotice2: 'Vui lòng đưa điện thoại cho nhân viên.',
    exchangeButton: 'Đổi',
    done: 'Đã đổi',
    confirmQuestion: 'Bạn có chắc muốn đổi không?',
    staffHeading: 'Chỉ dành cho nhân viên',
    staffPasscodePlaceholder: 'Mã nhân viên',
    staffPasscodeError: 'Mã không đúng',
  },
};

export default vi;
