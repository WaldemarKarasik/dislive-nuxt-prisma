<template>
  <div>
    <h2 style="text-align: center; margin-top: 3rem">Регистрация</h2>
    <div class="form-wrapper">
      <Form ref="registerForm" :model="registerForm" :rules="ruleInline">
        <FormItem prop="email">
          <Input type="text" v-model="registerForm.email" placeholder="Email">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="username">
          <Input type="text" v-model="registerForm.username" placeholder="Ник">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="registerForm.password"
            placeholder="Пароль"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <div class="form-buttons">
          <Button
            :loading="loading"
            type="primary"
            @click="handleSubmit('registerForm')"
            >Зарегистрироваться</Button
          >
          <Button
            type="success"
            @click="
              () => {
                $router.push('/auth/login')
              }
            "
            >У меня уже есть аккаунт</Button
          >
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  //middleware: 'guest',
  data() {
    return {
      registerForm: {
        email: '',
        password: '',
        username: '',
      },
      ruleInline: {
        email: [
          {
            required: true,
            message: 'Введите email',
            trigger: 'blur',
          },
        ],
        password: [
          {
            required: true,
            message: 'Введите пароль',
            trigger: 'blur',
          },
          {
            type: 'string',
            min: 6,
            message: 'Длина пароля должна быть более 5 символов',
            trigger: 'blur',
          },
        ],
        username: [
          {
            required: true,
            message: 'Введите пароль',
            trigger: 'blur',
          },
        ],
      },
      loading: null,
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.loading = true
          Axios.post(`${this.$nuxt.context.env.baseUrl}/api/auth/register`, {
            email: this.registerForm.email,
            password: this.registerForm.password,
            username: this.registerForm.username,
          })
            .then((data) => {
              this.$Notice.success({
                title: 'Подтвердите email',
                desc: data.data.message,
                duration: 5,
              })
              this.$store.commit('user/SET_USER', data.data)
              this.loading = false
              this.$router.push('/')
            })
            .catch((e) => {
              this.$Message.error(e.response.data)
              this.loading = false
            })
        } else {
          this.$Message.error('Форма заполнена неверно')
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.form-wrapper {
  display: flex;
  justify-content: center;
  form {
    width: 20rem;
    margin-top: 3rem;
  }
  .form-buttons {
    display: flex;
    flex-direction: column;
    row-gap: 1rem;
  }
}
</style>
