<template>
  <div class="root-wrapper">
    <div class="user-info">
      <template v-if="post.user">
        <Avatar :src="post.user.avatar" />
        <span style="font-size: 13px">{{ post.user.username }}</span>
      </template>
      <template v-else>
        <Avatar :src="post.channel.user.avatar" />
        <span style="font-size: 13px">{{ post.channel.name }}</span>
      </template>
    </div>
    <p style="font-size: 16px">{{ post.content }}</p>
    <Button id="reply" @click="comment" type="text" size="small"
      >Ответить</Button
    >
    <Button v-if="!showForm" type="text" style="display: inline"
      >Показать ответы ({{ commentsCount }})</Button
    >
    <form v-if="showForm" @submit.prevent="comment" style="margin-left: 20px">
      <input id="input" ref="input" type="text" />
      <Button htmlType="submit" type="primary">Отправить</Button>
    </form>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
import Axios from 'axios'
export default {
  props: ['post'],
  data: () => ({
    showForm: false,
    commentsCount: 0,
  }),
  methods: {
    comment() {
      this.showForm = !this.showForm
    },
    hideForm() {
      this.showForm = false
    },
  },
  async mounted() {
    // this.$refs.input.onblur = () => {
    //   this.showForm = false
    // }
    const commentsCount = await Axios.post(
      `${this.$nuxt.context.env.baseUrl}/api/post/comments-count`,
      {
        postId: this.post.id,
      }
    )
    this.commentsCount = commentsCount.data
  },
  directives: {
    ClickOutside,
  },
}
</script>

<style lang="scss" scoped>
.root-wrapper {
  margin-bottom: 12px;
  .user-info {
    margin-bottom: 4px;
  }
}
</style>
