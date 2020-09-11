<template>
  <div>
    <h2 style="text-align: center; margin-top: 3rem">Вход</h2>

    <div class="form-wrapper">
      <Form ref="loginForm" :model="loginForm" :rules="ruleInline">
        <FormItem prop="email">
          <Input type="text" v-model="loginForm.email" placeholder="Email">
            <Icon type="ios-person-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <FormItem prop="password">
          <Input
            type="password"
            v-model="loginForm.password"
            placeholder="Пароль"
          >
            <Icon type="ios-lock-outline" slot="prepend"></Icon>
          </Input>
        </FormItem>
        <div class="form-buttons">
          <Button type="primary" @click="handleSubmit('loginForm')"
            >Войти</Button
          >
          <Button
            type="success"
            @click="
              () => {
                $router.push('/auth/register')
              }
            "
            >Еще нет аккаунта?</Button
          >
        </div>
      </Form>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
export default {
  //   middleware: 'guest',
  data() {
    return {
      loginForm: {
        email: '',
        password: '',
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
      },
    }
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          Axios.post(`${this.$nuxt.context.env.baseUrl}/api/auth/login`, {
            email: this.loginForm.email,
            password: this.loginForm.password,
          })
            .then((data) => {
              this.$store.commit('user/SET_USER', data.data)
              this.$router.push('/')
            })
            .catch((e) => this.$Message.error(e.response.data))
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
    justify-content: space-between;
  }
}
</style>
