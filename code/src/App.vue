<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import {mapMutations, mapState} from 'vuex'
let OSS = require('ali-oss')
export default {
  name: 'App',
  data() {
    return {count: 0}
  },
  created() {
    this.timer(60*1000)
    this.getClient()
  },
  methods: {
    ...mapMutations(['setClient']),
    getClient() {
      const that = this
      this.axios({
        method: 'get',
        url: '/assumeRole'
      })
      .then(res => {
          that.setClient(new OSS({
              region: 'oss-cn-beijing',
              accessKeyId: res.data.credentials.AccessKeyId,
              accessKeySecret: res.data.credentials.AccessKeySecret,
              stsToken: res.data.credentials.SecurityToken,
              bucket: 'bbs-frontend-img'
            })
          )
          console.log(that.client)
      })
      .catch(err => {
          console.error("Error when get STSToken",err)
          alert('图床Token获取失败，可以联系本人重启一下后端orz')
      })
    },
    timer(interval) {
      return setInterval(() => {
          // console.log(this.count)
          this.count > 3600 ? this.count = 0 : this.count += 0
          this.count += interval / 1000
          if (this.count === 0 || this.client === null) {
            this.getClient()  
          }
      }, interval)
    }
  },
  destroyed() {
    clearTimeout(this.timer)
  },
  computed: {
    ...mapState(['client'])
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  position: relative;
}

</style>
