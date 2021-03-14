<template>
    <div>
      <Header></Header>
      <div>
        <el-tabs tab-position="left"  type="border-card" style="height: 600px;">
          <el-tab-pane label="未处理">
            <el-table
              :data="noHistory.result"
              stripe
              style="width: 100%">
              <el-table-column
                prop="userName"
                label="病人名字">
              </el-table-column>
              <el-table-column
                prop="illness"
                label="病情">
              </el-table-column>
              <el-table-column
                prop="status"
                label="病单处理状态">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column>
              <el-table-column
                prop="appointmentTime"
                label="预约时间">
              </el-table-column>
              <el-table-column
                prop="id"
                label="操作">
                <template slot-scope="doScope" >
                  <div>
                    <el-button type="text" size="small" @click="doMedicalHistory(doScope.row,1)">立即处理</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="处理中">
            <el-table
              :data="doingHistory.result"
              stripe
              style="width: 100%">
              <el-table-column
                prop="userName"
                label="病人名字">
              </el-table-column>
              <el-table-column
                prop="illness"
                label="病情">
              </el-table-column>
              <el-table-column
                prop="status"
                label="病单处理状态">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column>
              <el-table-column
                prop="appointmentTime"
                label="预约时间">
              </el-table-column>
              <el-table-column
                prop="id"
                label="操作">
                <template slot-scope="doScope" >
                  <div>
                    <el-button type="text" size="small" @click="doMedicalHistory(doScope.row,1)">立即处理</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="处理完成">
            <el-table
              :data="complete.result"
              stripe
              style="width: 100%">
              <el-table-column
                prop="userName"
                label="病人名字">
              </el-table-column>
              <el-table-column
                prop="illness"
                label="病情">
              </el-table-column>
              <el-table-column
                prop="status"
                label="病单处理状态">
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间">
              </el-table-column>
              <el-table-column
                prop="appointmentTime"
                label="预约时间">
              </el-table-column>
              <el-table-column
                prop="id"
                label="操作">
                <template slot-scope="doScope" >
                  <div>
                    <el-button type="text" size="small" @click="doMedicalHistory(doScope.row,0)">查看详情</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="historyAc"
        width="50%">
        <div>
          <div>病人: {{doNoHistory.userName}}</div>
          <div>病情: {{doNoHistory.illness}}</div>
          <div>
            <div>诊断结果:</div>
            <el-input type="textarea" v-model="doNoHistory.result" ></el-input>
          </div>
          <div>
            <div>选择药物:</div>
            <div class="block">
              <el-cascader
                :show-all-levels="false"
                :options="medicineLinkage"
                :props="{ multiple: true }"
                v-model="medicineValue"
                clearable></el-cascader>
            </div>
          </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="cancel()">取 消</el-button>
              <el-button type="primary" @click="submitDo('处理中')">暂缓处理</el-button>
              <el-button type="primary" @click="submitDo('处理完成')">处理完成</el-button>
            </span>
        </template>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="completeAc"
        width="50%">
        <div>
          <div>病人: {{doNoHistory.userName}}</div>
          <div>病情: {{doNoHistory.illness}}</div>
          <div>
            <div>诊断结果:</div>
            <el-input type="textarea" v-model="doNoHistory.result" readonly="readonly"></el-input>
          </div>
          <div>
            <div>选择药物:</div>
            <div class="block">
              <el-cascader
                :show-all-levels="false"
                :options="medicineLinkage"
                :props="{ multiple: true }"
                v-model="medicineValue"
                clearable
                readonly="readonly"
              ></el-cascader>
            </div>
          </div>
        </div>
        <template #footer>
            <span class="dialog-footer">
              <el-button @click="completeAc =false">取 消</el-button>
              <el-button @click="completeAc =false" type="primary">确定</el-button>
            </span>
        </template>
      </el-dialog>
    </div>
</template>

<script>
  import Header from "./Header";
  import axios from "axios";
  import $ from 'jquery'
    export default {
        //import引入的组件需要注入到对象中才能使用",
        components: {
          Header
        },
        data() {
            //这里存放数据",
            return {
              completeAc:false,
                medicineLinkage:null,
                historyAc:false,
                noHistory:{
                    result:[],
                    total:0,
                },
                doingHistory:{
                  result:[],
                  total:0,
                },
                medicineValue:null,
                doNoHistory:{
                  userId:null,
                  id:null,
                  userName:null,
                  illness:null,
                  result:null,
                  medicineIds:[],
                  status:"处理中",
                },
              complete:{
                  result:[],
                  total:0,
              },
                noPageVo:{
                    page:1,
                    pageSize:10,
                },
                doPageVo:{
                    page:1,
                    pageSize:10,
                },
              comPageVo:{
                    page:1,
                    pageSize:10,
                }
            };
        },
        //监听属性 类似于data概念",
        computed: {},
        //监控data中的数据变化",
        watch: {
          medicineValue:{
              handler(newValue){
                  this.doNoHistory.medicineIds= []
                  for(var i =0 ;i<this.medicineValue.length;i++){
                    var id = this.medicineValue[i][2]
                    this.doNoHistory.medicineIds.push(parseInt(id))
                  }
              }
          }
        },
        //方法集合",
        methods: {
          submitDo(status){
            this.doNoHistory.status = status;
            console.log(this.doNoHistory)
            var that = this;
            var data = JSON.stringify(that.doNoHistory)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicalHistory/submitHistory",
              data:data
            }).then(response=> {
                if(response.data.code == 200){
                  this.$message({
                    message: '处理成功',
                    type: 'success'
                  });
                  location.reload();
                }
              }).catch(error=>{
                alert("失败")
              })
          },
          cancel(){
            this.historyAc = false;
            this.doNoHistory = {
                userId:null,
                id:null,
                userName:null,
                illness:null,
                result:null,
                medicine:[],
                status:"处理中",
            };
            this.medicineValue = [];
          },
          doMedicalHistory(obj,f){
              if(f == 1){
                this.historyAc = true;
              }else{
                  this.completeAc = true
              }
              this.doNoHistory.userName = obj.userName;
              this.doNoHistory.userId = obj.userId;
              this.doNoHistory.id = obj.id;
              this.doNoHistory.illness = obj.illness;
              this.doNoHistory.result = obj.result;
              this.doNoHistory.medicines = obj.result;
              this.medicineValue = obj.medicines;
          },
          getMedicalHistoryDay(){
            var that = this;
            var data = JSON.stringify(this.noPageVo)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicalHistory/getMedicalHistoryDay",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ) {
                that.noHistory = response.data.data;
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          getMedicineLinkage(){
            var that = this;
            axios({
              method: 'get',
              url: "medicine/getMedicineLinkage"
            }).then(response=>{
              if(response.data.code == 200 ){
                that.medicineLinkage = response.data.data;
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          getMedicalHistoryDoing(){
            var that = this;
            var data = JSON.stringify(this.doPageVo);
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicalHistory/getMedicalHistoryDoing",
              data:data
            }).then(response=>{
                console.log(response)
              if(response.data.code == 200 ) {
                that.doingHistory = response.data.data;
              }
            }).catch(error=>{
              alert("失败")
            })
          },
          getMedicalHistoryComplete(){
            var that = this;
            var data = JSON.stringify(this.comPageVo);
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicalHistory/getMedicalHistoryComplete",
              data:data
            }).then(response=>{
              console.log(response)
              if(response.data.code == 200 ) {
                that.complete = response.data.data;
              }
            }).catch(error=>{
              alert("失败")
            })
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
          this.getMedicalHistoryDay();
          this.getMedicineLinkage();
          this.getMedicalHistoryDoing();
          this.getMedicalHistoryComplete();
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
  width: 90%;
  min-height: 250px !important;
}
</style>

