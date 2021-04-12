<template>
  <div id="myiframe">
    <iframe width="100%"  height="100%" src="../../static/contact.html" frameborder="0" scrolling="yes"></iframe>
  </div>
</template>

<script>
    import $ from "jquery";

    export default {
        name: "Contact",
        mounted() {
          $(document).ready(function(){
            //高度设置
            var height = $(window).height();
            $('#myiframe').height(height);
          })
          function changeFrameHeight(){
            var ifm= document.getElementById("myiframe");
            $('#myiframe').height($(window).height());
          }
          window.onresize=function(){
            changeFrameHeight();
          }
        }
    }
</script>

<style scoped>

</style>
