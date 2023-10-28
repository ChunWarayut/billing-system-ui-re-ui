<template>
  <v-app>
    <Header />
    <Navbar />
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from "../components/Appbar/Navbar.vue";
import Footer from '../components/Appbar/Footer.vue';
import Header from '../components/Appbar/Header.vue'
export default {
  name: 'DefaultLayout',
  components: {
    Navbar,
    Footer,
    Header
  },
  mounted() {
    const vuexLocal = window.localStorage.getItem('vuex');
    const parsed_store = JSON.parse(vuexLocal);
    try {
      if (!parsed_store.auth.isLoggedIn) {
        this.$router.push('/auth')
      }
    } catch (error) {
      console.log('error', error);
      this.$router.push('/auth')
    }
  }
}
</script>
