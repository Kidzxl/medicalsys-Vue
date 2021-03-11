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
            <template slot="title"><i class="el-icon-menu"></i>订单管理</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="activeFunc(2)">订单管理</el-menu-item>
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

        <el-main style="padding: 0" v-show="userAc">
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
        <el-main style="padding:0" v-show="doctorAc">
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
            :total="doctors.totalSize"
            >
          </el-pagination>

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
  export default {
    components: {ElMain},
    name: "Manager",
    data() {
      return {
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
        userAc: true,
        doctorAc: false,
        proAc: false,
      };
    },
    methods: {
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
            this.proAc = false;
            break;
          case 2:
            this.userAc = false;
            this.doctorAc = true;
            this.proAc = false;
            break;
          case 3:
            this.userAc = false;
            this.doctorAc = false;
            this.proAc = true;
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
        if (this.proAc) {
          var that = this;
          axios({
            method: "get",
            url: "/product/getProductAll",
          })
            .then((response) => {
              console.log(response);
              if (response.data.code == 200) {
                that.productList = response.data.data;
              }
            })
            .catch((error) => {
              alert("失败");
            });
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
