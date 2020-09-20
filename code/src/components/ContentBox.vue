<template>
  <div id="wangeditor" @click="bigger =! bigger">
    <div v-show="false" ref="menu"></div>
    <div ref="editor" class="editor-content"></div>
  </div>
</template>

<script>
import E from "wangeditor"
export default {
    name: 'ContentBox',
    components: {
    },
    data () {
        return {
            editor: null,
            bigger: false
        }
    },
    props: {
        editorContent: String
    },
    watch: {
        bigger(val) {
            if (val) {
                let el = document.createElement('html')
                el.innerHTML = this.editorContent
                for(let img of el.getElementsByTagName('img') ){
                    img.style.maxHeight = '100%'
                    img.style.maxWidth = '100%'
                }
                this.editor.txt.html(el.innerHTML)
            }
            else {
                let el = document.createElement('html')
                el.innerHTML = this.editorContent
                for(let img of el.getElementsByTagName('img') ){
                    img.style.maxHeight = '60em'
                    img.style.maxWidth = '100%'
                }
                this.editor.txt.html(el.innerHTML)
            }
        }
    },
    mounted() {
        this.editor = new E(this.$refs.menu, this.$refs.editor)
        this.editor.customConfig.menus = []
        this.editor.create()
        this.editor.$textElem.attr('contenteditable', false)
        let el = document.createElement('html')
        el.innerHTML = this.editorContent
        for(let img of el.getElementsByTagName('img') ){
            img.style.maxHeight = '60em'
            img.style.maxWidth = '100%'
        }
        this.editor.txt.html(el.innerHTML)
    },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.editor-content {
    text-align: left;
    overflow: auto;
    max-width: 100%;
}
</style>
