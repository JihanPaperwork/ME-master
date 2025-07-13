// ME-master/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import authMiddleware from './middleware/authMiddleware.js';

// Import data in-memory dari data.js
import {
  about_me,
  education,
  skill_categories,
  skills,
  experiences,
  projects,
  contact_info,
  dashboard_info,
  users, // Gunakan users dari data.js untuk simulasi login
  nextAboutMeId,
  nextEducationId,
  nextSkillCategoryId,
  nextSkillId,
  nextExperienceId,
  nextProjectId,
  nextContactInfoId,
  nextDashboardInfoId
} from './data.js';

// Load environment variables (masih dibutuhkan untuk JWT_SECRET)
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Get __dirname equivalent in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes for Authentication ---

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Cari user di array users in-memory
    const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials - User not found' });
    }

    // Bandingkan password (simulasi, karena kita tidak menyimpan hash sebenarnya di data.js)
    // Dalam implementasi nyata, Anda akan menggunakan bcrypt.compare(password, user.password_hash);
    const isMatch = (password === user.password); // Mengganti bcrypt.compare dengan perbandingan langsung untuk demo JSON

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials - Password mismatch' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your_jwt_secret_key', // Gunakan secret dari .env atau fallback
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// --- API Routes for Dynamic Content (Protected) ---

// API for Dashboard Info (Menggunakan data in-memory)
app.get('/api/dashboard', authMiddleware, async (req, res) => {
  try {
    // Perbarui nilai dashboard_info secara dinamis
    dashboard_info[0].value = education.length; // Total Education Entries
    dashboard_info[1].value = skill_categories.length; // Total Skill Categories
    dashboard_info[2].value = skills.length; // Total Skills
    dashboard_info[3].value = experiences.length; // Total Experience Entries
    dashboard_info[4].value = projects.length; // Total Project Entries
    dashboard_info[5].value = contact_info.length; // Total Contact Entries

    res.json(dashboard_info);
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// ABOUT ME CRUD (In-memory)
app.get('/api/about', async (req, res) => {
  try {
    if (about_me.length > 0) {
      res.json(about_me[0]); // Asumsi hanya ada satu entri About Me
    } else {
      res.status(404).json({ message: 'About Me data not found' });
    }
  } catch (err) {
    console.error('Error fetching about me data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/about', authMiddleware, async (req, res) => {
  const { name, title, description, profile_pic_url } = req.body;
  if (!name || !title) {
    return res.status(400).json({ msg: 'Name and title are required for About Me.' });
  }
  try {
    // Untuk About Me, kita biasanya hanya UPDATE satu entri. Jika belum ada, kita bisa membuatnya.
    if (about_me.length === 0) {
      const newEntry = { id: nextAboutMeId++, name, title, description, profile_pic_url };
      about_me.push(newEntry);
      res.status(201).json(newEntry);
    } else {
      // Jika sudah ada, kita anggap ini adalah update
      const existingEntry = about_me[0];
      existingEntry.name = name;
      existingEntry.title = title;
      existingEntry.description = description;
      existingEntry.profile_pic_url = profile_pic_url;
      res.json(existingEntry);
    }
  } catch (err) {
    console.error('Error creating/updating about me data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/about/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, title, description, profile_pic_url } = req.body;
  if (!name || !title) {
    return res.status(400).json({ msg: 'Name and title are required for About Me.' });
  }
  try {
    const index = about_me.findIndex(item => item.id == id);
    if (index === -1) {
      return res.status(404).json({ msg: 'About Me entry not found' });
    }
    about_me[index] = { ...about_me[index], name, title, description, profile_pic_url };
    res.json(about_me[index]);
  } catch (err) {
    console.error('Error updating about me data:', err.message);
    res.status(500).send('Server Error');
  }
});


// EDUCATION CRUD (In-memory)
app.get('/api/education', async (req, res) => {
  try {
    // Pastikan education adalah let agar bisa diubah
    let currentEducation = [...education]; // Buat salinan untuk sorting
    res.json(currentEducation.sort((a, b) => {
        // Mengasumsikan 'years' adalah string dalam format "YYYY - YYYY" atau "YYYY - Sekarang"
        const yearA = parseInt(a.years.split(' - ')[0]);
        const yearB = parseInt(b.years.split(' - ')[0]);
        return yearB - yearA; // Urutkan dari tahun terbaru ke terlama
    }));
  } catch (err) {
    console.error('Error fetching education data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/education', authMiddleware, async (req, res) => {
  const { institution, degree, years } = req.body;
  if (!institution || !degree || !years) {
    return res.status(400).json({ msg: 'All fields are required for Education.' });
  }
  try {
    const newEntry = { id: nextEducationId++, institution, degree, years };
    education.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating education data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/education/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { institution, degree, years } = req.body;
  if (!institution || !degree || !years) {
    return res.status(400).json({ msg: 'All fields are required for Education.' });
  }
  try {
    const index = education.findIndex(item => item.id == id);
    if (index === -1) {
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    education[index] = { ...education[index], institution, degree, years };
    res.json(education[index]);
  }
   catch (err) {
    console.error('Error updating education data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/education/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = education.length;
    let newEducation = education.filter(item => item.id != id);
    if (newEducation.length === initialLength) { // Periksa panjang setelah filter
      return res.status(404).json({ msg: 'Education entry not found' });
    }
    education.splice(0, education.length, ...newEducation); // Perbarui array global
    res.json({ msg: 'Education entry deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting education data:', err.message);
    res.status(500).send('Server Error');
  }
});

// SKILL CATEGORIES & SKILLS CRUD (In-memory)
app.get('/api/skills', async (req, res) => { // Reads all skills categorized for public display
  try {
    const skillsByCategory = skill_categories.reduce((acc, category) => {
      acc[category.name] = skills
        .filter(skill => skill.category_id === category.id)
        .map(skill => ({ id: skill.id, name: skill.name }));
      return acc;
    }, {});
    res.json(skillsByCategory);
  } catch (err) {
    console.error('Error fetching skills data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

// Manage Skill Categories (In-memory)
app.get('/api/skill-categories', authMiddleware, async (req, res) => {
  try {
    res.json(skill_categories.sort((a, b) => a.name.localeCompare(b.name)));
  } catch (err) {
    console.error('Error fetching skill categories:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/skill-categories', authMiddleware, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Category name is required.' });
  try {
    const newEntry = { id: nextSkillCategoryId++, name };
    skill_categories.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating skill category:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/skill-categories/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ msg: 'Category name is required.' });
  try {
    const index = skill_categories.findIndex(item => item.id == id);
    if (index === -1) return res.status(404).json({ msg: 'Category not found.' });
    skill_categories[index] = { ...skill_categories[index], name };
    res.json(skill_categories[index]);
  } catch (err) {
    console.error('Error updating skill category:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/skill-categories/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = skill_categories.length;
    let newSkillCategories = skill_categories.filter(item => item.id != id);
    if (newSkillCategories.length === initialLength) {
      return res.status(404).json({ msg: 'Category not found.' });
    }
    skill_categories.splice(0, skill_categories.length, ...newSkillCategories); // Perbarui array global

    // Juga hapus skill yang terkait dengan kategori ini
    let newSkills = skills.filter(skill => skill.category_id != id);
    skills.splice(0, skills.length, ...newSkills); // Perbarui array global skills

    res.json({ msg: 'Category deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting skill category:', err.message);
    res.status(500).send('Server Error');
  }
});

// Manage Individual Skills (In-memory)
app.get('/api/individual-skills', authMiddleware, async (req, res) => { // Get all skills with category name
  try {
    const result = skills.map(skill => {
      const category = skill_categories.find(cat => cat.id === skill.category_id);
      return {
        id: skill.id,
        name: skill.name,
        category_id: skill.category_id,
        category_name: category ? category.name : 'Uncategorized'
      };
    });
    res.json(result);
  } catch (err) {
    console.error('Error fetching individual skills:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/individual-skills', authMiddleware, async (req, res) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json({ msg: 'Skill name and category ID are required.' });
  try {
    const newEntry = { id: nextSkillId++, name, category_id: parseInt(category_id) };
    skills.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating individual skill:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/individual-skills/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json({ msg: 'Skill name and category ID are required.' });
  try {
    const index = skills.findIndex(item => item.id == id);
    if (index === -1) return res.status(404).json({ msg: 'Skill not found.' });
    skills[index] = { ...skills[index], name, category_id: parseInt(category_id) };
    res.json(skills[index]);
  } catch (err) {
    console.error('Error updating individual skill:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/individual-skills/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = skills.length;
    let newSkills = skills.filter(item => item.id != id);
    if (newSkills.length === initialLength) {
      return res.status(404).json({ msg: 'Skill not found.' });
    }
    skills.splice(0, skills.length, ...newSkills); // Perbarui array global
    res.json({ msg: 'Skill deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting individual skill:', err.message);
    res.status(500).send('Server Error');
  }
});


// EXPERIENCES CRUD (In-memory)
app.get('/api/experience', async (req, res) => {
  try {
    let currentExperiences = [...experiences];
    res.json(currentExperiences.sort((a, b) => b.id - a.id));
  } catch (err) {
    console.error('Error fetching experience data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/experience', authMiddleware, async (req, res) => {
  const { title, company, duration, description } = req.body;
  if (!title || !company || !duration || !description) {
    return res.status(400).json({ msg: 'All fields are required for Experience.' });
  }
  try {
    const newEntry = { id: nextExperienceId++, title, company, duration, description };
    experiences.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating experience data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/experience/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, company, duration, description } = req.body;
  if (!title || !company || !duration || !description) {
    return res.status(400).json({ msg: 'All fields are required for Experience.' });
  }
  try {
    const index = experiences.findIndex(item => item.id == id);
    if (index === -1) {
      return res.status(404).json({ msg: 'Experience entry not found' });
    }
    experiences[index] = { ...experiences[index], title, company, duration, description };
    res.json(experiences[index]);
  } catch (err) {
    console.error('Error updating experience data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/experience/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = experiences.length;
    let newExperiences = experiences.filter(item => item.id != id);
    if (newExperiences.length === initialLength) {
      return res.status(404).json({ msg: 'Experience entry not found' });
    }
    experiences.splice(0, experiences.length, ...newExperiences); // Perbarui array global
    res.json({ msg: 'Experience entry deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting experience data:', err.message);
    res.status(500).send('Server Error');
  }
});


// PROJECTS CRUD (In-memory)
app.get('/api/projects', async (req, res) => {
  try {
    let currentProjects = [...projects];
    res.json(currentProjects.sort((a, b) => b.id - a.id));
  } catch (err) {
    console.error('Error fetching projects data:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/projects', authMiddleware, async (req, res) => {
  const { title, description, technologies } = req.body;
  if (!title || !description || !technologies) {
    return res.status(400).json({ msg: 'All fields are required for Project.' });
  }
  try {
    const newEntry = { id: nextProjectId++, title, description, technologies };
    projects.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating project data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { title, description, technologies } = req.body;
  if (!title || !description || !technologies) {
    return res.status(400).json({ msg: 'All fields are required for Project.' });
  }
  try {
    const index = projects.findIndex(item => item.id == id);
    if (index === -1) {
      return res.status(404).json({ msg: 'Project entry not found' });
    }
    projects[index] = { ...projects[index], title, description, technologies };
    res.json(projects[index]);
  } catch (err) {
    console.error('Error updating project data:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/projects/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = projects.length;
    let newProjects = projects.filter(item => item.id != id);
    if (newProjects.length === initialLength) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    projects.splice(0, projects.length, ...newProjects); // Perbarui array global
    res.json({ msg: 'Project deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting project data:', err.message);
    res.status(500).send('Server Error');
  }
});


// CONTACT INFO CRUD (In-memory)
app.get('/api/contact', async (req, res) => {
  try {
    let currentContactInfo = [...contact_info];
    res.json(currentContactInfo.sort((a, b) => a.id - b.id));
  } catch (err) {
    console.error('Error fetching contact info:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

app.post('/api/contact', authMiddleware, async (req, res) => {
  const { type, value, url } = req.body;
  if (!type || !value) {
    return res.status(400).json({ msg: 'Type and value are required for Contact Info.' });
  }
  try {
    const newEntry = { id: nextContactInfoId++, type, value, url };
    contact_info.push(newEntry);
    res.status(201).json(newEntry);
  } catch (err) {
    console.error('Error creating contact info:', err.message);
    res.status(500).send('Server Error');
  }
});

app.put('/api/contact/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { type, value, url } = req.body;
  if (!type || !value) {
    return res.status(400).json({ msg: 'Type and value are required for Contact Info.' });
  }
  try {
    const index = contact_info.findIndex(item => item.id == id);
    if (index === -1) {
      return res.status(404).json({ msg: 'Contact info entry not found' });
    }
    contact_info[index] = { ...contact_info[index], type, value, url };
    res.json(contact_info[index]);
  } catch (err) {
    console.error('Error updating contact info:', err.message);
    res.status(500).send('Server Error');
  }
});

app.delete('/api/contact/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const initialLength = contact_info.length;
    let newContactInfo = contact_info.filter(item => item.id != id);
    if (newContactInfo.length === initialLength) {
      return res.status(404).json({ msg: 'Contact info entry not found' });
    }
    contact_info.splice(0, contact_info.length, ...newContactInfo); // Perbarui array global
    res.json({ msg: 'Contact info entry deleted', id: parseInt(id) });
  } catch (err) {
    console.error('Error deleting contact info:', err.message);
    res.status(500).send('Server Error');
  }
});


// Serve static files from the Vue.js dist folder in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`In development, frontend runs on Vue's dev server (e.g., http://localhost:5173).`);
});