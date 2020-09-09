<template>
  <Drawer
    title="Меню"
    placement="left"
    :value="drawerOpened"
    @on-close="closeDrawer"
  >
    <Button
      @click="
        () => {
          $router.push('/channel/create')
        }
      "
      type="primary"
      v-if="userIsAuthor && !('channel' in user)"
      long
      >Создать канал</Button
    >
    <Button
      to="/upload"
      type="primary"
      long
      v-else-if="userIsAuthor && 'channel' in user"
      >Загрузить видео на канал</Button
    >
  </Drawer>
</template>

<script>
export default {
  props: ['drawerOpened'],
  computed: {
    user() {
      return this.$store.getters['user/GET_USER']
    },
    userIsAuthor() {
      if (
        !this.user ||
        !(
          this.user.email == 'komsomolradio@gmail.com' ||
          this.user.email == 'dislive@gmail.com' ||
          this.user.email == 'waldemarkarasik@gmail.com'
        )
      ) {
        return false
      }
      return true
    },
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer')
    },
  },
  watch: {
    $route(to, from) {
      this.closeDrawer()
    },
  },
}
</script>

<style></style>
