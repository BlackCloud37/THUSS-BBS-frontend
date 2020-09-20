<template>
    <div class="post-floor-container">
        <div class="post-floor-wrapper">
            <div class="post-floor-info">
                <div class="post-floor-floor" >#{{ floorInfo.floor }}楼</div>
                <router-link :to="'/user/' + floorInfo.userId" class="userinfo">{{ floorInfo.nickname }}</router-link>
                <div class="post-time text">创建时间:<br>{{ _monthDay(floorInfo.created)+' '+_hourMin(floorInfo.created) }}</div>
                <div class="post-time text">最后编辑:<br> {{ _monthDay(floorInfo.updated)+' '+_hourMin(floorInfo.updated) }}</div>    
            </div>
            <div class="post-floor-content">
                <post-reply-box class="reply-box" v-if="!isMainFloor && floorInfo.replyId !== 0" :reply-to="floorInfo.replyId" :reply-to-info="replyToInfo"></post-reply-box>
                <content-box class="content-box" :editor-content="floorInfo.content"></content-box>
                <div ref="bottom" />
            </div>
            <div class="post-floor-button-box">
                <!-- <button v-if="toohigh" class="post-floor-edit-button button" @click="scrollToBottom">
                    层底
                </button> -->
                <button class="post-floor-edit-button button" :class="{'button-selected':editorStatus}" @click="onReplyButton" v-if="!isMainFloor">
                    {{ editorStatus ? "收起" : "回复"}}
                </button>
                <button class="post-floor-edit-button button" :class="{'button-selected':editorStatus}" @click="onEditButton" v-if="!isMainFloor && floorInfo.userId === userId && !editorStatus">
                    {{ editorStatus ? "收起" : "编辑" }}
                </button>
            </div>
        </div>
        <div class="post-editor" v-if="editorStatus" >
            <content-editor class="content-editor" :catch-data="catchData" :set-content="submit===edit?floorInfo.content:''"></content-editor>
            <button id="submit" class="post-button" @click="submit">提交</button>
        </div>
        <div ref="peditor"></div>
    </div>
</template>

<script>
import ContentEditor from './ContentEditor.vue'
import PostReplyBox from './PostReplyBox.vue'
import ContentBox from './ContentBox.vue'
import {monthDay, hourMin} from '../utility.js'
import { mapState } from 'vuex'
export default {
  name: 'PostFloor',
  components: {
      PostReplyBox,
      ContentEditor,
      ContentBox,
  },
  created() {
    //   console.log(this.floorInfo.content)
  },
  data () {
      return {
          editFloor: -1,
          editorContent: '',
          submit: Function(),
      }
  },
  props: {
      floorInfo: Object, // content of this floor
      replyToInfo: {
          type: Object,
          default: null
      },
      editorStatus: {
          type: Boolean,
          default: false
      },
  },
  methods: {
      scrollToBottom() {
          this.$refs.bottom.scrollIntoView({
              behavior:"smooth",
              block:"end"
          })
      },
      onReplyButton() {
          this.editorStatus?this.$emit('close',this.floorInfo.floor):this.$emit('open',this.floorInfo.floor);this.submit=this.reply
          if (!this.editorStatus) {
            this.$refs.peditor.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
          }
      },
      onEditButton() {
          this.editorStatus?this.$emit('close',this.floorInfo.floor):this.$emit('open',this.floorInfo.floor);this.submit=this.edit
          if (!this.editorStatus) {
            this.$refs.peditor.scrollIntoView({
                behavior: "smooth",
                block: "start"
            })
            
          }
      },
      _monthDay(dateStr){
          return monthDay(dateStr)
      },
      _hourMin(dateStr){
          return hourMin(dateStr)
      },
      catchData (data) {
          this.editorContent = data
      },
      reply() {
          const postId = this.floorInfo.postId
          const floorId = this.floorInfo.id
          const content = this.editorContent
          const token = this.token

          this.axios({
              method: 'post',
              url: '/api/v1/post/' + postId + '/reply',
              headers: {
                'Authorization': token
              },
              data: {
                  content: content,
                  replyId: floorId
              }
          })
          .then(res => {
              this.$message({
                  type: "success",
                  message: "回复成功"
              })
              console.log(res)
              location.reload()
          })
          .catch(err => {
              console.error('reply', err)
              if(err.response.status === 401) {
                  alert("登录失效")
                  this.$router.replace('login')
              }
              else {
                  alert("发送失败，请刷新重试")
              }
          })
      },
      edit() {
          const postId = this.floorInfo.postId
          const content = this.editorContent
          const floorId = this.floorInfo.id
          const token = this.token

          this.axios({
              method: 'put',
              url: '/api/v1/post/'+postId+'/reply/'+floorId,
              headers: {
                  'Authorization': token
              },
              data: {
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
                    this.$router.replace('login')
                }
                else {
                    alert("发送失败，请刷新重试")
                }
              console.error('edit', err)
          })
      }
  },
  computed: {
      ...mapState(['userId', 'token']),
      isMainFloor () {
          return this.floorInfo.postId === undefined
      },
    //   toohigh() {
    //       return true
    //   }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-floor-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    /* background: red; */
}
.post-floor-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20px;
    padding-top: 20px;
    border-top: #808080 dotted 1px;
    width: 100%;
}
.post-time {
    font-size: 14px;
}

.post-floor-info {
    display: flex;
    flex-direction: column;
    flex-basis: 6em;
    flex-shrink: 0;
    flex-grow: 0;
    border-right: #808080 dotted 1px;
    border-radius: 10px 0 0 10px;
    align-self: stretch;
    padding-left: 10px;
    border-left: purple solid 10px;
    /* border-radius: 5px; */
}

.post-floor-floor {
    flex-basis: 1em;
    align-items: flex-start;
    padding-bottom: 10px;
    color: purple;
    font-size: 25px;
}

.post-floor-content {
    background: #fafafa;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    border-radius: 5px;
    margin-left: 10px;
    margin-right: 10px;
    align-self: stretch;
    overflow: auto;
}
.content-box {
    /* background: red; */
    width: 100%;
    height: 100%;
}
.reply-box {
    background: #f0f0f0;
    width: 80%;
    border-radius: 5px;
    margin-top: 10px;
    margin-right: 10px;
    margin-bottom: 10px;
}

.post-floor-button-box {
    align-content: flex-end;
    flex-basis: 3em;
    flex-shrink: 0;
    flex-grow: 0;
    padding-left: 10px;
}
.post-floor-edit-button {
    margin-bottom: 10px;
    height: 3em;
    width: 4em;
}

.userinfo{
    padding-bottom: 10px;
}

.post-editor {
    background: #FAFAFA;
    border-radius: 5px;
    margin-top: 20px;
    margin-bottom: 40px;
    /* align-self: center; */
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
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
.content-editor {
    background: #fafafa;
    border-radius: 5px;
    padding-left: 20px;
    padding-right: 20px;
    
}
</style>
