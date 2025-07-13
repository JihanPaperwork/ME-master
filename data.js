// ME-master/data.js

let nextAboutMeId = 1;
let nextEducationId = 1;
let nextSkillCategoryId = 1;
let nextSkillId = 1;
let nextExperienceId = 1;
let nextProjectId = 1;
let nextContactInfoId = 1;
let nextDashboardInfoId = 1;

const about_me = [
  { id: nextAboutMeId++, name: 'Jihan Humaira', title: 'Mahasiswa Informatika', description: 'Seorang mahasiswa yang bersemangat dalam pengembangan web dan data science.', profile_pic_url: 'https://res.cloudinary.com/ds0jhgiee/image/upload/v1752217373/WhatsApp_Image_2025-07-10_at_20.39.55_qvj4pk.jpg' }
];

const education = [
  { id: nextEducationId++, institution: 'Universitas AMIKOM Yogyakarta', degree: 'S1 Informatika', years: '2022 - Sekarang' },
  { id: nextEducationId++, institution: 'SMA Negeri 1 Contoh', degree: 'IPA', years: '2019 - 2022' }
];

const skill_categories = [
  { id: nextSkillCategoryId++, name: 'Programming Languages' },
  { id: nextSkillCategoryId++, name: 'Web Development' },
  { id: nextSkillCategoryId++, name: 'Databases' }
];

const skills = [
  { id: nextSkillId++, name: 'JavaScript', category_id: 1 },
  { id: nextSkillId++, name: 'Python', category_id: 1 },
  { id: nextSkillId++, name: 'Vue.js', category_id: 2 },
  { id: nextSkillId++, name: 'Node.js', category_id: 2 },
  { id: nextSkillId++, name: 'Express.js', category_id: 2 },
  { id: nextSkillId++, name: 'PostgreSQL', category_id: 3 }
];

const experiences = [
  { id: nextExperienceId++, title: 'Asisten Laboratorium Pemrograman Web', company: 'Universitas AMIKOM Yogyakarta', duration: '2023 - Sekarang', description: 'Membantu mahasiswa dalam praktikum pemrograman web.' },
  { id: nextExperienceId++, title: 'Web Developer Intern', company: 'PT. Teknologi Maju', duration: 'Juni - Agustus 2024', description: 'Mengembangkan dan memelihara fitur-fitur website perusahaan.' }
];

const projects = [
  { id: nextProjectId++, title: 'Sistem Manajemen Perpustakaan', description: 'Aplikasi web untuk pengelolaan buku dan peminjaman.', technologies: 'Vue.js, Express.js, PostgreSQL' },
  { id: nextProjectId++, title: 'Website Portofolio Pribadi', description: 'Website untuk menampilkan proyek dan pengalaman pribadi.', technologies: 'Vue.js, Tailwind CSS' }
];

const contact_info = [
  { id: nextContactInfoId++, type: 'Email', value: 'jihan.humaira@example.com', url: 'mailto:jihan.humaira@example.com' },
  { id: nextContactInfoId++, type: 'LinkedIn', value: 'jihan-humaira', url: 'https://www.linkedin.com/in/jihan-humaira' }
];

const dashboard_info = [
    { id: nextDashboardInfoId++, title: 'Total Education Entries', value: education.length },
    { id: nextDashboardInfoId++, title: 'Total Skill Categories', value: skill_categories.length },
    { id: nextDashboardInfoId++, title: 'Total Skills', value: skills.length },
    { id: nextDashboardInfoId++, title: 'Total Experience Entries', value: experiences.length },
    { id: nextDashboardInfoId++, title: 'Total Project Entries', value: projects.length },
    { id: nextDashboardInfoId++, title: 'Total Contact Entries', value: contact_info.length }
];

// Untuk keperluan login, kita akan menggunakan array users in-memory.
// Dalam aplikasi nyata, ini harus disimpan dengan aman dan tidak hardcoded.
const users = [
  { id: 1, username: 'admin', password: 'password123', role: 'admin' } // CATATAN: Password ini hanya untuk DEMO. TIDAK AMAN UNTUK PRODUKSI.
];

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
  nextAboutMeId,
  nextEducationId,
  nextSkillCategoryId,
  nextSkillId,
  nextExperienceId,
  nextProjectId,
  nextContactInfoId,
  nextDashboardInfoId
};