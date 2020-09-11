<template>
  <header>
    <div class="hamburger-and-logo">
      <Icon @click="toggleDrawer" type="ios-menu" :size="30" />
      <span
        @click="
          () => {
            $router.push('/')
          }
        "
        class="logo"
        >dislive.me</span
      >
    </div>
    <div class="search">
      <Input
        v-model="query"
        clearable
        search
        enter-button
        placeholder="Найти видео..."
      />
    </div>
    <div class="actions">
      <Button v-if="!loggedIn" @click="login" type="error" long>Войти</Button>
      <!-- <span style="font-weight: bold;">{{
        user.email.substring(0, user.email.lastIndexOf('@'))
      }}</span> -->
      <Dropdown trigger="click" v-else-if="user != null">
        <div class="dropdown">
          <img
            style="width: 2rem; height: 2rem; border-radius: 50%"
            :src="user.avatar"
          />

          <!-- {{ user.email.substring(0, user.email.lastIndexOf('@')) }} -->
          {{ user.username }}
          <Icon type="ios-arrow-down"></Icon>
          <!-- <Avatar :src="user.picture"></Avatar> -->
        </div>

        <DropdownMenu slot="list">
          <DropdownItem v-if="user && user.channel"
            ><Button to="/channel/videos" type="text"
              >Ваши видео</Button
            ></DropdownItem
          >
          <DropdownItem>炸酱面</DropdownItem>
          <DropdownItem disabled>豆汁儿</DropdownItem>
          <DropdownItem>冰糖葫芦</DropdownItem>
          <DropdownItem divided
            ><Button @click="logout" long type="error"
              >Выйти</Button
            ></DropdownItem
          >
        </DropdownMenu>
      </Dropdown>
    </div>
  </header>
</template>

<script>
import Axios from 'axios'
export default {
  data: () => ({
    query: '',
  }),
  computed: {
    user() {
      return this.$store.getters['user/GET_USER']
    },
    loggedIn() {
      return this.$store.getters['user/GET_AUTH_STATE']
    },
  },
  methods: {
    toggleDrawer() {
      this.$emit('toggleDrawer')
    },
    login() {
      this.$router.push('/auth/login')
    },
    async logout() {
      try {
        const { data } = await Axios.post(
          `${this.$nuxt.context.env.baseUrl}/api/auth/logout`
        )
        this.$store.commit('user/LOGOUT')
        this.$router.push('/')
      } catch (e) {}
    },
  },
  mounted() {},
}
</script>

<style lang="scss" scoped>
header {
  grid-row: 1 / 2;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  border-bottom: 0.2rem solid #f0f0f8;
  .hamburger-and-logo {
    display: flex;
    column-gap: 1rem;
    align-items: center;
    i {
      cursor: pointer;
      &:hover {
        color: red;
      }
    }
    .logo {
      text-transform: uppercase;
      font-size: 2rem;
      cursor: pointer;
      &::first-letter {
        color: red;
      }
    }
  }
  .search {
    flex-basis: 30rem;
  }
  .actions {
    flex-basis: 10rem;
  }
}
.dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  column-gap: 3px;
  border: 4px solid #f1f0f0;
  border-radius: 10px;
  padding: 5px;
  transition: border-color 300ms ease;
  &:hover {
    border-color: lighten(#2b85e4, 10%);
  }
}
</style>
