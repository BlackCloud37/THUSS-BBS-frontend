<template>
    <div class="index-page-container container">
        <div class="loading" v-show="!finished">
            <loading/>
        </div>
        <button class="floated" @click="goBottom">发帖</button>
        <div class="index-page" v-show="finished">
            <navigator-bar class="nav"/>
            <post-list class="post-list"  :page-id="currentPage" v-on:finish="finished = true"></post-list>
            <div class="post-editor">
                <div class='search-bar'>
                    <label for="title-input">标题</label>
                    <input type="text" name="title" ref="titleinput" id="title-input" v-model="postData.title" />
                </div>
                <content-editor :catch-data="catchData" class="content-editor" ref="editor"/>
                <button class="post-button" @click="post" ref="eb">发帖</button>
            </div>
        </div>
    </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import PostList from './PostList.vue'
import ContentEditor from './ContentEditor.vue'
import NavigatorBar from './NavigatorBar.vue'
import Loading from './Loading.vue'
export default {
    name: 'IndexPage',
    data () {
        return {
            postData: {title:'', content:''},
            currentPage: 1,
            finished: false,
        }
    },
    components: {
        PostList,
        ContentEditor,
        NavigatorBar,
        Loading
    },
    created() {
        this.currentPage = Number(this.$route.params.page_id)
    },
    methods: {
        ...mapMutations(['setToken', 'setNickname', 'setLoginStatus']),
        goBottom(){
            this.$refs.eb.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        },
        catchData (data) {
            this.postData.content = data
            console.log(this.postData)
            return
        },
        post() {
            const that = this
            this.axios({
                method: 'post',
                url: '/api/v1/post',
                headers: {
                    'Authorization': that.token
                },
                data: {
                    title: that.postData.title,
                    content: that.postData.content
                }
            })
            .then(res => {
                console.log(res)
                this.$message({
                    type: "success",
                    message: "发帖成功"
                })
                location.reload()
            })
            .catch(err => {
                console.log('post',err)
            })
        }
    },
    computed: {
        ...mapState(['userId','loginStatus', 'nickname', 'token']),
        
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
label {
    margin-left: 1em;
    margin-right: 1em;
}
input {
    flex-grow: 1;
    border: transparent;
    border-radius: 5px;
    margin-right: 20px;
    border-bottom: #808080 solid 1px;
    border-radius: 5px 5px 0 0;
    outline: medium;
}
.index-page-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.page-title {
    font-size: 70px;
    text-align: center;
}
.index-page {
    display: flex;
    flex-direction: column;
    width: 100%;
}
.search-bar {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: space-between;
}
.navigator {
    background: #FAFAFA;
    margin-left: 20px;
    margin-right: 20px;
}
.post-editor {
    margin-left: 20px;
    margin-right: 20px;
    background: #FAFAFA;
    border-radius: 5px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
}
.content-editor {
    margin-left: 20px;
    margin-right: 20px;
    border-radius: 5px;
}
.post-button {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}
.nav {
    margin-left: 20px;
    margin-right: 20px;
}

</style>
