<template>
    <div>
        <el-container>
            <el-header class="homeHeader">
                <div class="title">mlNothing系统</div>
            </el-header>
            <el-container>
                <el-aside width="200px">

                    <!-- select :菜单激活回调 index :选中菜单项的index  indexPath:选中菜单项以及所属父菜单项的index 
                    渲染路由 router:是否使用vue-router的模式，启用改模式会在激活导航时以index作为path进行路由跳转 我们可以取消之前的select事件
                    -->
                    <el-menu router  unique-opened >
                      <!-- <el-submenu :index="index+''" v-for="(item,index) in routes" v-if="!item.hidden"  :key="index"  > -->
                       <el-submenu :index="index+''" v-for="(item,index) in routes"   :key="index"  >
                            <template slot="title">
                                <i style="color: #1accff;margin-right: 5px" :class="item.iconCls"></i>
                                <span>{{item.name}}</span>
                            </template>
                            <el-menu-item :index="children.path" v-for="(children,indexj) in item.children" :key="indexj">{{children.name}}</el-menu-item>
                        </el-submenu>
                    </el-menu>
                </el-aside>
                <el-main>
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: 'Home',
       computed:{
           routes(){
               return this.$store.state.routes;
           }
       }
       
   }
</script>
<style>
    
</style>