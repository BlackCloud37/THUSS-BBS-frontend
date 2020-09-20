<template>
    <div class="post-detail-container container">
        <navigator-bar class="nav"/>
        <h1 class="title text">{{postInfo.title}}</h1>
        <div>
            <button class="button only-main-post" :class="{'button-selected':onlyMainPost}" @click="onlyMainPost = !onlyMainPost">{{onlyMainPost?"恢复":"只看楼主"}}</button>
            <button class="button only-main-post" :class="{'button-selected':starred}" @click="starPost">{{starred?"取消收藏":"收藏"}}</button>
            <button class="button only-main-post" :class="{'button-selected':editorStatus}" v-if="postInfo.userId === userId" @click="editorStatus = !editorStatus;editorFloor = -1">{{ !editorStatus?"编辑主贴":"收起" }}</button>
        </div>
        <div  v-if="finished">
            <button class="floated" @click="goBottom">回帖</button>
            <post-floor v-if="currentPage === 1" :floor-info="postInfo" />
            <div class="post-editor" v-if="editorStatus">
                <div class='search-bar'>
                    <label for="title-input">标题</label>
                    <input type="text" name="title" id="title-input" v-model="postData.title" />
                </div>
                <content-editor :key="editorContent" :catch-data="catchEditorData" :set-content="editorContent" class="content-editor"/>
                <button class="post-button" @click="edit">编辑</button>
            </div>
            <post-floor v-for="item in replyList"
                        :floor-info="item"
                        :reply-to-info="getReplyInfo(item.replyId)" 
                        :key="item.id"
                        :editor-status="item.floor === editorFloor"
                        @open="editorFloor = Number($event);"
                        @close="editorFloor = -1"/>

            <page-selector class="page-selector" :selector-size="10" :total-page="dynamicTotalPage" @current-page="currentPage = $event" />
            <div class="post-editor" v-if="!editorStatus">
                <content-editor class="content-editor" :catch-data="catchData" />
                <button class="post-button" ref="eb" @click="reply">回复主贴</button>
            </div>
        </div>
        <div class="loading" v-show="!finished">
            <loading/>
        </div>
    </div>
    <!-- <div class="loading" v-else>
        <loading/>
    </div> -->
</template>

<script>

import {mapState, mapMutations} from 'vuex'
import PostFloor from './PostFloor.vue'
import ContentEditor from './ContentEditor.vue'
import PageSelector from './PageSelector.vue'
import Loading from './Loading.vue'
import NavigatorBar from './NavigatorBar.vue'
export default {
  name: 'PostDetail',
  components: {
      PostFloor,
      ContentEditor,
      PageSelector,
      NavigatorBar,
      Loading
  },
  data () {
      return {
          postData: {},
          editorStatus: false,
          editorContent: '',
          postId: 0,
          postInfo: {}, // all post info
          totalPage: 0,
          pageSize: 30,
          currentPage: 1,
          onlyMainPost: false,
          mainPostReply: [],
          editorFloor: -1
      }
  },
  created() {
    this.postId = this.$route.params.post_id
    const that = this
    this.axios({
        method: 'get',
        url: '/api/v1/post/' + that.postId,
        headers: {
            'Authorization': that.token
        }
    })
    .then(res => {
        that.postInfo = res.data
        that.postData.title = that.postInfo.title
        let count = 1
        that.postInfo.floor = count++
        that.totalPage = Math.ceil(that.postInfo.reply.length / that.pageSize)
        for (let index in that.postInfo.reply) {
            that.postInfo.reply[index].floor = count++
            let each = that.postInfo.reply[index]
            if (each.userId === that.postInfo.userId) {
                that.mainPostReply.push(each)
            }
        }
        that.editorContent = that.postInfo.content
    })
    .catch(err => {
        
        console.error('getPostInfo', err)
    })
  },
  methods: {
      ...mapMutations(['setStarredPosts']),
        goBottom(){
            this.$refs.eb.scrollIntoView({
                behavior: "smooth",
                block: "end"
            })
        },
      starPost() {
        //   this.setStarredPosts([])
        //   console.log(this.starredPosts)
          let star = this.starredPosts
          if (this.starred) {
              for (let index in star) {
                  if (star[index].id === this.postInfo.id) {
                      star.splice(index,1)
                      break
                  }
              }
              this.setStarredPosts(star)
          }
          else {
              let info = JSON.parse(JSON.stringify(this.postInfo))
              info.reply = null
              star.push(info)
              this.setStarredPosts(star)
          }

      },
      catchData(data) {
          this.editorContent = data
      },
      catchEditorData(data) {
          this.postData.content = data
      },
      getReplyInfo(id) {
          //console.log(id)
          if (id === 0) {
              return {}
          }
          else {
              for (let each of this.postInfo.reply) {
                  if (each.id === id) {
                      return each
                  }
              }
          }
      },
      reply() {
          const postId = this.postInfo.id
          const content = this.editorContent
          const token = this.token

          //const that = this
          this.axios({
              method: 'post',
              url: '/api/v1/post/'+postId+'/reply',
              headers: {
                'Authorization': token
              },
              data: {
                  content: content,
              }
          })
          .then(res => {
              console.log(res)
              this.$message({
                  type: "success",
                  message: "回复成功"
              })
              location.reload()
          })
          .catch(err => {
                console.error('reply', err)
                if(err.response.status === 401) {
                    alert("登录失效")
                    this.$router.replace('/login')
                }
                else {
                    alert("发送失败，请刷新重试")
                }
          })
      },
      edit() {
          console.log(this.postData)
          const postId = this.postInfo.id
          const content = this.postData.content
          const title = this.postData.title
          const token = this.token

          this.axios({
              method: 'put',
              url: '/api/v1/post/'+postId,
              headers: {
                  'Authorization': token
              },
              data: {
                  title: title,
                  content: content
              }
          })
          .then(res => {
              console.log(res)
              this.$message({
                  type: "success",
                  message: "修改成功"
              })
              location.reload()
          })
          .catch(err => {
                if(err.response.status === 401) {
                    alert("登录失效")
                    this.$router.replace('/login')
                }
                else {
                    alert("发送失败，请刷新重试")
                }
                console.error('edit', err)
          })
      }
  },
  computed: {
      ...mapState(['token', 'userId','starredPosts']),
      starred() {
          for (let each of this.starredPosts) {
            //   console.log(each.id)
              if (each.id === this.postInfo.id)
                return true
          }
          return false
      },
      dynamicTotalPage () {
          if (this.replyList !== undefined && this.postInfo.reply !== undefined) {
              return this.onlyMainPost ? Math.ceil(this.replyList.length / this.pageSize) : Math.ceil(this.postInfo.reply.length / this.pageSize)
          }
          else {
              return 0
          }
          
      },
      replyList() {
          if (this.postInfo.reply !== undefined ) {
            if (this.onlyMainPost) 
                return this.mainPostReply.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize) 
            else 
                return this.postInfo.reply.slice((this.currentPage-1)*this.pageSize, this.currentPage*this.pageSize)
          }
          else
            return []
      },
      finished() {
          return this.postInfo.reply !== undefined
      }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-detail-container {
    display: flex;
    flex-direction: column;
    margin-left: 70px;
    margin-right: 70px;
}
.page-selector {
    margin-top: 10px;
    margin-bottom: 10px;
}
.content-editor {
    background: #fafafa;
    border-radius: 5px;
    padding-left: 20px;
    padding-right: 20px;
}
.reply-button {
    border-radius: 0 0 5px 5px ;
}
.button {
    margin-bottom: 10px;
}
.post-editor {
    background: #FAFAFA;
    border-radius: 5px;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
}
.post-button {
    margin-top: 10px;
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    padding-top: 10px;
    padding-bottom: 10px;
}
.search-bar {
    display: flex;
    margin-top: 10px;
    margin-bottom: 10px;
    justify-content: space-between;
}
#title-input {
    flex-grow: 1;
    border: transparent;
    border-bottom: #f0f0f0 solid 1px;
    margin-right: 20px;
    margin-left: 20px;
}
.only-main-post {
    width: 8em;
    height:3em;
    margin-right: 1em;
}
label {
    margin-left: 20px;
}

/* .nav {
    background: white;
} */
</style>
