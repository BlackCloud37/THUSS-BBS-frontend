<template>
    <div class="post-list-container" v-if="finished">
        <post-list-item v-for="item in showPostList" :key="item.id" :post-info="item"></post-list-item>
        <page-selector :selector-size="10" :total-page="dynamicTotalPage" @current-page="getCurrentPage($event)"></page-selector>
    </div>
    <div class="loading" v-else>
        Loading
    </div>

</template>

<script>
import {mapState} from 'vuex'
import PostListItem from './PostListItem.vue'
import PageSelector from './PageSelector.vue'

export default {
  name: 'PostList',
  components: {
      PostListItem,
      PageSelector
  },
  created () {
      this.currentPage = 1
      if (!this.prepared)
          this.getCurrentPage(1)
      else {
          this.postInfoList = this.prePostList
          this.totalPosts = this.prePostList.length
          this.totalPage = 1
          this.finished = true
          this.$emit('finish')
      }
  },
  props: {
      userId: {
          type: Number,
          default: -1
      },
      searchWord: {
          type: String,
          default: ''
      },
      prePostList: {
          type: Array,
          default: Array
      },
      prepared: {
          type: Boolean,
          default: false
      }
  },
  methods: {
        getCurrentPage(page) {
            this.currentPage = page
            const pageId = this.currentPage

            const that = this
            this.axios({
                method: 'get',
                url: '/api/v1/post?page='+pageId+'&size='+that.pageSize+'&orderByReply=true'+(that.userId!==-1?"&userId="+that.userId:""),
                headers: {
                    'Authorization': that.token
                }
            })
            .then(res => {
                that.postInfoList = res.data.posts
                that.totalPosts = res.data.total
                that.totalPage = Math.ceil(that.totalPosts / that.pageSize)
                that.finished = true
                that.$emit('finish')
            })
            .catch(err => {
                if(err.response.status === 401) {
                    alert("登录失效")
                    this.$router.replace('/login')
                }
                else {
                    alert("获取帖子信息失败，请刷新重试")
                }
                console.error('getPage', err)
            })
      }
  },
  data () {
    return {
        postInfoList: [],
        currentPage: 1,
        pageSize: 50,
        totalPosts: 1,
        totalPage: 1,
        finished: false,
    }
  },
  computed: {
      ...mapState(['token']),
      showPostList() {
          if (this.searchWord === '') {
              return this.postInfoList
          }
          else {
              let res = []
              for (let each of this.postInfoList) {
                  if (each.nickname.indexOf(this.searchWord) !== -1 ||
                      each.title.indexOf(this.searchWord) !== -1 ||
                      each.content.indexOf(this.searchWord) !== -1) {
                          res.push(each)
                      }
              }
              return res
          }
      },
      dynamicTotalPage() {
          return this.searchWord === '' ? this.totalPage : 0
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-list-container {
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 10px;
    margin-bottom: 10px;
}
</style>
