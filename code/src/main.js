import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'

import './style.css'

import LoginBox from './components/LoginBox.vue'
import IndexPage from './components/IndexPage.vue'
import PostDetail from './components/PostDetail.vue'
import UserDetail from './components/UserDetail.vue'
import HistoryPage from './components/HistoryPage.vue'
import ElementUI from 'element-ui';
import Router from 'vue-router'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Vue.use(Vuex)
Vue.use(Router)

Vue.prototype.axios = axios
Vue.config.productionTip = false


Storage.prototype.setExpire = (key, value, expire) => {
	let obj = {
    data: value,
    time: Date.now(),
    expire: expire
	};
	localStorage.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getExpire = key => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
}

const store = new Vuex.Store({
  state: {
    token: localStorage.getExpire('token'),
    nickname: localStorage.getExpire('nickname'),
    loginStatus: localStorage.getExpire('loginStatus') ? localStorage.getExpire('loginStatus') : false,
    username: localStorage.getExpire('username'),
    userId: localStorage.getExpire('userId'),
    client: null,
    historyPosts: localStorage.getExpire('historyPosts') ? localStorage.getExpire('historyPosts') : [],
    starredPosts: localStorage.getExpire('starredPosts') ? localStorage.getExpire('starredPosts') : []
  },
  mutations: {
    setToken (state, token) {
      console.log('setToken: ', token)
      state.token = token
      localStorage.setExpire('token', token, 86400000)
    },
    setNickname (state, nickname) {
      console.log('setNickname: ', nickname)
      state.nickname = nickname
      localStorage.setExpire('nickname', nickname, 86400000)
    },
    setLoginStatus (state, status) {
      state.loginStatus = status
      localStorage.setExpire('loginStatus', status, 86400000)
    },
    setUsername (state, username) {
      state.username = username
      localStorage.setExpire('username', username, 86400000)
    },
    setUserId (state, userId) {
      state.userId = userId
      localStorage.setExpire('userId', userId, 86400000)
    },
    setClient(state, client) {
      console.log(client)
      state.client = client
    },
    setHistoryPosts(state, his) {
      state.historyPosts = his
      localStorage.setExpire('historyPosts', his)

    },
    setStarredPosts(state, star) {
      state.starredPosts = star
      localStorage.setExpire('starredPosts', star)
    }
  }
})



const router = new Router({
  routes: [
    { path: '/', component: IndexPage, name: 'root'},
    { path: '/login', component: LoginBox, name: 'login'},
    { path: '/index', component: IndexPage, name: 'index'},
    { path: '/post/:post_id', component: PostDetail, name: 'post'},
    { path: '/user/:user_id', component: UserDetail, name: 'user'},
    { path: '/postlist/:type', component: HistoryPage, name: 'history'}
  ]
})

router.beforeEach((to, from, next) => {
  if (to.name !== 'login' && localStorage.getExpire('loginStatus') !== true) {
    next({ name: 'login' })
  }
  else {
    next()
  }
})

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
