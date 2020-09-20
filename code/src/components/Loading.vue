<template>
<div class="loading-container">
    <div id="preloader_6">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
    </div>
    <div class="text">{{text}}</div>
</div>
</template>

<script>
export default {
    name:"Loading",
    data() {
        return {
            timer: null,
            text: "Loading"
        }
    },
    created() {
        this.timer = setInterval(()=> {
            let res = this.text.match(new RegExp("[.]", 'g'))
            res !== null && res.length >= 3 ? this.text="Loading" : this.text += "."
        }, 400)
    },
    destroyed() {
        clearInterval(this.timer)
    }
}
</script>

<style scoped>
.loading-container {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 100px;
    /* display: flex;
    flex-direction: column; */
}
#preloader_6{
    position:relative;
    width: 42px;
    height: 42px;
    animation: preloader_6 5s infinite linear;
    left: 50%;
    transform: translateX(-50%);
}
#preloader_6 span{
    width:20px;
    height:20px;
    position:absolute;
    background:gray;
    display:block;
    animation: preloader_6_span 1s infinite linear;
}
#preloader_6 span:nth-child(1){
  background: gray;
}
#preloader_6 span:nth-child(2){
  left:22px;
  background:lightgray;
  animation-delay: .2s;
}
#preloader_6 span:nth-child(3){
  top:22px;
  background:lightgray;
  animation-delay: .4s;
}
#preloader_6 span:nth-child(4){
  top:22px;
  left:22px;
  background:gray;
  animation-delay: .6s;
}
@keyframes preloader_6 {
    from {-ms-transform: rotate(0deg);}
    to {-ms-transform: rotate(360deg);}
}
@keyframes preloader_6_span {
   0% { transform:scale(1); }
   50% { transform:scale(0.5); }
   100% { transform:scale(1); }
}
.text {
    padding-top: 1em;
    text-align: left;
    width: 4em;
    position: absolute;
    transform:translateX(-50%);
    left: 50%;
}
</style>