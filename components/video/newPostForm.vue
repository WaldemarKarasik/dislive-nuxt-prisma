<template>
  <form @submit.prevent="post">
    <input
      ref="input"
      class="input"
      style="width: 100%; padding: 10px"
      placeholder="Добавить новый комментарий"
      required
      type="text"
      name="post-content"
      v-model="newPost"
    />
    <div class="buttons" v-show="formFocused">
      <Button type="text" @click="cancel">Отмена</Button>
      <Button type="primary" htmlType="submit"> Оставить комментарий </Button>
    </div>
  </form>
</template>

<script>
import Axios from 'axios'
export default {
  props: ['video'],
  data: () => ({
    newPost: '',
    formFocused: false,
  }),
  methods: {
    async post(e) {
      if (this.$store.state.user.user == null) {
        return this.$router.push('/auth/login')
      }
      const newPost = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/post/new`,
        {
          content: this.newPost,
          videoId: this.video.id,
        }
      )
      this.newPost = ''
    },
    cancel() {
      this.formFocused = false
      this.newPost = ''
    },
  },
  mounted() {
    this.$refs.input.onfocus = () => {
      this.formFocused = true
    }
  },
}
</script>

<style lang="scss" scoped>
.input {
  font-size: 14px;
  border-radius: 5px;
}
.buttons {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  button {
    text-transform: uppercase;
    font-family: 'sans-serif';
  }
  button:nth-of-type(2) {
    margin-left: 1rem;
  }
}
</style>
