<template>
    <div class="user-detail-container container">
        <navigator-bar class="nav"/>
        <div class="header">
            <h1 class="user-detail-content title">{{ nickname }}<span style="color:#202020">的{{type==="history"?"浏览历史":"收藏"}}</span></h1>
            <button class="button clear-button" @click="setHistoryPosts([])"  v-if="type==='history'">清空历史</button>
        </div>
        <div v-show="finished">
            <div v-if="postList.length===0" class="title text" style="margin-left:20px;color:#404040;">
                记录为空
            </div>
            <post-list @finish="finished=true" class="post-list"  :prepared="true" :pre-post-list="postList"></post-list>
        </div>
        <div v-show="!finished">
            <loading/>
        </div>
    </div>
</template>

<script>
import PostList from './PostList.vue'
import NavigatorBar from "./NavigatorBar.vue"
import Loading from './Loading.vue'
import { mapState, mapMutations } from 'vuex'
export default {
    name: 'HistoryPage',
    components: {
        PostList,
        NavigatorBar,
        Loading
    },
    data() {
        return {
            finished: false
        }
    },
    methods: {
        ...mapMutations(['setHistoryPosts'])
    },
    computed: {
        ...mapState(['token','userId','nickname','historyPosts','starredPosts']),
        postList() {
            if (this.type === "history") {
                let res = JSON.parse(JSON.stringify(this.historyPosts))
                return res.reverse()
            }
            else {
                let res = JSON.parse(JSON.stringify(this.starredPosts))
                return res.reverse()
            }
        },
        type () {
            return this.$route.params.type
        },
        
    },
    watch: {
        type() {
            this.finished=false
            location.reload()
        },
        historyPosts() {
            location.reload()
        },
        starredPosts() {
            location.reload()
        }
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
.header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
.clear-button {
    flex-basis: 8em;
    flex-grow: 0;
    flex-shrink: 0;
    height: 3em;
    margin-right: 20px;
}
</style>