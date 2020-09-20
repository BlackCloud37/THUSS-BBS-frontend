<template>
  <div class="container">
    <label class="page-title text">，，，</label>
    <div class="line">
      <label class="text" for="username">Username</label>
      <input type="text" id="username" name="username" v-model="loginForm.username"/>
    </div>
    <div class="line">
      <label class="text" for="password">Password</label>
      <input type="password" id="password" name="password" v-model="loginForm.password"/>
    </div>
    <div class="line button">
      <button class="login-button" @click="login();$emit('login-finished')">Login</button>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
export default {
  name: 'LoginBox',
  methods: {
    ...mapMutations(['setToken', 'setNickname', 'setLoginStatus', 'setUsername', 'setUserId']),
    login () {
      if (this.loginForm.username === '') {
        alert("用户名不能为空")
        return
      }
      if (this.loginForm.password === '') {
        alert("密码不能为空")
        return
      }

      const that = this
      // try login
      this.axios({
        method: 'patch',
        url: '/api/v1/login',
        data: that.loginForm
      })
      .then(res => {
        console.log(res.data)
        if(!res.status === 200) {
          alert("Login Failed")
          return
        }
        that.setToken(res.data.jwt)
        that.setNickname(res.data.nickname)
        that.setLoginStatus(true)
        that.setUsername(res.data.username)
        that.setUserId(res.data.userId)
        //navigate to 
        that.$router.replace('/index')
      })
      .catch(err => {
        alert('登录失败');
        console.error(err)
      })
    }
  },
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 100px;
}

.line {
  margin-top: 10px;
  width: 400px;
  display: flex;
  justify-content: space-between;
}

.login-button {
  position: relative;
  left:50%;
  font-size: 30px;
  transform: translateX(-50%);
  flex-grow: 1;
  border-radius: 20px;
  margin-top:20px
}
.page-title {
  margin-bottom: 20px;
  font-size: 80px;
}
input {
  border: transparent;
  border-bottom: #202020 solid 3px;
  outline:transparent;
  width: 200px;
  font-size: 20px;
}
label {
  text-align: center;
  font-size: 30px;
}
</style>
