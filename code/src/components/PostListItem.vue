<template>
    <div class="post-list-item-container">
        <div class="post-info">
            <router-link :to="'/user/' + postInfo.userId" class="userinfo">{{ postInfo.nickname }}</router-link>
            <div class="post-time text">创建时间: {{ _monthDay(postInfo.created)+' '+_hourMin(postInfo.created) }}</div>
            <div class="post-time text">最后更新: {{ _monthDay(postInfo.updated)+' '+_hourMin(postInfo.updated) }}</div>    
        </div>
        <div class="post-preview">
            <div class="post-title title text" @click="addHistory">
                <router-link :to="'/post/' + postInfo.id">{{ postInfo.title === '' ? '_':postInfo.title.substr(0,30)+(postInfo.title.length>20?"...":"") }}</router-link>
            </div>
            <div class="post-content">
                <content-box class="content-box" ref="content" :editor-content="postInfo.content"></content-box>
            </div>
        </div>
    </div>
</template>

<script>
import {monthDay, hourMin} from '../utility.js'
import ContentBox from "./ContentBox.vue"
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'PostListItem',
  components: {
      ContentBox
  },
  props: {
      postInfo: Object
  },
  methods: {
      ...mapMutations(['setHistoryPosts']),
      addHistory() {
        //   this.setHistoryPosts([])
          let his = JSON.parse(JSON.stringify(this.historyPosts))
          for(let index in his) {
              if (his[index].id === this.postInfo.id) {
                  his.splice(index,1)
                  break
              }
          }
          his.push(this.postInfo)
          this.setHistoryPosts(his)
      },
      _monthDay(dateStr){
          return monthDay(dateStr)
      },
      _hourMin(dateStr){
          return hourMin(dateStr)
      }
  },
  computed: {
      ...mapState(['historyPosts'])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-list-item-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 20px;
    padding-top: 20px;
    border-top: #808080 dotted 1px;
    width: 100%;   
}
/* .post-info:hover {
    transform: scale(1.05,1.05);
    transition: transform 0.1s;

} */
.post-preview {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    flex-grow: 1;
    padding-right: 10px;
    padding-left: 5px;
    width: 0;
    padding-left: 10px;
    border-left: #808080 dotted 1px;
    
    /* background: red; */
}
.post-info {
    flex-basis: 10em;
    flex-shrink: 0;
    display: flex;
    align-self: stretch;
    flex-direction: column;
    align-items: flex-start;
    padding-left: 10px;
    border-left: purple solid 10px;
    border-radius: 10px;
}
.post-content {
    border-radius: 5px;
    background: #F0F0F0;
    flex-grow: 1;
    width: 100%;
    max-height: 20em;
    overflow: auto;
    box-shadow: darkgrey 0 0 2px 1px;
}
.post-content:hover {
    box-shadow: darkgrey 0 0 12px 1px;
    transition: box-shadow 0.2s;
}
/* .content-box:hover {
    transform: scale3d(0.99,0.99,0.99);
    transition: transform 0.2s;
} */
.post-time {
    padding-top: 2px;
}
.post-title {
    padding-bottom: 10px;
}
</style>
