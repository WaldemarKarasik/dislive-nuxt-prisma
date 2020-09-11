<template>
  <div>
    <div class="container">
      <!-- <input type="file" @change="upload" /> -->
      <div
        class="video-card-wrapper"
        v-for="video in videos"
        @click="() => $router.push({ path: `/video/${video.id}` })"
        :key="video._id"
      >
        <Card>
          <!-- <div class="video-container"> -->
          <div class="image-container">
            <img
              :src="`https://image.mux.com/${video.src}/thumbnail.png?width=300&height=200`"
              alt="thumbnail"
            />
          </div>
          <div class="video-info">
            <p class="video-name">{{ video.name }}</p>
            <!-- <Divider type="horizontal" /> -->
            <div class="created-by-wrapper">
              <img :src="video.channel.user.avatar" alt="user-avatar" />
              <span>{{ video.channel.name }}</span>
            </div>
          </div>
          <!-- </div> -->
        </Card>
      </div>
    </div>
    <div
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="busy"
      infinite-scroll-distance="10"
    ></div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'
import Axios from 'axios'
export default {
  data: () => ({
    busy: false,
    videosQty: null,
  }),
  async asyncData({ env }) {
    const videos = await Axios.post(`${env.baseUrl}/api/video/all`)
    return { videos: videos.data }
  },
  mounted() {},
  methods: {
    async loadMore() {
      this.busy = true
      const loadMoreVideos = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/video/all`,
        { skip: this.videosQty }
      )
      if (loadMoreVideos.data.length > 0) {
        this.videos = loadMoreVideos.data
      }
      this.busy = false
    },
  },
  watch: {
    videos: {
      immediate: true,
      handler(newData, oldData) {
        this.videosQty = newData.length
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
  column-gap: 2rem;
  row-gap: 1rem;
}
.ivu-card {
  cursor: pointer;
  display: flex;
  width: 300px;
  // height: 800px;
  justify-content: center;
  // max-width: 400px;
  @media screen and (max-width: 800px) {
    width: 280px;
  }
  @media screen and (max-width: 321px) {
    width: 260px;
  }
  .ivu-card-body {
    display: flex;
    flex-direction: column;
    .image-container {
      img {
        max-height: 130px;
        @media screen and (max-width: 800px) {
          max-width: 260px;
        }
        @media screen and (max-width: 321px) {
          max-width: 250px;
        }
      }
    }
    .video-info {
      .video-name {
        font-weight: bold;
      }
      .created-by-wrapper {
        display: flex;
        align-items: center;
        margin-top: 1rem;
        img {
          border-radius: 10px;
          max-width: 2rem;
        }
        span {
          margin-left: 4px;
        }
      }
    }
  }
}
</style>
