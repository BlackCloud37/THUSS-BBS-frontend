<template>
<div class="post-reply-box-container" v-if="replyTo !== 0">
    <div class="reply-info">
        <div class="text">回复#{{ replyToInfo.floor }}:</div>
        <div class="text">
            <router-link :to="'/user/' + replyToInfo.userId" class="userinfo">{{ replyToInfo.nickname }}</router-link>
        </div>
    </div>
    <content-box class="content-box" :editor-content="replyToInfo.content"></content-box>
</div>
</template>

<script>
import ContentBox from './ContentBox.vue'
export default {
  name: 'PostReplyBox',
  components: {
      ContentBox
  },
  props: {
      replyTo: Number,
      replyToInfo: Object,
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.post-reply-box-container {
    display: flex;
    align-items: flex-start;
    padding-top: 10px;
    padding-left: 10px;
    padding-bottom: 10px;
    padding-right: 10px;
    
    /* max-height: 100%;
    overflow:scroll;
    background: red; */
}
.reply-info {
    flex-grow: 0;
    flex-shrink: 0;
    padding-right: 10px;
}
.userinfo {
    font-size: 16px;
}
.content-box {
    align-self: stretch;
    flex-grow: 1;
    text-align: left;
    max-width: 100%;
    max-height: 40em;
    overflow: auto;
}
</style>
