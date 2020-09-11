<template>
  <div class="wrapper">
    <div class="first-section">
      <div class="video-wrapper">
        <video ref="videoRef" />
      </div>
      <div class="video-name">
        <h2>{{ video.name }}</h2>
      </div>
      <div class="video-channel">
        <div class="creator">
          <img :src="video.channel.user.avatar" /><span>{{
            video.channel.name
          }}</span>
          <div style="margin-left: 0.5rem">
            <template v-if="$store.state.user.loggedIn">
              <Button
                @click.stop="subscribe()"
                v-if="!isUserChannelOwner && !isUserSubscribed"
                danger
                type="error"
                :loading="subscribeUnsubscribeLoading"
                >{{ video.channel.subscribers.length }} Подписаться</Button
              >
              <Button v-else-if="isUserChannelOwner" danger type="error"
                >{{ video.channel.subscribers.length }} подписчиков</Button
              >
              <Button
                v-if="isUserSubscribed"
                danger
                type="error"
                :loading="subscribeUnsubscribeLoading"
                @click="unsubscribe()"
                >{{ video.channel.subscribers.length }} Отписаться</Button
              >
            </template>
            <template v-else>
              <Button danger type="error"
                >{{ video.channel.subscribers.length }} подписчиков</Button
              >
            </template>
          </div>
        </div>

        <div class="likesdislikes">
          <div class="likesdislikes-subwrapper">
            <div class="like">
              <span>{{ this.likes.length }}</span>
              <Icon
                @click="like"
                :size="30"
                :style="{ color: liked ? `#2c86e6` : null }"
                type="md-thumbs-up"
              />
            </div>
            <div class="dislike">
              <span>{{ this.dislikes.length }}</span>
              <Icon
                @click="dislike"
                :size="30"
                :style="{ color: disliked ? `red` : null }"
                type="md-thumbs-down"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="comments" v-if="postsLoaded">
        <div class="comments-count-and-filter">
          <h2>{{ posts.length }} комментариев</h2>
        </div>
        <NewPostForm :video="video" />
        <div class="posts">
          <SinglePost v-for="post in posts" :key="post.id" :post="post" />
        </div>
      </div>
      <div
        v-infinite-scroll="loadMorePosts"
        infinite-scroll-distance="10"
        :infinite-scroll-disabled="!postsLoaded"
      ></div>
    </div>
  </div>
</template>

<script>
import Hls from 'hls.js'
import Axios from 'axios'
import NewPostForm from '../../components/video/newPostForm'
import SinglePost from '../../components/video/singlePost'

export default {
  components: {
    NewPostForm,
    SinglePost,
  },
  data: () => ({
    videoLoaded: false,
    subscribeUnsubscribeLoading: false,
    postsLoaded: false,
    posts: [],
  }),
  head: function () {
    return { title: this.video.name }
  },
  async asyncData(ctx) {
    const { id } = ctx.params
    const video = await Axios.get(`${ctx.env.baseUrl}/api/video/${id}`)
    const data = await fetch(
      `https://stream.mux.com/${video.data.video.src}.m3u8`
    )
    return {
      src: data.url,
      video: video.data.video,
      likes: video.data.likes,
      dislikes: video.data.dislikes,
    }
  },
  mounted() {
    const video = this.$refs.videoRef
    video.controls = true
    let hls
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // This will run in safari, where HLS is supported natively
      video.src = this.src
    } else if (Hls.isSupported()) {
      // This will run in all other modern browsers
      hls = new Hls()
      hls.loadSource(this.src)
      hls.attachMedia(video)
      // video.onloadeddata = () => {
      //   video.controls = true
      //   this.videoLoaded = true
      // }
    } else {
      console.error(
        'This is an old browser that does not support MSE https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API'
      )
    }
  },
  methods: {
    async subscribe() {
      this.subscribeUnsubscribeLoading = true
      const {
        data,
      } = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/channels/subscribe`,
        { channelId: this.video.channel.id, videoId: this.video.id }
      )
      await this.$store.commit('user/SET_USER', data.user)
      this.video = data.video
      this.subscribeUnsubscribeLoading = false
    },
    async unsubscribe() {
      try {
        this.subscribeUnsubscribeLoading = true
        const unsubscribeData = await Axios.post(
          `${this.$nuxt.context.env.baseUrl}/api/channels/unsubscribe`,
          { channelId: this.video.channel.id, videoId: this.video.id }
        )
        await this.$store.commit('user/SET_USER', unsubscribeData.data.user)
        this.video = unsubscribeData.data.video
        this.subscribeUnsubscribeLoading = false
      } catch {
        this.$Message.error('Не удалось отписаться. Попробуйте еще раз')
      }
    },
    async like() {
      const res = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/video/${this.video.id}/like`
      )
      this.likes = res.data.likes
      this.dislikes = res.data.dislikes
    },
    async dislike() {
      const res = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/video/${this.video.id}/dislike`
      )
      this.likes = res.data.likes
      this.dislikes = res.data.dislikes
    },
    async loadMorePosts() {
      const posts = await Axios.post(
        `${this.$nuxt.context.env.baseUrl}/api/video/posts`,
        {
          videoId: this.video.id,
        }
      )
      this.posts = posts.data
      this.postsLoaded = true
    },
  },
  computed: {
    isUserSubscribed() {
      let isSubscribed = false
      this.video.channel.subscribers.forEach((subscriber) => {
        if (subscriber.email == this.$store.state.user.user.email) {
          isSubscribed = true
        }
      })
      return isSubscribed
    },
    isUserChannelOwner() {
      if (this.video.channel.user.email == this.$store.state.user.user.email) {
        return true
      }
      return false
    },
    liked() {
      const liked = this.likes.filter(
        (like) => like.userId == this.$store.state.user.user.id
      )
      if (liked.length) {
        return true
      }
      return false
    },
    disliked() {
      const disliked = this.dislikes.filter(
        (like) => like.userId == this.$store.state.user.user.id
      )
      if (disliked.length) {
        return true
      }
      return false
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 3rem;
  display: grid;
  grid-template-columns: 2fr 1fr;
  max-width: 100vw;
  .first-section {
    grid-column: 1/2;
    display: flex;
    flex-direction: column;
    .video-wrapper {
      width: 40rem;
      // flex-grow: 1;
      // max-width: 30rem;
      @media screen and (max-width: 800px) {
        width: 18rem;
      }
      video {
        // width: 10rem;
        max-width: 100%;
      }
    }
    .video-name {
      color: #17233d;
      margin-top: 0.6rem;
    }
    .video-channel {
      // display: flex;
      margin-top: 0.3rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;
      width: 18rem;
      border: 2px solid #f1f1f1;
      padding: 5px;
      .creator {
        display: flex;
        align-items: center;
        img {
          border-radius: 10px;
          max-width: 3rem;
        }
        span {
          margin-left: 4px;
        }
      }
      .likesdislikes {
        width: 100%;
        display: flex;
        justify-content: center;
        .likesdislikes-subwrapper {
          display: flex;
          .like {
            span {
              font-size: 15px;
            }
            i {
              &:hover {
                color: #2c86e6;
              }
            }
          }
          .dislike {
            margin-left: 1rem;
            span {
              font-size: 15px;
            }
            i {
              &:hover {
                color: red;
              }
            }
          }
        }
      }
    }
    .comments {
      font-family: 'Arial';
      margin-top: 2rem;
      .comments-count-and-filter {
        display: flex;
      }
      .posts {
        margin-top: 1rem;
      }
    }
  }
}
</style>
