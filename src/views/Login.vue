
<template>
  <div id="concent" class="pr">
    <div class="login_form pa">
      <div class="form_title">账号密码登陆</div>
      <div class="zu_form">
        <div class="u_name">
          <el-input v-model="user.username" placeholder="请输入用户名"></el-input>
        </div>
        <div class="u_name">
          <el-input
            v-model="user.password"
            placeholder="请输入密码"
            show-password
          ></el-input>
        </div>
        <div style="height: 40px;
    margin-right: 150px;">
          <span>是否是医生</span>
          <el-switch v-model="user.isDoctor"></el-switch>
        </div>
        <el-button type="success" @click="login" style="width:60%;">登陆</el-button>
        <div class="register pa">
          <a class="" @click="toRegiester">账号注册</a>
          <a style="margin-left:20px;" @click="checkManager">管理员登录</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
    export default {
        //import引入的组件需要注入到对象中才能使用",
        components: {},
        data() {
            //这里存放数据",
            return {
                user:{
                    username:null,
                    password:null,
                    isDoctor:false,
                }
            };
        },
        //监听属性 类似于data概念",
        computed: {},
        //监控data中的数据变化",
        watch: {},
        //方法集合",
        methods: {
          toRegiester:function(){
            this.$router.push('/register')
          },
          login(){
              var that = this;
            var data = JSON.stringify(that.user)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "user/loginUser",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                 let data = response.data.data;
                window.sessionStorage.setItem("token",data.token);
                window.sessionStorage.setItem("user",JSON.stringify(data.user));
                if(data.doctor == null){
                  this.$message({
                    message: '恭喜你，登录成功',
                    type: 'success'
                  });
                  this.$router.push('/patient')
                }else{
                  window.sessionStorage.setItem("doctor",JSON.stringify(data.doctor));
                  this.$message({
                    message: '欢迎回来,'+ data.user.nickname,
                    type: 'success'
                  });
                  this.$router.push('/doctor')
                }
              }else{
                alert("请检查自己的身份和账号密码或者账号未激活");
                console.log("user/loginUser  失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          checkManager(){
            var that = this;
            this.$prompt('请输入管理员身份账号', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputErrorMessage: '秘钥不正确'
            }).then(({ value }) => {
              if(value == "root123"){
                this.$message({
                  type: 'success',
                  message: '欢迎回来,管理员 '
                });
                that.$router.push("/manager");
              }else{
                this.$message.error('错了哦，再想想');
              }
            }).catch(() => {
            });
          }
        },
        //生命周期 - 创建之前",数据模型未加载,方法未加载,html模板未加载
        beforeCreate() {
        },

        //生命周期 - 创建完成（可以访问当前this实例）",数据模型已加载，方法已加载,html模板已加载,html模板未渲染
        created() {

        },
        //生命周期 - 挂载之前",html模板未渲染
        beforeMount() {

        },

        //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
        mounted() {

        },

        //生命周期 - 更新之前",数据模型已更新,html模板未更新
        beforeUpdate() {

        },
        //生命周期 - 更新之后",数据模型已更新,html模板已更新
        updated() {

        },
        //生命周期 - 销毁之前",
        beforeDestroy() {

        },
        destroyed() {

        },
        //生命周期 - 销毁完成",
        //如果页面有keep-alive缓存功能，这个函数会触发",
        activated() {

        },
    }


    // "http-get请求": {
    //   "prefix": "httpget",
    //     "body": [
    //     "this.\({",
    //     "url: this.\\$http.adornUrl(''),",
    //     "method: 'get',",
    //     "params: this.\\$http.adornParams({})",
    //     "}).then(({ data }) => {",
    //     "})"
    //   ],
    //     "description": "httpGET请求"
    // },
    // "http-post请求": {
    //   "prefix": "httppost",
    //     "body": [
    //     "this.\({",
    //     "url: this.\\$http.adornUrl(''),",
    //     "method: 'post',",
    //     "data: this.\\$http.adornData(data, false)",
    //     "}).then(({ data }) => { });"
    //   ],
    //     "description": "httpPOST请求"
    // }
    // }

</script>
<style>
  #concent{
    background: url("../assets/img/login_bg.jpg");
    background-size: 100% auto;
    background-position: center center;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    /*margin-top: 20%;*/
    /*width: 100%;*/
    /*height: 100vh;*/
  }
  .login_form{
    position: absolute;
    width: 480px;
    height: 345px;
    background: #FFF;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    padding: 40px 10px 10px 10px;
    -moz-box-shadow: 10px 10px 5px #888888; /* 老的 Firefox */
    box-shadow: 0px 0px 20px #888888;
    display: flex;
    flex-direction: column;
  }
  .form_title{
    text-align: center;
    font-size: 20px;
  }
  .zu_form{
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .u_name{
    width: 60%;
    display: flex;
    align-items: center;
    justify-content: left;
    margin: 0 0 15px 0;
  }
  .register{
    /* width: 100%; */
    /* text-align: right; */
    font-size: 15px;
    right: 10px;
    bottom: 10px;
    cursor: pointer;
  }

</style>


