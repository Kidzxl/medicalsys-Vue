<template>
  <div style="width:500px;margin: 0 auto;margin-top:10%;">
    <el-form :model="user" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="user.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" showPassword v-model="user.password"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="nickname">
        <el-input v-model="user.nickname"></el-input>
      </el-form-item>
      <el-form-item label="是否是医生" prop="isDoctor">
        <el-switch v-model="user.isDoctor"></el-switch>
      </el-form-item>
      <div class="doctorDiv" v-show="user.isDoctor">
        <el-form-item label="部门科室" prop="deSec">
          <el-select v-model="user.departmentId" placeholder="请选择" style="width: 200px;">
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.departmentName"
              :value="department.id">
            </el-option>
          </el-select>
          <el-select v-model="user.sectionId" placeholder="请选择" style="width: 195px;">
            <el-option
              v-for="section in sections"
              :key="section.id"
              :label="section.sectionName"
              :value="section.id">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button  style="width:150px;" type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
        <el-button style="width:150px;" @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  export default {
    //import引入的组件需要注入到对象中才能使用",
    components: {},
    data() {
      var deSecValidator = (rule, value, callback) => {

          console.log(this.user.isDoctor)
        if(this.user.isDoctor){
          console.log(this.user.departmentId == null)
          console.log(this.user.sectionId == null)
          if ( this.user.departmentId == null  || this.user.sectionId == null) {
            callback(new Error('请选择部门或者科室'));
          }else{
            callback();
          }
        }else{
            callback();
        }

      };
      return {
          user:{
              username:null,
              password:null,
              nickname:null,
              departmentId:null,
              sectionId:null,
              isDoctor:false
          },
        departments:"",
        sections:"",
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          nickname: [
            {required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          deSec: [
            { validator: deSecValidator, trigger: 'blur' }
          ],
        }
      };
    },
    //监听属性 类似于data概念",
    computed: {

    },
    //监控data中的数据变化",
    watch: {
      "user.departmentId":{
        handler(newValue){
          this.user.sectionId = null;
          this.getSectionByDepartmentId();
        }
      },
      "user.isDoctor":{
          handler(n){
              this.user.departmentId = null;
              this.user.sectionId = null;
          }
      }

    },
    //方法集合",
    methods: {
      submitForm(formName) {
          var that = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var data = JSON.stringify(that.user)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "user/addUser",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                this.$message({
                  message: '恭喜你，注册成功',
                  type: 'success'
                });
                this.$router.push('/login')
              }else{
                console.log("user/addUser  失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      getDepartmentAll(){
        var that = this;
        axios({
          method: 'get',
          url: "section/getDepartmentAll",
        }).then(response=>{
          if(response.data.code == 200 ){
            that.departments = response.data.data;
          }else{
              console.log("section/getDepartmentAll  失败")
          }
        }).catch(error=>{
          alert("失败")
        })
      },
      getSectionByDepartmentId(){
        var that = this;
        axios({
          method: 'get',
          url: "section/getSectionByDepartmentId/"+that.user.departmentId,
        }).then(response=>{
          if(response.data.code == 200 ){
            that.sections = response.data.data;
          }else{
            console.log("section/getSectionByDepartmentId  失败")
          }
        }).catch(error=>{
          alert("失败")
        })
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
      this.getDepartmentAll();
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


//  axios({
//    headers: {
//      'Content-Type': 'application/json'
//    },
//    method: 'post',
//    url: "api/company/getCompanyListByFilter",
//    data: JSON.stringify(data)
//  }).then(response=>{
//    if(response.data.code == 200 ){
//      that.searchData = response.data.result.data.companyList
//      that.total = that.searchData.length;
//    }
//  }).catch(error=>{
//    alert("失败")
//  })

</script>

<style>

</style>

