<template>
    <div v-if="totalPage > 1" class="page-selector-container">
        <button 
            v-if="currentPage > 1" 
            class="page-selector-button arrow"
            :class="{'left': currentPage > 1}" 
            @click="currentPage-=1;$emit('current-page',currentPage);_scrollToTop()">
             &lt; 上一页
        </button>
        <button 
            v-for='index in showIndex'  
            :key='index' 
            :class="{'selected':index === currentPage,'left':currentPage === 1 && index === 1,'right': currentPage === totalPage && index===totalPage}"
            class="page-selector-button" 
            @click="currentPage=index;$emit('current-page',currentPage);_scrollToTop()">
            {{index}}
        </button>
        <button 
            v-if="currentPage < totalPage" 
            class="page-selector-button arrow"
            :class="{'right': currentPage < totalPage}" 
            @click="currentPage+=1;$emit('current-page',currentPage);_scrollToTop()">
            下一页 &gt; 
        </button>
        <button class="page-selector-button goto" @click="Number(inputText)>totalPage?alert('非法页码'): (currentPage=Number(inputText),$emit('current-page',currentPage),_scrollToTop())">前往</button>
        <input min="1" :max="String(totalPage)" type="number" v-model="inputText" id="page-input" :placeholder="'1-'+totalPage"/>
    </div>
</template>

<script>
import {scrollToTop} from '../utility.js'
export default {
  name: 'PageSelector',
  props: {
      totalPage: Number,
      selectorSize: Number
  },
  data () {
      return {
          currentPage: 1,
          inputText: '',
      }
  },
  methods: {
      _scrollToTop() {
          scrollToTop()
      }
  },
  computed: {
      center() {
          const half = this.selectorSize / 2
          if (this.currentPage < half) {
              return half
          }
          else if (this.currentPage > (this.totalPage - half) ) {
              return this.totalPage - half
          }
          else {
              return this.currentPage
          }
      },
      begin() {
          const center = this.center
          const half = this.selectorSize / 2
          return center - half >= 1 ? center - half : 1
      },
      end() {
          const center = this.center
          const half = this.selectorSize / 2
          return center + half <= this.totalPage ? center + half : this.totalPage
      },
      showIndex() {
          let arr = []
          for (let i = this.begin; i <= this.end; i++) {
              arr.push(i)
          }
          return arr
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page-selector-container {
    background: #fafafa;
    width: 100%;
    display: flex;
    border-radius: 5px;
    align-items: center;
}
.page-selector-button {
    background: #fafafa;
    flex-grow: 1;
    border-radius: 0px;
    border-right: #404040 dotted 1px;
    height: 2em;
}
.selected {
    background: purple;
    color: white;
}
button:hover {
    background: #995599;
    color: white;
}

.arrow {
    flex-grow: 2;
}
.left {
    border-radius: 5px 0px 0px 5px;
    border-right: #404040 dotted 1px;
}
.right {
    border-radius: 0px;
    /* border-left: #404040 dotted 1px; */
    border-right: #404040 dotted 1px;
}
label {
    margin-left: 1em;
    margin-right: 1em;
}
#page-input {
    border: transparent;
    border-bottom: #f0f0f0 solid 1px;
    width: 4em;
    flex-grow: 0;
    outline: medium;
    margin-top: 5px;
    margin-bottom: 5px;
    margin-right: 10px;
    margin-left: 10px;
}
input::-ms-input-placeholder{
        text-align: center;
}
input::-webkit-input-placeholder{
        text-align: center;
}
.goto {
    width: 4em;
    flex-grow: 0;
}
</style>
