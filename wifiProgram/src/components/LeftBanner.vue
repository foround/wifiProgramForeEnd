<template>
    <el-menu
      class='el-menu-container'
      background-color="#545c64aa"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="router"
    >
        <el-menu-item index="1">上传图片</el-menu-item>
        <el-menu-item index="2">标记坐标</el-menu-item>
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

