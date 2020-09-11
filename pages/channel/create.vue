<template>
  <div>
    <h2 style="text-align: center; margin-top: 3rem">Создать канал</h2>
    <div class="wrapper">
      <Form
        ref="createChannelForm"
        :model="createChannelForm"
        :rules="createChannelFormRules"
      >
        <FormItem prop="name" label="Название канала">
          <Input
            placeholder="Введите название канала"
            v-model="createChannelForm.name"
          />
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            @click="handleSubmit('createChannelForm')"
            :ghost="!createChannelForm.name.length"
            >Создать</Button
          >
        </FormItem>
      </Form>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  data: () => ({
    createChannelForm: {
      name: '',
    },
    createChannelFormRules: {
      name: {
        required: true,
        message: 'Введите название канала',
      },
    },
  }),
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(async (valid) => {
        if (valid) {
          try {
            const { data } = await Axios.post(
              `${this.$nuxt.context.env.baseUrl}/api/channels/create`,
              {
                name: this.createChannelForm.name,
              }
            )
            this.$store.commit('user/SET_USER', data)
            this.$router.push('/')
          } catch (e) {
            this.$Message.error(e.response.data)
          }
        } else {
          console.log(this.createChannelForm)
          this.$Message.error('Форма заполнена неверно!')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  justify-content: center;
  form {
    width: 20rem;
    margin-top: 3rem;
  }
}
</style>
