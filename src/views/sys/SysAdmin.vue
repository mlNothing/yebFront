<template>
    <div>
        <div class="headerSearch">
            <el-input placeholder="请输入操作员" prefix-icon="el-icon-search" v-model="keyWords"></el-input>
            <el-button icon="el-icon-search" type="primary" @click="doSearch">搜索</el-button>
        </div>
        <div class="cardPerson">
            <div slot="header" class="clearfix" v-for="(admin,index) in admins" :key="index">
                <el-card class="box-card">
                <span>{{admin.name}}</span>
                <el-button style="float: right; padding: 3px 0" type="text" icon="el-icon-delete" @click="deleteAdmin(admin)"></el-button>
                <div class="fontadmin">
                    <div>姓名:{{admin.name}}</div>
                    <div>电话号码:{{admin.phone}}</div>
                    <div>家庭住址:{{admin.address}}</div>
                    <div>英文名称:{{admin.username}}</div>
                    <div>用户状态：
                        <el-switch  v-model="admin.enabled" active-color="#13ce66"
                         inactive-color="#ff4949" active-text="开启" inactive-text="关闭"
                         @change="enabledChange(admin)"
                         ></el-switch>
                    </div>
                    <div>用户角色:
                        <el-tag type="success" v-for="(role,indexj) in admin.roles" :key="indexj">{{role.nameZh}}</el-tag>
                         <el-popover
                                placement="right"
                                title="角色列表"
                                width="200"
                                @show="showPop(admin)"
                                 @hide="hidePop(admin)"
                                trigger="click">
                            <el-select v-model="selectedRoles" multiple placeholder="请选择">
                                <el-option
                                    v-for="(r,index) in allRoles"
                                    :key="index"
                                    :label="r.nameZh"
                                    :value="r.id">
                                </el-option>
                            </el-select>
                            <!-- 3个点按钮 ... -->
                            <el-button slot="reference" type="text" icon="el-icon-more"></el-button>
                            </el-popover>
                    </div>
                </div>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
       return{
           admins:[],
           keyWords:'',
           selectedRoles:[],
           allRoles:[]
       }
    },
   mounted(){
        this.initAdmins();
    },
    methods:{
        doSearch(){
            this.initAdmins();
        },
        deleteAdmin(admin){
        this.$confirm('此操作将永久删除'+admin.name+', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.getRequest('/system/admin/'+admin.id).then(()=>{
                  this.$message({
            type: 'success',
            message: '删除成功!'
          });
          this.initAdmins();
            })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });   
        },
        enabledChange(data){
            this.putRequest('/system/admin/updateAdmin/',data).then(resp=>{
                if(resp){
                    this.initAdmins();
                }
            })
        },
        initAdmins(){
            this.getRequest("/system/admin/?keyWords="+this.keyWords).then(resp=>{
               if(resp){
                this.admins=resp
               }
            })
        },
         showPop(admin) {
            this.initAllRoles()
            let roles = admin.roles // 拿到整个数组
            this.selectedRoles = []
            roles.forEach(r => {
                this.selectedRoles.push(r.id) // r.id 相同的角色放进数组
            })
    },
     // 25、更新操作员角色
    hidePop(admin) {
      let roles = []
      Object.assign(roles, admin.roles) // 拷贝对象
      let flag = false
      // 如果选中的角色 id 的长度和原来的不一样
      if (roles.length != this.selectedRoles.length) { // 用户对应角色id
        flag = true
      } else {
        // 角色 id 长度和原来的一样，但可能角色不一样
        // 先循环 admin.roles
        for (let i = 0; i < roles.length; i++) {
          let role = roles[i] // 用户对应的角色对象
          for (let j = 0; j < this.selectedRoles.length; j++) {
            let sr = this.selectedRoles[j]  // 拿到用户对应的角色对象的id
            if (role.id == sr) { // 角色一样
              roles.splice(i, 1) // 删除
              i--
              break
            }
          }
        }
        if (roles.length != 0) {
          flag = true
        }
      }
      if (flag) {
        // 拼接 url(参数为 adminId、角色 rids )
        let url = '/system/admin/roles?adminId=' + admin.id;
        this.selectedRoles.forEach(sr => {
          url += '&rids=' + sr
        });
        this.putRequest(url).then(resp => {
          if (resp) {
            this.initAdmins()
          }
        });
      }
    },
        initAllRoles() {
        this.getRequest(' /system/admin/roles').then(resp => {
            if (resp) {
            this.allRoles = resp
            }
        })
    },
    },
     
}
</script>
<style scoped>
    .headerSearch{
      justify-content: center;  
      display: flex;
    }
    .headerSearch .el-input{
        width:450px;
        margin-right: 10px;
    }
    .el-card{
        width: 350px;
        margin-top: 15px;
       
    }
    .cardPerson{
        display: flex;   
         justify-content: space-around;
         flex-wrap: wrap;
         
     
    }
    .fontadmin{
        font-size: 12px;
        color: rgb(125, 179, 216);
        
    }
</style>