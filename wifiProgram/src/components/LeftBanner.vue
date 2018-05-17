<template>
    <el-menu
      class='el-menu-container'
      background-color="#545c64aa"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="router"
    >
        <el-menu-item index="1">处理中心</el-menu-item>
        <el-submenu index="2">
            <template slot="title">我的工作台</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
            <template slot="title">选项4</template>
            <el-menu-item index="2-4-1">选项1</el-menu-item>
            <el-menu-item index="2-4-2">选项2</el-menu-item>
            <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
        </el-submenu>
        <el-menu-item index="3" disabled>消息中心</el-menu-item>
        <el-menu-item index="4">
            <a href="https://www.ele.me" target="_blank">订单管理</a>
        </el-menu-item>
    </el-menu>
</template>
<style>
    .el-menu-container{
        padding-top: 100px;
        height: 100%;
        overflow: hidden;
    }
</style>
<script>
export default {
     name: 'LeftBanner',
     data(){
         return {
             router: false
         }
     }
}
</script>

