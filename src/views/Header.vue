<template>
    <div>
      <div style="width:100%;height: 80px;background-color:#16b7ff;">
        <el-dropdown style="float: right;padding-top:20px;padding-right:20px;">
            <span class="el-dropdown-link" style="font-size: 20px;">
              欢迎你，{{user.nickname}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item ><span @click="drawer = true">修改个人信息</span></el-dropdown-item>
            <el-dropdown-item ><span @click="loginOut()">退出登录</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <el-drawer
        title="修改个人信息"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose">

        <el-form :model="user" ref="userForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名" prop="pass">
            <el-input type="text" v-model="user.username" readonly="readonly" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名" prop="nickname">
            <el-input type="text" v-model="user.nickname" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="text" v-model="user.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="user.age"></el-input>
          </el-form-item>
          <el-form-item label="身份证" prop="card">
            <el-input v-model="user.card"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-drawer>
    </div>
</template>

<script>
  import axios from 'axios'
    export default {
        name:"Header",
        //import引入的组件需要注入到对象中才能使用",
        components: {},
        data() {
            //这里存放数据",
            return {
              changePassword:false,
              drawer:false,
                user:{
                    nickname:null,
                },
            };
        },
        //监听属性 类似于data概念",
        computed: {},
        //监控data中的数据变化",
        watch: {},
        //方法集合",
        methods: {
          loginOut(){
            window.sessionStorage.clear("token");
            this.$router.push("/login")
          },
          submitForm(formName) {
            var that = this;
            var data = JSON.stringify(that.user)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "user/updateUser",
              data:data
            }).then(response=>{
              if(response.data.code === 200){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                var user = window.sessionStorage.getItem("user");
                user = JSON.parse(user);
                console.log(user);
                console.log(that.user)
                if(that.user.password != user.password){
                  this.$router.push('/')
                }else{
                  window.sessionStorage.setItem("user",JSON.stringify(that.user))
                }
                that.drawer = false;
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          handleClose(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
          },
          resetForm(formName) {
            this.$refs[formName].resetFields();
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

          var user = window.sessionStorage.getItem("user");
          if(user == null ){
              alert("请登录");
            this.$router.push('/')
          }else{
              this.user = JSON.parse(user);
          }
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

</style>

