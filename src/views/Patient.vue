<template>
    <div>
      <Header></Header>
      <el-tabs v-model="activeName" @tab-click="handleClick" style="width: 57%;margin: 0 auto;" type="card" >
        <el-tab-pane label="立即挂号" name="nowAppoint" width="30%">
          <el-form ref="form" :model="patientAppointment" label-width="80px">
            <el-form-item label="预约挂号" prop="1">
              <el-switch v-model="appointmentSwitch"></el-switch>
              <el-tooltip class="item" effect="dark" content="不选择预约今天" placement="right">
                <span class="el-icon-question"></span>
              </el-tooltip>
            </el-form-item>
            <el-form-item label="预约时间" v-show="appointmentSwitch" prop="2">
              <el-date-picker
                v-model="patientAppointment.appointmentTime"
                align="right"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd hh:mm:ss"
                :picker-options="pickerOptions"
                :default-value="mDate"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="医生" prop="3">
              <el-select v-model="patientApp.departmentId" placeholder="请选择部门" style="width: 200px;">
                <el-option
                  v-for="department in departments"
                  :key="department.id"
                  :label="department.departmentName"
                  :value="department.id">
                </el-option>
              </el-select>
              <el-select v-model="patientApp.sectionId" placeholder="请选择科室" style="width: 195px;">
                <el-option
                  v-for="section in sections"
                  :key="section.id"
                  :label="section.sectionName"
                  :value="section.id">
                </el-option>
              </el-select>
              <el-select placeholder="请选择医生" v-model="patientAppointment.doctorId">
                <el-option
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :label="doctor.doctorName"
                  :value="doctor.id"
                  :disabled="doctor.isFull">
                  {{doctor.doctorName}} {{doctor.nowNum}}/{{doctor.resources}}
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="病情" prop="4">
              <el-input type="textarea" v-model="patientAppointment.illness" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="patientAppointmentClick">立即预约</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="我的挂号" name="myAppoint">
          <el-table
            :data="MedicalHistoryVo.result"
            stripe
            style="width: 100%">
            <el-table-column
              prop="user"
              label="部门"
              width="180">
              <template slot-scope="departmentScope">
                <span>{{departmentScope.row.doctor.department}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="科室"
              width="180">
            </el-table-column>
            <el-table-column
              prop="user"
              label="医生">
            </el-table-column>
            <el-table-column
              prop="user"
              label="病情">
            </el-table-column>
            <el-table-column
              prop="user"
              label="状态">
            </el-table-column>
            <el-table-column
              prop="user"
              label="操作">
              <template slot-scope="doScope">
                <el-button type="text" size="small"
                >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的医保卡" name="myCard">角色管理</el-tab-pane>
      </el-tabs>
    </div>
</template>

<script>
  import Header from "./Header";
  import axios from "axios";
    export default {
        //import引入的组件需要注入到对象中才能使用",
        components: {Header},
        data() {
            //这里存放数据",
            return {
              mDate: new Date().setTime(new Date().getTime()+24*60*60*1000),
              pickerOptions: {
                disabledDate(time) {
                  return time.getTime() < Date.now();
                },
              },
              pageVo:{
                page:1,
                pageSize:10,
              },
              MedicalHistoryVo:{
                result:[],
              },
              departments:[],
              sections:[],
              doctors:[],
              appointmentSwitch:false,
              activeName: 'myAppoint',
              patientApp:{
                departmentId:null,
                sectionId:null,
                appointmentTime:null,
              },
              patientAppointment:{
                illness:null,
                appointmentTime:null,
                doctorId:null,
              },
            };
        },
        //监听属性 类似于data概念",
        computed: {},
        //监控data中的数据变化",
        watch: {
          appointmentSwitch:{
            handler(v){
                this.patientApp = {
                  departmentId:null,
                  sectionId:null,
                  appointmentTime:null,
                }
                this.patientAppointment.doctorId = null
                this.patientAppointment.appointmentTime = null
            }
          },
          "patientApp.departmentId": {
            handler(newValue){
              this.patientApp.sectionId = null;
              if(this.patientApp.departmentId != null && this.patientApp.departmentId != 0 ){
                this.getSectionByDepartmentId(this.patientApp.departmentId);
              }
            }
          },
          "patientApp.sectionId": {
            handler(newValue){
              this.getDoctorForPatient();
            }
          },
          "patientAppointment.appointmentTime":{
              handler(newV){
                  this.patientApp.appointmentTime = this.patientAppointment.appointmentTime
              }
          }
        },
        //方法集合",
        methods: {
          patientAppointmentClick(){
            //病人获取医生
            var that = this;
            var data = JSON.stringify(that.patientAppointment)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "patient/patientAppointment",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                this.$message({
                  message: '预约成功',
                  type: 'success'
                });
                that.activeName = "myAppoint";
                that.patientApp = {
                  departmentId:null,
                    sectionId:null,
                    appointmentTime:null,
                };
                that.patientAppointment = {
                  illness:null,
                    appointmentTime:null,
                    doctorId:null,
                };
              }else{
                console.log("失败")
              }

            }).catch(error=>{
              alert("失败")
            })
          },
          getDepartmentAll(){
            //获取所有部门
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
          getSectionByDepartmentId(id){
            //根据部门id 获取所有科室
            var that = this;
            axios({
              method: 'get',
              url: "section/getSectionByDepartmentId/"+id,
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
          getDoctorForPatient(){
            //病人获取医生
            var that = this;
            var data = JSON.stringify(that.patientApp)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "doctor/getDoctorForPatient",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                that.doctors = response.data.data;
              }else{
                  console.log("失败")
              }

            }).catch(error=>{
              alert("失败")
            })
          },
          handleClick(tab, event) {
            // console.log(tab, event);
          },
          getMedicineHistory(){
            //病人获取医生
            var that = this;
            var data = JSON.stringify(that.pageVo)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "patient/getMedicineHistory",
              data:data
            }).then(response=>{
              console.log(response)
              if(response.data.code == 200 ){
                that.MedicalHistoryVo = response.data.data;
              }else{
                console.log("失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          },
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
          this.getMedicineHistory();
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
.el-textarea__inner{
  width: 620px;
  min-width: 300px;
  min-height: 200px !important;
}
  .myAppointUl{
    width: 600px;
    display: flex;
  }
  .myAppointUl li{
    list-style: none;
    flex: 1;
    border-right:3px solid #eee;
    text-align:center;
  }
</style>

