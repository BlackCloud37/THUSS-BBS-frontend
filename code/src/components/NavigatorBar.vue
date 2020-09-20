<template>
    <div class="navigator-bar-container">
        <label class="page-title text">，，，</label>
        <div class="bar">
            <p class="text">欢迎, <router-link :to="'/user/' + userId" class="userinfo">{{ nickname }}</router-link></p>
            <div class="button-box">
                <button class="mid" @click="$router.push('/index');">主页</button>
                <button class="mid" @click="$router.replace('/postlist/history');">历史</button>
                <button class="mid" @click="$router.replace('/postlist/starred');">收藏</button>
                <button @click="logout">登出</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
    name: "NavigatorBar",
    methods: {
        ...mapMutations(['setToken', 'setNickname', 'setLoginStatus']),
        logout() {
            if (this.loginStatus) {                
                this.axios({
                    method: 'patch',
                    url: '/api/v1/logout',
                    headers: {
                        'Authorization': this.token
                    }
                })
                .then(res => {
                    console.log(res)
                })
                .catch(err => {
                    console.error(err)
                })
                this.$router.replace('/login')
                this.setToken(null)
                this.setNickname(null)
                this.setLoginStatus(false)
            }
        },

    },
    computed: {
        ...mapState(['token','nickname','userId','loginStatus'])
    }

}
</script>

<style scoped>
.navigator-bar-container {
    display: flex;
    flex-direction: column;
    padding-bottom: 5px;
    border-bottom: #f0f0f0 solid 5px;
}
label {
    padding-bottom: 10px;
}
.bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: #F0F0F0;
    height: 2em;
    border-radius: 5px;
}

a {
    font-size: 16px;
}

p {
    padding-left: 1em;
}
.button-box {
    display: flex;
    flex-direction: row;
    
}
.mid {
    flex-grow: 0;
    flex-shrink: 0;
    border-radius: 0;
}
button:hover {
    background: purple;
    color: white;
}
button {
    height: 100%;
    border-radius: 0px 5px 5px 0px;
    background: #F0F0F0;
    border-left: #404040 dotted 1px;
    border-top: transparent;
    border-right: transparent;
    border-bottom: transparent;
}
</style>