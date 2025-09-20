export const jobCategories = [
  'บริการลูกค้า',
  'ครัว',
  'ขายปลีก',
  'พาร์ทไทม์',
  'ด่วน'
];

export const seekerJobs = [
  {
    id: 'job-1',
    title: 'พนักงานร้านกาแฟ (เต็มเวลา)',
    company: 'Bean & Brew',
    location: 'สยาม กรุงเทพฯ',
    salary: '18,000-22,000 บาท',
    schedule: 'เช้า / บ่าย',
    badges: ['เริ่มงานทันที', 'มีการฝึกอบรม', 'ประกันสังคม'],
    description: 'บริการลูกค้า ทำเครื่องดื่ม จัดระเบียบสต็อก',
    category: 'บริการลูกค้า'
  },
  {
    id: 'job-2',
    title: 'พนักงานร้านอาหาร (พาร์ทไทม์)',
    company: 'Im-Suk Kitchen',
    location: 'ลาดพร้าว กรุงเทพฯ',
    salary: '60 บาท/ชั่วโมง',
    schedule: 'กะยืดหยุ่น',
    badges: ['วันธรรมดาเท่านั้น', 'อาหารพนักงาน'],
    description: 'เสิร์ฟโต๊ะ รับออเดอร์ ดูแลความสะอาดร้าน',
  },
  {
    id: 'job-3',
    title: 'แคชเชียร์ซุปเปอร์มาร์เก็ต',
    company: 'Daily Mart',
    location: 'เมืองทองธานี นนทบุรี',
    salary: '15,000 บาท',
    schedule: '6 วัน/สัปดาห์',
    badges: ['จ่าย OT', 'หยุด 1 วัน'],
    description: 'รับชำระเงิน เติมสินค้า ปิดยอดรายวัน',
    category: 'ขายปลีก'
  }
];

export const employerJobs = [
  {
    id: 'posting-1',
    title: 'พนักงานขาย',
    status: 'เปิดรับ',
    applicants: 12,
    shifts: ['จันทร์-ศุกร์', 'เสาร์สลับ'],
    notes: 'ต้องการผู้ที่สื่อสารดี ชอบงานขาย'
  },
  {
    id: 'posting-2',
    title: 'ครัวเย็น',
    status: 'สัมภาษณ์',
    applicants: 5,
    shifts: ['18:00-24:00'],
    notes: 'ต้องมีประสบการณ์ในครัวมืออาชีพอย่างน้อย 1 ปี'
  }
];

export const highlightedApplicants = [
  {
    id: 'applicant-1',
    name: 'สิรินุช วงศ์ดี',
    role: 'บริการลูกค้า',
    experience: 'ประสบการณ์ 2 ปี',
    bio: 'เคยทำงานในร้านกาแฟและร้านอาหาร มีทีมเวิร์กดี เชิงรุก'
  },
  {
    id: 'applicant-2',
    name: 'ชัยวัฒน์ ชุนสุข',
    role: 'พนักงานครัว',
    experience: 'ประสบการณ์ 3 ปี',
    bio: 'เชี่ยวชาญอาหารไทย มีพื้นฐานเมนูฟิวชั่น'
  }
];
