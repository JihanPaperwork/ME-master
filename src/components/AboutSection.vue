<script setup>
import { ref, onMounted } from 'vue';
import { fetchAboutMeData } from '../services/api.js'; // Import fungsi fetch

const aboutMe = ref(null);

onMounted(async () => {
  aboutMe.value = await fetchAboutMeData();
});
</script>

<template>
  <section class="text-center fade-in">
    <img :src="aboutMe?.profile_pic_url || 'https://res.cloudinary.com/ds0jhgiee/image/upload/v1752217373/WhatsApp_Image_2025-07-10_at_20.39.55_qvj4pk.jpg'" alt="Foto Jihan" class="profile-pic mb-4">
    <h1 class="fw-bold display-4">{{ aboutMe?.name || 'Jihan Humaira' }}</h1>
    <p class="lead mb-3">{{ aboutMe?.title || 'Mahasiswa Informatika Universitas Amikom' }}</p>
    <p class="fs-5">
      {{ aboutMe?.description || 'Loading...' }}
    </p>
  </section>
</template>

<style scoped>
/* No specific scoped styles needed, global styles from main.css apply */
</style>