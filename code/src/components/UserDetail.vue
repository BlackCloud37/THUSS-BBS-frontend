<template>
    <div class="user-detail-container container">
        <navigator-bar class="nav"/>
        <div v-show="finished">
        <h1 class="user-detail-content title">{{ userInfo.nickname }}<span style="color:#202020">的帖子</span></h1>
        <post-list @finish="finished=true" class="post-list" :user-id="Number(userId)"></post-list>
        </div>
        <div v-show="!finished"><loading/></div>
    </div>
</template>

<script>
import PostList from './PostList.vue'
import NavigatorBar from "./NavigatorBar.vue"
import Loading from './Loading.vue'
import { mapState } from 'vuex'
export default {
    name: 'UserDetail',
    components: {
        PostList,
        NavigatorBar,
        Loading
    },
    data () {
        return {
            userId: -1,
            userInfo: {},
            userPosts: {},
            finished: false
        }
    },
    created () {
        this.userId = this.$route.params.user_id
        const that = this
        this.axios({
            method: 'get',
            url: '/api/v1/user/'+this.userId,
            headers: {
                'Authorization': that.token
            }
        })
        .then(res => {
            console.log(res)
            that.userInfo = res.data
        })
        .catch(err => {
            console.error('userinfo', err)
        })
    },
    computed: {
        ...mapState(['token'])
    }
}
</script>

<style scoped>
.user-detail-container {
    display: flex;
    flex-direction: column;
}
.user-detail-content {
    margin-left: 20px;
}
.nav {
    margin-left: 20px;
    margin-right: 20px;
}
</style>