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
              label="部门">
              <template slot-scope="departmentScope">
                <span>{{departmentScope.row.doctor.department}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="科室">
              <template slot-scope="sectionScope">
                <span>{{sectionScope.row.doctor.section}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="医生">
              <template slot-scope="userScope">
                <span>{{userScope.row.user.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="病情">
              <template slot-scope="illScope">
                <span>{{illScope.row.history.illness}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="创建时间">
              <template slot-scope="illScope">
                <span>{{illScope.row.history.createTime| dateFormate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="预约时间" >
              <template slot-scope="illScope">
                <span>{{illScope.row.history.appointmentTime | dateFormate}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="状态">
              <template slot-scope="stateScope">
                <span>{{stateScope.row.history.status}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="user"
              label="操作">
              <template slot-scope="doScope" >
                <div v-show="doScope.row.history.status == '处理完成'">
                  <el-button type="text" size="small" @click="openDrawer(doScope.row.history.id)">处理结果</el-button>
                </div>
                <div v-show="doScope.row.history.status != '处理完成'">
                  <span style="color: lightskyblue;">处理中</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="我的医保卡" name="myCard">
            <div v-show="myMeCard.balance == null">
              <span>暂无医保卡</span>
              <el-button type="primary" @click="createMyCard">立即创建医保卡</el-button>
            </div>
            <div v-show="myMeCard.balance != null">
              <div>
                <span>姓名: {{user.nickname}}</span>
                <span>余额: {{myMeCard.balance}}</span>
                <el-button type="primary" @click="czCard = true">立即充值</el-button>

              </div>
              <div>
                <el-table
                  :data="cardHistory"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="remark"
                    label="备注">
                  </el-table-column>
                  <el-table-column
                    prop="createTime"
                    label="时间">
                  </el-table-column>
                </el-table>
              </div>
            </div>
        </el-tab-pane>
      </el-tabs>
      <el-dialog
        title="充值医保卡"
        :visible.sync="czCard"
        width="20%"
        :before-close="handleClose">
        <span>
          <el-input type="number" v-model="czPrice" placeholder="请输入要充值的金额" style="width: 100%;"></el-input>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="czCard = false">取 消</el-button>
          <el-button type="primary" @click="goPay">确 定</el-button>
       </span>
      </el-dialog>

      <el-drawer
        title="处理结果"
        :visible.sync="detailDrawer"
        direction="rtl"
        :before-close="handleClose22">
        <div>
          <div>
            <span>病情: </span>
            <div style="margin-top:10px;">
              <el-input type="textarea" v-model="detailMe.medicalHistory.illness" readonly="readonly"></el-input>
            </div>
            <span style="display:block;margin-top: 10px;margin-bottom: 10px;">处理结果: </span>
            <div>
              <el-input type="textarea" v-model="detailMe.medicalHistory.result" readonly="readonly"></el-input>
            </div>
            <div>
              <div style="display:block;margin-top: 10px;margin-bottom: 10px;">药品详情:</div>
              <el-table
                :data="detailMe.medicines"
                stripe
                style="width: 80%">
                <el-table-column prop="medicineName" label="名字">
                </el-table-column>
                <el-table-column prop="price" label="名字">
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 20px;">
              <span>总价格: {{detailMe.total}}</span>
              <span style="padding-left:70%;color: red;">状态: {{detailMe.order.payStatus}}</span>
            </div>
            <el-button  type="primary" style="margin-top:5%;width: 300px;margin-left: 20%;"
                        v-show="detailMe.order.payStatus == '未支付'" @click="goPayXf">
              去支付
            </el-button>
          </div>
        </div>
      </el-drawer>
    </div>
</template>

<script>
  import Header from "./Header";
  import axios from "axios";
  import $ from 'jquery'

  export default {
        //import引入的组件需要注入到对象中才能使用",
        components: {Header},
        data() {
            var user = window.sessionStorage.getItem("user");
            var u ;
            if(user == null){
                u = {
                    nickname:null,
                }
            }else{
              u = JSON.parse(user);
            }
            //这里存放数据",
            return {
              detailDrawer:false,
              detailMe:{
                medicalHistory:{
                  illness:null,
                  result:null,
                  updateTime:null,
                  },
                order:{
                  payStatus:null,
                }
              },
              czPrice:0,
              czCard:false,
              user:u,
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
              myMeCard:{
                balance:null,
              },
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
              cardHistory:[],
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
          openDrawer(id){
            this.getMedialHistoryDetail(id);
            this.detailDrawer = true;
          },
          handleClose22(done) {
            this.$confirm('确认关闭？')
              .then(_ => {
                done();
              })
              .catch(_ => {});
          },
          goPay(){
            if((/(^[1-9]\d*$)/.test(this.czPrice))){
              var that = this;
              var localUrl = window.location.href
              var d = {
                  url:localUrl,
                  price:this.czPrice.toString(),
                  remake:"充值医保卡",
                  isCz:true
              }
              console.log(d);
              var data = JSON.stringify(d)
              axios({
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'post',
                url: "pay",
                data:data
              }).then(response=>{
                console.log(response)
                var myWindow = window.open('','width=200,height=100');
                myWindow.document.write(response.data)
                this.czCard = false;
                //$("body").html(response.data)
              }).catch(error=>{
                alert("失败")
              })
            }else{
                console.log("负数")
            }

          },
          goPayXf(){
            if(this.myMeCard.balance >= this.detailMe.total){
              var that = this;
              var localUrl = window.location.href
              var d = {
                url:localUrl,
                price:this.detailMe.total.toString(),
                remake:"支付订单",
                isCz:false,
                orderId:this.detailMe.order.id
              }
              var data = JSON.stringify(d)
              axios({
                headers: {
                  'Content-Type': 'application/json'
                },
                method: 'post',
                url: "pay",
                data:data
              }).then(response=>{
                console.log(response.data)
                var myWindow = window.open('','width=200,height=100');
                console.log(1);
                myWindow.document.write(response.data)
                console.log(2);
                that.detailDrawer = false;
                console.log(3);
                //$("body").html(response.data)
              }).catch(error=>{
                alert("失败")
              })
            }else{
                alert("医保卡余额不足，请充值。")
            }

          },
          handleClose(done) {
            this.$confirm('真的不充值了嘛？')
              .then(_ => {
                done();
              })
          },
          getCardHistory(){
            var id = this.myMeCard.id;
            var that = this;
            axios({
              method: 'get',
              url: "medicareCard/getCardHistory/"+id,
            }).then(response=>{
              if(response.data.code == 200 ){
                that.cardHistory = response.data.data;
              }
            }).catch(error=>{
              alert("失败")
            }).catch(_ => {});
          },
          createMyCard(){
            var that = this;
            axios({
              method: 'get',
              url: "medicareCard/createMyCard",
            }).then(response=>{
              if(response.data.code == 200 ){
                that.getMyCardClick();
              }
            }).catch(error=>{
                console.log(error)
              alert("失败")
            })
          },
          getMyCardClick(){
            //获取我的医保卡
            var that = this;
            axios({
              method: 'get',
              url: "medicareCard/getMyCard",
            }).then(response=>{
              if(response.data.code == 200 ){
                that.myMeCard = response.data.data;
                that.getCardHistory();
              }
            }).catch(error=>{
              alert("失败")
            })
          },
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
                that.getMedicineHistory();
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
              if(response.data.code == 200 ){
                that.MedicalHistoryVo = response.data.data;
              }else{
                console.log("失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          initActive(){
            var query=this.$route.query;

            if("active" in query){
                this.activeName = query["active"]
            }
          },
          getMedialHistoryDetail(id){
            var that = this;
            axios({
              method: 'get',
              url: "patient/getMedialHistoryDetail/"+id,
            }).then(response=>{
              if(response.data.code == 200 ){
                that.detailMe = response.data.data;
              }else{
                console.log("section/getMedialHistoryDetail  失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          }
        },
       filters:{
           dateFormate:function (value) {
              if(value == null ){
                  return "未预约";
              }
              return value.slice(0,10);
           }
        },
        //生命周期 - 挂载完成（可以访问DOM元素）",html模板已渲染
        mounted() {
          this.initActive();
          this.getDepartmentAll();
          this.getMedicineHistory();
          this.getMyCardClick();
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
  width: 530px;
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

