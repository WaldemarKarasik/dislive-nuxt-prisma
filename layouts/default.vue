<template>
  <div class="grid-container">
    <Header @toggleDrawer="() => (drawerOpened = !drawerOpened)" />
    <Aside
      @closeDrawer="() => (drawerOpened = false)"
      :drawerOpened="drawerOpened"
    />
    <div class="main">
      <Nuxt />
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import Aside from '../components/layout/Aside'
export default {
  components: {
    Header: Header,
    Footer: Footer,
    Aside: Aside,
  },
  data: () => ({
    drawerOpened: false,
  }),
  mounted() {
    // console.log(this.$store.state.user.user.channel.videos)
  },
}
</script>
<style lang="scss">
.grid-container {
  display: grid;
  height: 100vh;
  grid-template-rows: 5rem 1fr 3rem;
  @media screen and (max-width: 801px) {
    grid-template-rows: 9rem 1fr 3rem;
  }
  .main {
    grid-row: 2 / 3;
  }
}
</style>
