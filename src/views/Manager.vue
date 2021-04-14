<template>
  <div>
    <el-container style="border: 1px solid #eee">
<!--      导航-->
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '2', '3','4','5']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>用户管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="activeFunc(1)">账号管理</el-menu-item >
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="1-2" @click="activeFunc(2)">医生激活</el-menu-item >
            </el-menu-item-group>
            <el-menu-item-group>
              <el-menu-item index="1-3" @click="activeFunc(5)">医生管理</el-menu-item >
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>药品知识库</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="activeFunc(3)">药品管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>科室部门</template>
            <el-menu-item-group>
              <el-menu-item index="3-1" @click="activeFunc(4)">科室管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title"><i class="el-icon-setting"></i>订单中心</template>
            <el-menu-item-group>
              <el-menu-item index="4-1" @click="activeFunc(6)">订单管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title"><i class="el-icon-setting"></i>病历中心</template>
            <el-menu-item-group>
              <el-menu-item index="5-1" @click="activeFunc(7)">病历</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <el-dropdown>
            <span class="el-dropdown-link" >
              欢迎你，管理员<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item ><span @click="loginOut">退出登录</span></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>

        <el-main style="padding: 0;" v-show="userAc" title="账号管理">
          <el-table :data="userList">
            <el-table-column prop="nickname" label="真实姓名"> </el-table-column>
            <el-table-column prop="sex" label="性别"> </el-table-column>
            <el-table-column prop="age" label="年龄"> </el-table-column>
            <el-table-column prop="card" label="身份证"> </el-table-column>
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
        <el-main style="padding:0;" v-show="doctorAc" title="医生激活">
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
        <el-main style="padding: 0;" v-show="meAc" title="药品管理">
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
        <el-main style="padding: 0;" v-show="seAc" title="科室管理">
          <div style="margin-top:10px;">
            <el-form :inline="true" :model="sectionCondition">
              <el-form-item >
                <el-select v-model="sectionCondition.departmentId" placeholder="按部门搜索" style="width: 200px;">
                  <el-option
                    v-for="department in departments"
                    :key="department.id"
                    :label="department.departmentName"
                    :value="department.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="sePage(0)">搜索</el-button>
              </el-form-item>
              <el-form-item>
                <el-button @click="resetForm('seForm')">重置</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="addSectionFlag = true" >增加科室</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div>
            <el-table
              :data="sectionData.result"
              style="width: 100%">
              <el-table-column
                prop="id"
                label="序号"
                width="50">
              </el-table-column>
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
              <el-table-column prop="id" label="操作">
                <template slot-scope="seScope">
                  <el-button
                    @click="deleteSection(seScope.row.id)"
                    type="text"
                    size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div>
              <el-pagination
                :hide-on-single-page="true"
                background
                @current-change="sePage"
                :current-page="1"
                layout="prev, pager, next"
                :page-size="10"
                :total="sectionData.totalSize">
              </el-pagination>
            </div>
          </div>
        </el-main>
        <el-main style="padding:0;" v-show="doAc" title="医生管理">
          <el-table
            :data="doctorAndResource"
            style="width: 100%">
            <el-table-column
              prop="doctorVo"
              label="姓名"
              width="180">
              <template slot-scope="userScope">
                <span>{{userScope.row.doctorVo.nickname}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="doctorVo"
              label="部门"
              width="180">
              <template slot-scope="departmentScope">
                <span>{{departmentScope.row.doctorVo.department}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="doctorVo"
              label="科室"
              width="180">
              <template slot-scope="sectionScope">
                <span>{{sectionScope.row.doctorVo.section}}</span>
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              label="资源上限">
              <template slot-scope="rew">
                <span>{{rew.row.resources.upperLimit}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="操作" width="200">
              <template slot-scope="editScope">
                <el-button
                  @click="editResource(editScope.row)"
                  type="text"
                  size="small">编辑资源上限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-main style="padding: 0;" v-show="orderAc" title="订单管理">
          <el-table
            :data="orderData.result"
            style="width: 100%">
            <el-table-column
              prop="id"
              label="订单id">
            </el-table-column>
            <el-table-column
              prop="nickname"
              label="用户">
            </el-table-column>
            <el-table-column
              prop="medicalHistoryId"
              label="病史id">
            </el-table-column>
            <el-table-column
              prop="payStatus"
              label="支付状态">
            </el-table-column>
            <el-table-column
              prop="total"
              label="支付金额">
            </el-table-column>
             <el-table-column
              prop="medicines"
              label="药品">
               <template slot-scope="medicinesScope">
                 <el-table :data=" medicinesScope.row.medicines">
                   <el-table-column
                     prop="medicineName"
                     label="药品名字">
                   </el-table-column>
                   <el-table-column
                     prop="price"
                     label="价格">
                   </el-table-column>
                 </el-table>
               </template>
            </el-table-column>

          </el-table>
            <div>
              <el-pagination
                :hide-on-single-page="true"
                background
                @current-change="orderPage"
                :current-page="1"
                layout="prev, pager, next"
                :page-size="10"
                :total="orderData.totalSize">
              </el-pagination>
            </div>
        </el-main>
        <el-main style="padding: 0;" v-show="historyAc" title="病历管理">
          <el-table
            :data="hisData.result"
            style="width: 100%">
            <el-table-column
              prop="doctorName"
              label="医生"
              width="180">
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户"
              width="180">
            </el-table-column>
            <el-table-column
              prop="illness"
              label="病情"
              width="180">
            </el-table-column>
            <el-table-column
              prop="result"
              label="处方"
              width="180">
            </el-table-column>
            <el-table-column
              prop="status"
              label="状态">
            </el-table-column>
          </el-table>
            <div>
              <el-pagination
                :hide-on-single-page="true"
                background
                @current-change="historyPage"
                :current-page="1"
                layout="prev, pager, next"
                :page-size="10"
                :total="hisData.totalSize">
              </el-pagination>
            </div>
        </el-main>
      </el-container>
    </el-container>


<!--    弹出窗口  -->
    <el-drawer title="修改用户信息" :visible.sync="userDrawer" direction="ttb" :before-close="handleClose">
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
    <el-dialog title="增加科室" :visible.sync="addSectionFlag">
      <div>
        <el-form :model="addSectionData" :inline="true"  >
          <el-form-item label="部门" prop="department">
            <el-select v-model="addSectionData.departmentId" placeholder="请选择部门" style="width: 150px;">
              <el-option
                v-for="department in departments"
                :key="department.id"
                :label="department.departmentName"
                :value="department.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="科室" prop="section">
            <el-input v-model="addSectionData.sectionName" placeholder="输入科室名字"></el-input>
          </el-form-item>
            <div style="margin-left: 25%">
              <el-button type="primary" style="width:400px;" @click="addSection">提交</el-button>
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
        doctorAndResource:[{
          doctorVo:{

          },
          resources:{
            upperLimit:0
          }
        }],
        addSectionData:{
          departmentId:null,
          sectionName:null,
        },
        addSectionFlag:false,
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
        seAc:false,
        doAc:false,
        orderAc:false,
        historyAc:false,
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
        },
        sectionCondition:{
          departmentId:null,
          page:1,
          pageSize:10,
        },
        sectionData:{
          result:[],
          totalSize :0,
        },
        hisPage:{
            page:1,
            pageSize:10
        },
        hisData:{
            result:[],
          totalSize:0,
        },
        ordPage:{
            page:1,
            pageSize:10
        },
        orderData:{
            result:[],
          totalSize:0,
        }
      };
    },
    watch: {
      "meCondition.departmentId": {
        handler(newValue){
          this.meCondition.sectionId = null;
          if(this.meCondition.departmentId != null && this.meCondition.departmentId !== 0 ){
            this.getSectionByDepartmentId(this.meCondition.departmentId);
          }

        }
      },
      "insertMedicineData.departmentId": {
        handler(newValue){
          this.insertMedicineData.sectionId = null;
          if(this.insertMedicineData.departmentId != null && this.insertMedicineData.departmentId != 0 ){
            this.getSectionByDepartmentId(this.insertMedicineData.departmentId);
          }

        }
      },
    },
    methods: {
      deleteSection(id){
//删除药品
        var that = this;
        axios({
          method: 'delete',
          url: "section/deletedSection/"+id,
        }).then(response=>{
          if(response.data.code == 200 ){
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            that.sePage(0);
          }else{
            console.log("section/getSectionAll  失败")
          }
        }).catch(error=>{
          // //alert("失败")
        })
      },
      addSection(){
        var that = this;
        console.log(this.addSectionData)
        if(this.addSectionData.sectionName == null || this.addSectionData.sectionName === "" || this.addSectionData.departmentId === null){
           alert("请完善输入信息")
        }else{
          axios({
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            url: "section/addSection",
            data:JSON.stringify(that.addSectionData)
          }).then(response=>{
            if(response.data.code === 200 ){
              this.$message({
                type: 'success',
                message: '新增成功'
              });
              that.sePage(0);
              that.addSectionFlag = false;
            }
          }).catch(error=>{
            // //alert("失败")
          })
        }
      },
      loginOut(){
        this.$router.push("/login")
      },
      editResource(obj){
        var that = this;
        this.$prompt('请输入要修改的数值', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern:/(^[1-9]\d*$)/,
          inputErrorMessage: '请输入正整数'
        }).then(({value}) => {
          obj.resources.upperLimit = value;
          var data = JSON.stringify(obj);
          axios({
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'post',
            url: "doctor/updateDoctorAndResource",
            data:data
          }).then(response=>{
            if(response.data.code == 200 ){
              this.$message({
                type: 'success',
                message: '修改成功'
              });
              that.getDoctorAll();
            }
          }).catch(error=>{
           // //alert("失败")
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        })
      },
      resetForm(formName) {
        //重置表单
         if(formName == "meConditionForm"){
           this.meCondition={
             departmentId:null,
               sectionId:null,
               page:1,
               pageSize:10,
               medicineName:null,
           }
         }
         if(formName == "seForm"){
           this.sectionCondition = {
             departmentId:null,
               page:1,
               pageSize:10,
           }
         }
      },
      searchMe(){
        //搜索药品 分页
        this.meCondition.page = 1;
        this.meCondition.pageSize = 10;
        this.getMedicineAll();
      },
      mePage(val){
         this.meCondition.page = val;
         this.getMedicineAll();
      },
      sePage(val){
        this.sectionCondition.page = val;
        this.sectionCondition.pageSize = 10;
        this.getSectionAll();
      },
      historyPage(val){
        this.hisPage.page = val;
        this.getMedicalHistoryAll();
      },
      orderPage(val){
        this.ordPage.page = val;
        this.getOrderAll();
      },
      reMe(obj){
        // 编辑药品弹窗打开
        this.editMe = true;
        var objString = JSON.stringify(obj);
        this.editVo = JSON.parse(objString);
        this.getSectionByDepartmentId(obj.departmentId);
      },
      deleteMe(id){
        //删除药品
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
         // //alert("失败")
        })
      },
      insertMedicineClick(formName){
        //新增药品点击事件提交
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
             // //alert("失败")
            })
          }
        })
      },
      editMedicineClick(formName){
        // 编辑药品点击提交
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
             // //alert("失败")
            })
          }
        })
      },
      getMedicineAll(){
        //根据条件获取药品
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
          if(response.data.code == 200 ){
            that.medicineAllData = response.data.data;
          }else{
           this.medicineAllData={
              result:[],
                totalSize :0,
            }
          }
        }).catch(error=>{
          //alert("失败")
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
          //alert("失败")
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
          //alert("失败")
        })
      },
      activeDoctor(id){
        // 激活医生
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
            //alert("失败");
          });
      },
      activeFunc(idx) {
        // 左边导航激活函数
        switch (idx) {
          case 1:
            this.userAc = true;
            this.doctorAc = false;
            this.meAc = false;
            this.seAc = false;
            this.doAc = false;
            this.orderAc = false;
            this.historyAc = false;
            break;
          case 2:
            this.userAc = false;
            this.doctorAc = true;
            this.meAc = false;
            this.seAc = false;
            this.doAc = false;
            this.orderAc = false;
            this.historyAc = false;
            break;
          case 3:
            this.userAc = false;
            this.doctorAc = false;
            this.meAc = true;
            this.seAc = false;
            this.doAc = false;
            this.orderAc = false;
            this.historyAc = false;
            break;
          case 4:
            this.userAc = false;
            this.doctorAc = false;
            this.meAc = false;
            this.seAc = true;
            this.orderAc = false;
            this.historyAc = false;
            break;
          case 5:
            this.userAc = false;
            this.doctorAc = false;
            this.meAc = false;
            this.seAc = false;
            this.doAc = true;
            this.orderAc = false;
            this.historyAc = false;
            break;
          case 6:
            this.userAc = false;
            this.doctorAc = false;
            this.meAc = false;
            this.seAc = false;
            this.doAc = false;
            this.orderAc = true;
            this.historyAc = false;
            break;
        case 7:
          this.userAc = false;
          this.doctorAc = false;
          this.meAc = false;
          this.seAc = false;
          this.doAc = false;
          this.orderAc = false;
          this.historyAc = true;
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
              //alert("失败");
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
            //alert("失败")
          })
        }
        if (this.meAc) {
            this.getMedicineAll();
            this.getDepartmentAll();
        }
        if(this.seAc){
          this.getDepartmentAll();
          this.getSectionAll();
        }
      },
      formatBoolean(row, column, cellValue) {
        //格式化 Boolean 是 -- 否
        var ret = ""; //你想在页面展示的值
        if (cellValue) {
          ret = "是"; //根据自己的需求设定
        } else {
          ret = "否";
        }
        return ret;
      },
      formatActive(row, column, cellValue) {
        // 格式化Boolean  正在使用 -- 已经删除
        var ret = "";
        if(cellValue){
            ret = "正在使用";
        }else{
            ret = "已经删除";
        }
        return ret;
      },
      init() {
        // 获取所有用户
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
            //alert("失败");
          });
      },
      edit(obj) {
        // 编辑用户
        this.userDrawer = true;
        var objString = JSON.stringify(obj);
        this.editUser = JSON.parse(objString);
      },
      deleteUser(idx) {
        // 删除用户
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
            //alert("失败");
          });
      },
      handleClose(done) {
        // 用户编辑窗口 关闭
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
        // 用户编辑提交
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
            //alert("失败");
          });
      },
      getSectionAll(){
        var that = this;
        var data = JSON.stringify(that.sectionCondition)
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          url: "section/getSectionAll",
          data:data
        }).then(response=>{
          if(response.data.code == 200 ){
            that.sectionData = response.data.data;
          }else{
            this.medicineAllData={
              result:[],
              totalSize :0,
            }
          }
        }).catch(error=>{
          //alert("失败")
        })
      },
      getDoctorAll(){
        var that = this;
        axios({
          method: "get",
          url: "/doctor/getDoctorAndResource",
        }).then((response) => {
            if (response.data.code === 200) {
              that.doctorAndResource = response.data.data;
            }
          })
          .catch((error) => {
            //alert("失败");
          });
      },
      getMedicalHistoryAll(){
        var that = this;
        var data = JSON.stringify(that.hisPage)
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          url: "medicalHistory/getMedicalHistoryAll",
          data:data
        }).then(response=>{
          console.log(response)
          if(response.data.code == 200 ){
            that.hisData = response.data.data;
          }
        }).catch(error=>{
          //alert("失败")
        })
      },
      getOrderAll(){
        var that = this;
        var data = JSON.stringify(that.ordPage)
        axios({
          headers: {
            'Content-Type': 'application/json'
          },
          method: 'post',
          url: "medicineOrder/getOrderAll",
          data:data
        }).then(response=>{
          console.log(response)
          if(response.data.code == 200 ){
            that.orderData = response.data.data;
          }
        }).catch(error=>{
          //alert("失败")
        })
      }
    },
    mounted() {
      this.init();
      this.getDoctorAll();
      this.getMedicalHistoryAll();
      this.getOrderAll();
    },
  };
</script>
