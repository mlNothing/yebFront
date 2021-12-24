<template>
    <div>
        <div>
        <el-input size="small" v-model="jl.name" style="width:300px" prefix-icon="el-icon-plus" placeholder="添加职称"></el-input>
        <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small" style="margin-left:6px;margin-right:6px">
            <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="addJobLevel">添加</el-button>
        </div>
        <div style="margin-top:10px">
                <el-table :data="jls" border stripe size="small" @selection-change="handleSelectionChange" style="width:70%">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="id" label="编号" width="55"></el-table-column>
                    <el-table-column prop="name" label="职称名称" width="120"></el-table-column>
                    <el-table-column prop="createDate" label="创建时间" width="125"></el-table-column>
                    <el-table-column prop="enabled" label="是否启用" width="150">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
                                <el-tag v-else type="danger">未启用</el-tag>
                            </template>
                    </el-table-column>
                    <el-table-column >
                        <template slot-scope="scope">
                            <el-button  @click="showEditView(scope.$index,scope.row)">编辑</el-button>
                            <el-button size="mini" @click="handleDelete(scope.$index,scope.row)" type="danger">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button type="danger" size="small" style="margin-top:10px" :disabled="multipleSelection.length==0"
                @click="deleteMany"
                >批量删除</el-button>
        </div>
                <el-dialog title="编辑职称" :visible.sync="dialogVisible" width="30%">
                        <div>
                            <table>
                                <tr>
                                    <td><el-tag>职称名</el-tag></td>
                                    <td><input v-model="updateJl.name" size="small"></td>
                                </tr>
                                <tr>
                                    <td><el-tag>职称级别</el-tag></td>
                                    <td><el-select v-model="updateJl.titleLevel" size="small" placeholder="职称等级"  style="margin-left:6px;margin-right:6px">
                                        <el-option v-for="item in titleLevels" :key="item" :label="item" :value="item"> </el-option>
                                         </el-select> </td>
                                </tr>
                                <tr>
                                <td><el-tag>是否启用</el-tag></td>
                                <td>
                                    <el-switch v-model="updateJl.enabled" active-color="#13ce66" inactive-color="#ff4949"  active-text="启用" inactive-text="禁用"></el-switch>
                                </td>
                            </tr>
                            </table>
                        </div>
                        <span slot="footer" class="dialog-footer">
                        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                        <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
                </span>
                </el-dialog>
    </div>
</template>
<script>
    export default{
        name:'Joblevel',
        data(){
            return{
                jl:{
                    name:'',
                    titleLevel:''
                },
                updateJl:{
                    name:'',
                    titleLevel:'',
                    enabled: false
                },
                 jls:[],
                titleLevels:[
                    '正高级',
                    '副高级',
                    '中级',
                    '初级',
                    '员级',
               ],
               multipleSelection: [],
                jls: [],
                 dialogVisible: false
            }
        },
        mounted(){
             this.initJls();
        },
        methods:{
            handleSelectionChange(val){
                this.multipleSelection=val;
            },
            addJobLevel(){
                if(this.jl.name && this.jl.titleLevel){
                    this.postRequest('/system/basic/jobLevel/',this.jl).then((resp)=>{
                        this.initJls();
                    }  )
                }else{
                    this.$message.error("字段不可以为空")
                }
            },
            handleDelete(indexs,data){
                this.$confirm('此操作将永久删除【'+data.name+'】职称,是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }).then(()=>{
                    this.deleteRequest('/system/basic/jobLevel/'+data.id).then(resp=>{
                        if(resp){
                            this.initJls();
                        }
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                   });
               });
                })
            },
            deleteMany(){
                this.$confirm('此操作将永久删除【'+this.multipleSelection.length+'】条记录，是否继续？','提示',{
                    confirmButtonText:'确定',
                    cancelButtonText:'取消',
                    type:'warning'
                }). then(()=>{
                    let ids='?';
                    this.multipleSelection.forEach(item=>{
                        ids+='ids='+item.id+'&';
                    })
                    this.deleteRequest('/system/basic/jobLevel/'+ids).then(resp=>{
                        if(resp){
                            this.initJls();
                        }
                    })
                }
                )

            },
            showEditView(indexs,data){
                Object.assign(this.updateJl, data);
                this.updateJl.createDate = '';
                this.dialogVisible=true;
            },
            doUpdate(){
                this.putRequest('/system/basic/jobLevel/',this.updateJl).then(resp=>{
                    if(resp){
                        this.initJls();
                        this.dialogVisible = false;
                    }
                })
            },
            initJls(){
              this.getRequest('/system/basic/jobLevel/').then(resp=>{
                  if(resp){
                      this.jls = resp;
                        this.jl = {
                            name: '',
                            titleLevel: ''
                       }
                  }
              })
            }
        }
    }
</script>