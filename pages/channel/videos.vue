<template>
  <div class="root-wrapper">
    <h2 v-if="!videos.length">У вас еще нет видео</h2>
    <div class="table-wrapper" v-else>
      <Table border :columns="columns" :data="videos">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{ row, index }" slot="action">
          <Button
            type="primary"
            size="small"
            style="margin-right: 5px"
            @click="show(index)"
            >View</Button
          >
          <Button type="error" size="small" @click="remove(row.id)"
            >Удалить</Button
          >
        </template>
      </Table>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data: () => ({
    columns: [
      {
        title: 'Название',
        slot: 'name',
      },
      {
        title: 'Действия',
        slot: 'action',
        width: 150,
        align: 'center',
      },
    ],
  }),
  //   async asyncData(ctx) {
  //   const videos = await Axios.get(`${ctx.env.baseUrl}/api/author/videos`, {
  //     withCredentials: true,
  //   })
  //   console.log(videos.data)
  //   return {}
  //   },
  async asyncData(ctx) {
    const { id } = ctx.store.state.user.user.channel
    try {
      const videos = await Axios.post(`${ctx.env.baseUrl}/api/author/videos`, {
        cd: 2,
      })
      return { videos: videos.data }
    } catch (e) {
      ctx.error({ statusCode: 503, message: 'Что-то пошло не так' })
    }
  },
  methods: {
    async remove(id) {
      const deletedVideo = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/video/${id}/delete`
      )
      this.videos = this.videos.filter(
        (video) => video.id !== deletedVideo.data.id
      )
    },
  },
}
</script>

<style lang="scss">
.root-wrapper {
  display: flex;
  margin-top: 5rem;
  justify-content: center;
}
.table-wrapper {
  flex-basis: 40rem;
}
</style>
