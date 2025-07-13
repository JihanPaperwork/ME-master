// ME-master/data.js

// Hapus deklarasi nextId di sini. Kita akan menentukannya secara dinamis.

let about_me = [
  { id: 1, name: 'Jihan Humaira', title: 'Mahasiswa Informatika Universitas Amikom', description: 'Seorang mahasiswa yang bersemangat dalam pengembangan web dan data science.', profile_pic_url: 'https://res.cloudinary.com/ds0jhgiee/image/upload/v1752217373/WhatsApp_Image_2025-07-10_at_20.39.55_qvj4pk.jpg' }
];

let education = [
  { id: 1, institution: 'Universitas AMIKOM Yogyakarta', degree: 'S1 Informatika', years: '2022 - Sekarang' },
  { id: 2, institution: 'SMK IT RR Rejang Lebong', degree: 'IPA', years: '2019 - 2022' }
];

let skill_categories = [
  { id: 1, name: 'Programming Languages' },
  { id: 2, name: 'Web Development' },
  { id: 3, name: 'Databases' }
];

let skills = [
  { id: 1, name: 'JavaScript', category_id: 1 },
  { id: 2, name: 'Python', category_id: 1 },
  { id: 3, name: 'Vue.js', category_id: 2 },
  { id: 4, name: 'Node.js', category_id: 2 },
  { id: 5, name: 'Express.js', category_id: 2 },
  { id: 6, name: 'PostgreSQL', category_id: 3 }
];

let experiences = [
  { id: 1, title: 'Gamelab Apprenticeship', company: 'Gamelab', duration: 'Juni - Agustus 2024', description: 'Belajar Web Development.' }
];

let projects = [
  { id: 1, title: 'Sistem Manajemen Perpustakaan', description: 'Aplikasi web untuk pengelolaan buku dan peminjaman.', technologies: 'Vue.js, Express.js, PostgreSQL' },
  { id: 2, title: 'Website Portofolio Pribadi', description: 'Website untuk menampilkan proyek dan pengalaman pribadi.', technologies: 'Vue.js, Tailwind CSS' }
];

let contact_info = [
  { id: 1, type: 'Email', value: 'jihanjihan05hum@gmail.com', url: 'mailto:jihanjihan05hum@gmail.com' },
  { id: 2, type: 'LinkedIn', value: 'jihan-humaira', url: 'https://www.linkedin.com/in/jihan-humaira-2b4491261/' }
];

// dashboard_info akan diinisialisasi dan diperbarui di server.js
let dashboard_info = [
    { id: 1, title: 'Total Education Entries', value: 0 },
    { id: 2, title: 'Total Skill Categories', value: 0 },
    { id: 3, title: 'Total Skills', value: 0 },
    { id: 4, title: 'Total Experience Entries', value: 0 },
    { id: 5, title: 'Total Project Entries', value: 0 },
    { id: 6, title: 'Total Contact Entries', value: 0 }
];

let users = [
  { id: 1, username: 'admin', password: 'password123', role: 'admin' }
];

// Fungsi untuk mendapatkan ID baru secara dinamis
const getNextId = (array) => {
  if (array.length === 0) {
    return 1;
  }
  return Math.max(...array.map(item => item.id)) + 1;
};

export {
  about_me,
  education,
  skill_categories,
  skills,
  experiences,
  projects,
  contact_info,
  dashboard_info,
  users,
  getNextId // Export fungsi getNextId
};