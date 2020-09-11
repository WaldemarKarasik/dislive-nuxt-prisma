<template>
  <div class="wrapper">
    <div class="advice">
      <h2 v-if="uploadProgress == 0">
        После того, как вы выберете файл, начнется загрузка видео на сервер
      </h2>
      <h2 v-else>Видео загружается...</h2>
    </div>
    <div class="input-wrapper">
      <Input v-model="videoData.name" placeholder="Название видео" />
      <input
        :disabled="!videoData.name.length"
        type="file"
        class="file-input"
        id="file-input"
        @change="startUpload()"
        ref="inputRef"
      />
    </div>
    <div class="circle">
      <i-circle v-show="fileIsChosen" :percent="uploadProgress">
        <span class="demo-Circle-inner" style="font-size: 24px">{{
          Math.round(uploadProgress) + `%`
        }}</span>
      </i-circle>
    </div>
  </div>
</template>

<script>
import * as UpChunk from '@mux/upchunk'
import Axios from 'axios'
export default {
  //   middleware: 'author',
  data: () => ({
    videoData: {
      name: '',
    },
    isPreparing: false,
    uploadId: null,
    uploadProgress: 0,
    fileIsChosen: false,
  }),
  methods: {
    startUpload() {
      if (this.videoData.name.length == 0) {
        return this.$Message.error('Название не может быть пустым')
      }
      this.fileIsChosen = true
      const upload = UpChunk.createUpload({
        endpoint: this.createUpload,
        file: this.$refs.inputRef.files[0],
      })
      upload.on('error', (err) => {
        console.log(err.detail)
      })
      upload.on('progress', (progress) => {
        this.uploadProgress = progress.detail
      })
      upload.on('success', () => {
        console.log('uploaded')
        this.isPreparing = true
      })
    },
    createUpload() {
      try {
        return fetch(`${this.$nuxt.context.env.baseUrl}/api/upload`, {
          method: 'PUT',
        })
          .then((data) => data.json())
          .then(({ id, url }) => {
            this.uploadId = id
            return url
          })
      } catch (e) {
        console.error('Error in createUpload', e)
      }
    },
  },
  watch: {
    async isPreparing(value) {
      if (value && this.uploadId) {
        let uploadReady
        const { data } = await Axios.get(
          `${this.$nuxt.context.env.baseUrl}/api/upload/get-upload/?id=${this.uploadId}`
        )
        if (data.upload.status == 'waiting') {
          const { data: uploadWaitingData } = await Axios.get(
            `${this.$nuxt.context.env.baseUrl}/api/upload/get-upload/?id=${this.uploadId}`
          )
          const { data: assetData } = await Axios.get(
            `${this.$nuxt.context.env.baseUrl}/api/upload/get-asset/?id=${uploadWaitingData.upload.asset_id}`
          )
          const createVideoData = await fetch(
            `${this.$nuxt.context.env.baseUrl}/api/video/create`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: this.videoData.name,
                src: assetData.asset.playback_id,
              }),
            }
          ).then((data) => data.json())
          this.$store.commit('user/SET_USER', createVideoData.user)
          this.$store.commit('videos/ADD_VIDEO', createVideoData.video)
          // if (assetData.asset && assetData.asset.status == 'ready') {
          return this.$router.push({
            path: `/video/${createVideoData.video._id}`,
            // params: { _id: assetData.asset.playback_id },
          })
        }
        if (data.upload.status == 'asset_created') {
          const { data: assetData } = await Axios.get(
            `${this.$nuxt.context.env.baseUrl}/api/upload/get-asset/?id=${data.upload.asset_id}`
          )
          const createVideoData = await fetch(
            `${this.$nuxt.context.env.baseUrl}/api/video/create`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: this.videoData.name,
                src: assetData.asset.playback_id,
              }),
            }
          ).then((data) => data.json())
          this.$store.commit('user/SET_USER', createVideoData.user)
          this.$store.commit('videos/ADD_VIDEO', createVideoData.video)
          // if (assetData.asset && assetData.asset.status == 'ready') {
          this.$router.push({
            path: `/video/${createVideoData.video.id}`,
            // params: { _id: assetData.asset.playback_id },
          })
        }
        // }
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  .advice {
    margin-top: 3rem;
    margin-bottom: 2rem;
  }
  .circle {
    margin-top: 1rem;
  }
  .input-wrapper {
    .file-input {
      margin-top: 1rem;
    }
  }
}
</style>
