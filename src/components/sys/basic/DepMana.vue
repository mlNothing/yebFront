<template>
  <div class="depsLeft">
    <el-input
      placeholder="输入部门"
      prefix-icon="el-icon-search"
      v-model="filterText"
    ></el-input>
    <el-tree
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            class="btn"
            type="primary"
            size="mini"
            @click="() => addDep(data)"
          >
            添加部门
          </el-button>
          <el-button
            class="btn"
            type="danger"
            size="mini"
            @click="() => deleteDep(data)"
          >
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog title="添加部門" :visible.sync="dialogVisible" width="30%">
      <table >
        <tr>
            <el-tag>上級部門</el-tag>
             <td>{{pname}}</td>
        </tr>
        <tr>
            <el-tag>添加部門</el-tag>
            <td><el-input v-model="dep.name" placeholder="請輸入部門名稱。。。" ></el-input></td>
        </tr>
      </table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doaddDep()">确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      filterText: "",
      deps: [],
      dialogVisible: false,
      defaultProps: {
        children: "children",
        label: "name",
      },
      dep:{
          parentId:-1,
          name:''
      },
      pname:'',
    };
  },
  watch: {
    filterText(val) {
      //   监控输入框值的变化
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    filterNode(value, data) {
      // 值如果没有，全部节点展示
      if (!value) return true;
      // 如果有值，是不是包含这个值
      return data.name.indexOf(value) !== -1;
    },
    initDeps() {
      this.getRequest("/system/basic/department/").then((resp) => {
        if (resp) {
          this.deps = resp;
        }
      });
    },
    addDep(data) {
        this.dep.parentId=data.id;
        this.pname=data.name
      this.dialogVisible = true;
    },
    removeDep(p,deps,id){
        for(let i =0 ;i<deps.length;i++){
          let d=deps[i];
          if(d.id==id){
            deps.splice(i,1);
            if(deps.length==0){
              p.isParent=false;
            }
            return;
          }else{
            this.removeDep(d,d.children,id)
          }
        }
    },
    deleteDep(data){
      if(data.isParent){
        this.$message.error("父部门删除失败")
      }else{
          this.$confirm('此操作将永久删除【'+data.name+'】部门,是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/system/basic/department/'+data.id).then(()=>{
                          this.removeDep(null,this.deps,data.id);   
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
                })
               }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
                })
      }
            
    },
    addDep2Deps(deps,dep){
      for(let i=0 ;i<deps.length;i++){
        let d=deps[i];
        if(d.id==dep.parentId){
          d.children=d.children.concat(dep);
          if(d.children.length>0){
            d.isParent=true;
          }
          return;
        }else{
          this.addDep2Deps(d.children,dep);
        }
      }
    },
    initDep(){
       this.dep={
          parentId:-1,
          name:''
      },
      this.pname=''
    },
    doaddDep(){
        this.postRequest("/system/basic/department/",this.dep).then((resp)=>{
            this.addDep2Deps(this.deps,resp.obj);
                        this.dialogVisible = false;

            this.initDep();

        })
    },
  },
  mounted() {
    this.initDeps();
  },
};
</script>
<style scoped>
.depsLeft {
  width: 500px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.btn {
  height: 20px;
  justify-content: center;
  text-align: center;
  margin: 5px;
}
</style>