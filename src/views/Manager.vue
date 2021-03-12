<template>
  <div>
    <el-container style="border: 1px solid #eee">
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2', '3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>用户管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="activeFunc(1)">账号管理</el-menu-item >
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="1-2" @click="activeFunc(2)">医生激活</el-menu-item >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>药品知识库</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="activeFunc(3)">药品管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>商品管理</template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="activeFunc(3)">商品管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <span>管理员</span>
        </el-header>

        <el-main style="padding: 0;" v-show="userAc">
          <el-table :data="userList">
            <el-table-column prop="nickname" label="真实姓名"> </el-table-column>
            <el-table-column prop="username" label="账号"> </el-table-column>
            <el-table-column prop="password" label="密码"> </el-table-column>
            <el-table-column prop="active" label="是否激活" :formatter="formatActive"> </el-table-column>
            <el-table-column
              prop="isDoctor"
              label="是否是医生"
              :formatter="formatBoolean"
            >
            </el-table-column>
            <el-table-column prop="id" label="操作">
              <template slot-scope="userScope">
                <el-button @click="edit(userScope.row)" type="text" size="small"
                >编辑</el-button
                >
                <el-button
                  @click="deleteUser(userScope.row.id)"
                  type="text"
                  size="small"
                >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-main style="padding:0;" v-show="doctorAc">
          <el-table
            :data="doctors.result"
            style="width: 100%">
            <el-table-column
              prop="nickname"
              label="姓名"
              width="180">
            </el-table-column>
            <el-table-column
              prop="department"
              label="部门"
              width="180">
            </el-table-column>
            <el-table-column
              prop="section"
              label="科室"
              width="180">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间">
            </el-table-column>
            <el-table-column prop="id" label="操作">
              <template slot-scope="doctorScope">
                <el-button
                  @click="activeDoctor(doctorScope.row.id)"
                  type="text"
                  size="small">激活</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            :hide-on-single-page="true"
            background
            layout="prev, pager, next"
            :page-size="10"
            :total="doctors.totalSize"
            >
          </el-pagination>

        </el-main>
        <el-main style="padding: 0;" v-show="meAc">
          <div style="margin-top:10px;">
            <el-form :model="meCondition" :inline="true" label-width="80px" class="demo-ruleForm" ref="meConditionForm">
            <el-form-item label="部门" prop="department">
              <el-select v-model="meCondition.departmentId" placeholder="按部门搜索" style="width: 200px;">
                <el-option
                  v-for="department in departments"
                  :key="department.id"
                  :label="department.departmentName"
                  :value="department.id">
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="科室" prop="section">
                <el-select v-model="meCondition.sectionId" placeholder="按科室搜索" style="width: 195px;">
                  <el-option
                    v-for="section in sections"
                    :key="section.id"
                    :label="section.sectionName"
                    :value="section.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="药品名字" prop="section">
                <el-input v-model="meCondition.medicineName" placeholder="按药品名字搜索"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchMe">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm('meConditionForm')">重置</el-button>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="insertMedicine = true" >增加药品</el-button>
              </el-form-item>

          </el-form>
          </div>
          <div>
            <el-table
              :data="medicineAllData.result"
              style="width: 100%">
              <el-table-column
                prop="departmentName"
                label="部门"
                width="180">
              </el-table-column>
              <el-table-column
                prop="sectionName"
                label="科室"
                width="180">
              </el-table-column>
              <el-table-column
                prop="medicineName"
                label="药品名字"
                width="180">
              </el-table-column>
              <el-table-column
                prop="price"
                label="价钱">
              </el-table-column>
              <el-table-column
                prop="deleted"
                label="是否删除"
                :formatter="formatBoolean"
              ></el-table-column>
              <el-table-column prop="id" label="操作">
                <template slot-scope="meScope">
                  <el-button
                    @click="deleteMe(meScope.row.id)"
                    type="text"
                    size="small">删除</el-button>
                  <el-button
                    @click="reMe(meScope.row)"
                    type="text"
                    size="small">编辑</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <el-pagination
                :hide-on-single-page="true"
                background
                @current-change="mePage"
                :current-page="1"
                layout="prev, pager, next"
                :page-size="10"
                :total="medicineAllData.totalSize">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
    <el-drawer
      title="修改用户信息"
      :visible.sync="userDrawer"
      direction="ttb"
      :before-close="handleClose"
    >
      <el-form
        :inline="true"
        size="small "
        :model="editUser"
        class="demo-form-inline"
        style="padding-left: 20px"
      >
        <el-form-item label="真实姓名" label-width="100px">
          <el-input v-model="editUser.nickname" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="editUser.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editUser.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="是否激活">
          <el-switch v-model="editUser.active"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="checkEdit">确认编辑</el-button>
        </el-form-item>
      </el-form>
    </el-drawer>

    <el-dialog title="增加药品" :visible.sync="insertMedicine">
      <div>
        <el-form :model="insertMedicineData" :inline="true" :rules="insertMedicineRules" ref="insertMedicine">
          <el-form-item label="部门" prop="department">
            <el-select v-model="insertMedicineData.departmentId" placeholder="请选择部门" style="width: 150px;">
              <el-option
                v-for="department in departments"
                :key="department.id"
                :label="department.departmentName"
                :value="department.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="section">
            <el-select v-model="insertMedicineData.sectionId" placeholder="请选择科室" style="width: 150px;">
              <el-option
                v-for="section in sections"
                :key="section.id"
                :label="section.sectionName"
                :value="section.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品名字" prop="medicineName">
            <el-input v-model="insertMedicineData.medicineName" placeholder="请输入药品名字" style="width: 150px;"></el-input>
          </el-form-item>
            <el-form-item label="药品价钱" prop="price">
              <el-input type="number" v-model="insertMedicineData.price" placeholder="请输入价钱" style="width: 150px;"></el-input>
            </el-form-item>
            <div style="margin-left: 25%">
              <el-button type="primary" style="width:400px;" @click="insertMedicineClick('insertMedicine')">提交</el-button>
            </div>
        </el-form>
      </div>
    </el-dialog>
    <el-dialog title="编辑药品" :visible.sync="editMe">
      <div>
        <el-form :model="editVo" :inline="true" :rules="editMedicineRules" ref="editMedicine">
          <el-form-item label="部门" prop="department">
            <el-select v-model="editVo.departmentId" placeholder="请选择部门" style="width: 150px;">
              <el-option
                v-for="department in departments"
                :key="department.id"
                :label="department.departmentName"
                :value="department.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="section">
            <el-select v-model="editVo.sectionId" placeholder="请选择科室" style="width: 150px;">
              <el-option
                v-for="section in sections"
                :key="section.id"
                :label="section.sectionName"
                :value="section.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="药品名字" prop="medicineName">
            <el-input v-model="editVo.medicineName" placeholder="请输入药品名字" style="width: 150px;"></el-input>
          </el-form-item>
            <el-form-item label="药品价钱" prop="price">
              <el-input type="number" v-model="editVo.price" placeholder="请输入价钱" style="width: 150px;"></el-input>
            </el-form-item>
          <el-form-item label="是否删除" prop="price">
            <el-switch v-model="editVo.deleted"></el-switch>
            </el-form-item>
            <div style="margin-left: 25%">
              <el-button type="primary" style="width:400px;" @click="editMedicineClick('editMedicine')">提交</el-button>
            </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<style>
  .el-header {
    background-color: #b3c0d1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }
</style>

<script>
  import axios from "axios";
  import ElMain from "../../node_modules/element-ui/packages/main/src/main";
  import ElForm from "../../node_modules/element-ui/packages/form/src/form";
  import ElFormItem from "../../node_modules/element-ui/packages/form/src/form-item";
  import ElInput from "../../node_modules/element-ui/packages/input/src/input";
  export default {
    components: {
      ElInput,
      ElFormItem,
      ElForm,
      ElMain},
    name: "Manager",
    data() {
      var departmentV = (rule, value, callback) => {
          if(this.insertMedicineData.departmentId == null){
            callback(new Error('请选择部门'));
          }else{
              callback();
          }
        };
      var sectionV = (rule, value, callback) => {
          if(this.insertMedicineData.sectionId == null){
            callback(new Error('请选择科室'));
          }else{
              callback();
          }

        };
      var editDepartmentV = (rule, value, callback) => {
          if(this.editVo.departmentId == null){
            callback(new Error('请选择部门'));
          }else{
              callback();
          }
        };
      var editSectionV = (rule, value, callback) => {
          if(this.editVo.sectionId == null){
            callback(new Error('请选择科室'));
          }else{
              callback();
          }

        };
      return {
        editMe:false,
        userList: null,
        orderList: null,
        productList: null,
        userDrawer: false,
        editUser: {
          id: null,
          nickname: null,
          password: null,
          sex: null,
          tel: null,
          username: null,
          vendor: null,
        },
        doctors:{
          result:[],
          totalSize :0,
        },
        doctorCondition:{
          page:1,
          pageSize:10,
          departmentId:null,
          sectionId:null,
        },
        meCondition:{
          departmentId:null,
          sectionId:null,
          page:1,
          pageSize:10,
          medicineName:null,
        },
        insertMedicine:false,
        insertMedicineData:{
          sectionId:null,
          departmentId:null,
          medicineName:null,
          price:null,
        },
        departments:[],
        sections:[],
        userAc: true,
        meAc: false,
        doctorAc:false,
        insertMedicineRules: {
          department: [
            { required: true,validator: departmentV, trigger: 'blur' },
          ],
          section: [
            { required: true,validator: sectionV, trigger: 'blur' },
          ],
          medicineName: [
            { required: true, message: '请输入药品名字', trigger: 'blur' },
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
          ],
        },
        editMedicineRules: {
          department: [
            { required: true,validator: editDepartmentV, trigger: 'blur' },
          ],
          section: [
            { required: true,validator: editSectionV, trigger: 'blur' },
          ],
          medicineName: [
            { required: true, message: '请输入药品名字', trigger: 'blur' },
          ],
          price: [
            { required: true, message: '请输入价格', trigger: 'blur' },
          ],
        },
        medicineAllData:{
            result:[],
            totalSize :0,
        },
        editVo:{
          deleted:null,
          departmentId:null,
          departmentName:null,
          id:null,
          medicineName:null,
          price:null,
          sectionId:null,
          sectionName:null,
        }
      };
    },
    watch: {
      "meCondition.departmentId": {
        handler(newValue){
          this.meCondition.sectionId = null;
          if(this.meCondition.departmentId != null && this.meCondition.departmentId != 0 ){
            this.getSectionByDepartmentId(this.meCondition.departmentId);
          }

        }
      },
      "insertMedicineData.departmentId": {
        handler(newValue){
          this.insertMedicineData.sectionId = null;
          this.getSectionByDepartmentId(this.insertMedicineData.departmentId);
        }
      },
    },
    methods: {
      resetForm(formName) {
         if(formName == "meConditionForm"){
           this.meCondition={
             departmentId:null,
               sectionId:null,
               page:1,
               pageSize:10,
               medicineName:null,
           }
         }
      },
      searchMe(){
        this.meCondition.page = 1;
        this.meCondition.pageSize = 10;
        this.getMedicineAll();
      },
      mePage(val){
         this.meCondition.page = val;
         this.getMedicineAll();
      },
      reMe(obj){
        this.editMe = true;
        this.editVo = obj;
        this.getSectionByDepartmentId(obj.departmentId);
      },
      deleteMe(id){
          var that = this;
        axios({
          method: 'delete',
          url: "medicine/deleteMedicine/"+id,
        }).then(response=>{
          if(response.data.code == 200 ){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            that.getMedicineAll();
          }else{
            console.log("section/getDepartmentAll  失败")
          }
        }).catch(error=>{
          alert("失败")
        })
      },
      insertMedicineClick(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var that = this;
            var data = JSON.stringify(that.insertMedicineData)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicine/insertMedicine",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                this.$message({
                  message: '插入成功',
                  type: 'success'
                });
                that.insertMedicineData ={
                  sectionId:null,
                    departmentId:null,
                    medicineName:null,
                    price:null,
                }
                that.insertMedicine = false;
                that.getMedicineAll();
              }else{
                console.log("section/insertMedicine  失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          }
        })
      },
      editMedicineClick(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            var that = this;
            var data = JSON.stringify(that.editVo)
            axios({
              headers: {
                'Content-Type': 'application/json'
              },
              method: 'post',
              url: "medicine/updateMedicine",
              data:data
            }).then(response=>{
              if(response.data.code == 200 ){
                this.$message({
                  message: '更新成功',
                  type: 'success'
                });
                this.editMe = false;
                this.editVo = {
                  deleted:null,
                  departmentId:null,
                  departmentName:null,
                  id:null,
                  medicineName:null,
                  price:null,
                  sectionId:null,
                  sectionName:null,
                };
                that.getMedicineAll();
              }else{
                console.log("section/insertMedicine  失败")
              }
            }).catch(error=>{
              alert("失败")
            })
          }
        })
      },
      getMedicineAll(){
        var that = this;
        var data = JSON.stringify(that.meCondition)
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          url: "medicine/getMedicineAll",
          data:data
        }).then(response=>{
          console.log(response)
          if(response.data.code == 200 ){
            that.medicineAllData = response.data.data;
          }else{
           this.medicineAllData={
              result:[],
                totalSize :0,
            }
          }
        }).catch(error=>{
          alert("失败")
        })
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
      getSectionByDepartmentId(id){
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
      activeDoctor(id){
        var that = this;
        axios({
          method: "get",
          url: "/doctor/auditDoctor/"+id,
        })
          .then((response) => {
            if (response.data.code == 200) {
              this.$message({
                message: '激活成功',
                type: 'success'
              });
               that.activeFunc(2);
            }
          })
          .catch((error) => {
            alert("失败");
          });
      },
      activeFunc(idx) {
        switch (idx) {
          case 1:
            this.userAc = true;
            this.doctorAc = false;
            this.meAc = false;
            break;
          case 2:
            this.userAc = false;
            this.doctorAc = true;
            this.meAc = false;
            break;
          case 3:
            this.userAc = false;
            this.doctorAc = false;
            this.meAc = true;
            break;
        }
        if (this.userAc) {
          var that = this;
          axios({
            method: "get",
            url: "/user/getUserAll",
          })
            .then((response) => {
              if (response.data.code == 200) {
                that.userList = response.data.data;
              }
            })
            .catch((error) => {
              alert("失败");
            });
        }
        if (this.doctorAc) {
          var that = this;
          var data = JSON.stringify(that.doctorCondition)
          axios({
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            url: "doctor/awaitAuditDoctorAll",
            data:data
          }).then(response=>{
            if(response.data.code == 200 ){
              console.log(response)
              that.doctors = response.data.data;
            }
          }).catch(error=>{
            alert("失败")
          })
        }
        if (this.meAc) {
            this.getMedicineAll();
            this.getDepartmentAll();

//          var that = this;
//          axios({
//            method: "get",
//            url: "/product/getProductAll",
//          })
//            .then((response) => {
//              console.log(response);
//              if (response.data.code == 200) {
//                that.productList = response.data.data;
//              }
//            })
//            .catch((error) => {
//              alert("失败");
//            });
        }
      },
      formatBoolean: function (row, column, cellValue) {
        var ret = ""; //你想在页面展示的值
        if (cellValue) {
          ret = "是"; //根据自己的需求设定
        } else {
          ret = "否";
        }
        return ret;
      },
      formatActive(row, column, cellValue) {
        var ret = "";
        if(cellValue){
            ret = "正在使用";
        }else{
            ret = "已经删除";
        }
        return ret;
      },
      init() {
        var that = this;
        axios({
          method: "get",
          url: "/user/getUserAll",
        })
          .then((response) => {
            if (response.data.code == 200) {
              that.userList = response.data.data;
            }
          })
          .catch((error) => {
            alert("失败");
          });
      },
      edit(obj) {
        this.userDrawer = true;
        var objString = JSON.stringify(obj);
        this.editUser = JSON.parse(objString);
      },
      deleteUser(idx) {
        console.log(idx);
        var that = this;
        axios({
          method: "delete",
          url: "/user/deleteUserById/" + idx,
        })
          .then((response) => {
            if (response.data.data) {
              alert("删除成功");
              location.reload();
            }
          })
          .catch((error) => {
            alert("失败");
          });
      },
      handleClose(done) {
        var that = this;
        this.$confirm("确认关闭？")
          .then((_) => {
            that.editUser = {
              id: null,
              nickname: null,
              password: null,
              sex: null,
              tel: null,
              username: null,
              vendor: null,
            };
            done();
          })
          .catch((_) => {});
      },
      checkEdit() {
        var data = this.editUser;
        var that = this;

        axios({
          headers: {
            "Content-Type": "application/json",
          },
          method: "post",
          url: "user/updateUserForManager",
          data: JSON.stringify(data),
        })
          .then((response) => {
            if (response.data.code == 200) {
              alert("更新成功");
              location.reload();
            }
          })
          .catch((error) => {
            alert("失败");
          });
      },
    },
    mounted() {
      this.init();
    },
  };
</script>
