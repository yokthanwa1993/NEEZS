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
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1200&auto=format&fit=crop',
    workHours: '09:00-18:00',
    endAt: '30/09 18:00',
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
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop',
    workHours: '17:00-22:00',
    endAt: '15/10 22:00',
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
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31b?q=80&w=1200&auto=format&fit=crop',
    workHours: '10:00-20:00',
    endAt: '05/10 20:00',
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
    workHours: '10:00-19:00',
    endAt: '30/09 18:00',
    notes: 'ต้องการผู้ที่สื่อสารดี ชอบงานขาย'
  },
  {
    id: 'posting-2',
    title: 'ครัวเย็น',
    status: 'สัมภาษณ์',
    applicants: 5,
    shifts: ['18:00-24:00'],
    workHours: '18:00-24:00',
    endAt: '15/10 24:00',
    notes: 'ต้องมีประสบการณ์ในครัวมืออาชีพอย่างน้อย 1 ปี'
  }
];

export const highlightedApplicants = [
  { id: 'applicant-1',  name: 'สิรินุช วงศ์ดี',    role: 'บริการลูกค้า',   experience: 'ประสบการณ์ 2 ปี',  bio: 'เคยทำงานในร้านกาแฟและร้านอาหาร มีทีมเวิร์กดี เชิงรุก' },
  { id: 'applicant-2',  name: 'ชัยวัฒน์ ชุนสุข',  role: 'พนักงานครัว',   experience: 'ประสบการณ์ 3 ปี',  bio: 'เชี่ยวชาญอาหารไทย มีพื้นฐานเมนูฟิวชั่น' },
  { id: 'applicant-3',  name: 'วริษฐา แสงทอง',    role: 'แคชเชียร์',      experience: 'ประสบการณ์ 1 ปี',  bio: 'แม่นยำ ใส่ใจตัวเลข และบริการด้วยรอยยิ้ม' },
  { id: 'applicant-4',  name: 'กฤตภพ อินทร์น้อย', role: 'เดลิเวอรี่',     experience: 'ประสบการณ์ 2 ปี',  bio: 'รู้เส้นทางในเมืองดี ขับขี่ปลอดภัย ตรงต่อเวลา' },
  { id: 'applicant-5',  name: 'พรพิมล สายชล',     role: 'แม่บ้าน',        experience: 'ประสบการณ์ 4 ปี',  bio: 'งานละเอียด เรียบร้อย ตรวจเช็คความสะอาดเชิงลึก' },
  { id: 'applicant-6',  name: 'ปิยะ ไตรภพ',       role: 'สต๊อกสินค้า',    experience: 'ประสบการณ์ 2 ปี',  bio: 'จัดการสต๊อก คลังสินค้า ใช้ระบบบาร์โค้ดได้คล่อง' },
  { id: 'applicant-7',  name: 'ณิชาอร รัตนพงษ์',  role: 'พนักงานต้อนรับ', experience: 'ประสบการณ์ 3 ปี',  bio: 'บุคลิกดี สื่อสารอังกฤษพื้นฐานได้' },
  { id: 'applicant-8',  name: 'กมลชนก บุณยทรัพย์',role: 'เสิร์ฟ',         experience: 'ประสบการณ์ 1 ปี',  bio: 'บริการรวดเร็ว ยิ้มแย้ม แก้ปัญหาเฉพาะหน้าได้' },
  { id: 'applicant-9',  name: 'ณัฐพล สุริยะ',     role: 'บาริสต้า',       experience: 'ประสบการณ์ 2 ปี',  bio: 'ชงกาแฟสเปเชียลตี้ได้ ครีเอทีฟเมนูใหม่' },
  { id: 'applicant-10', name: 'อริสรา มีสุข',      role: 'พนักงานขาย',     experience: 'ประสบการณ์ 2 ปี',  bio: 'ชอบงานบริการ ชอบพบลูกค้า และปิดการขาย' },
  { id: 'applicant-11', name: 'ภูผา ยิ้มแฉ่ง',     role: 'ขับรถส่งสินค้า', experience: 'ประสบการณ์ 5 ปี',  bio: 'ขับรถตู้/ปิคอัพได้ มีใบอนุญาตและประวัติดี' },
  { id: 'applicant-12', name: 'นิศาชล แก้วใส',     role: 'แอดมินเพจ',      experience: 'ประสบการณ์ 2 ปี',  bio: 'ตอบแชทไว ใช้เครื่องมือโซเชียลและไลฟ์ขายของได้' },
];
