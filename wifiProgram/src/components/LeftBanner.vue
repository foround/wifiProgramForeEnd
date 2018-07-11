<template>
    <el-menu
      class='el-menu-container'
      background-color="#545c64aa"
      text-color="#fff"
      active-text-color="#ffd04b"
      :router="router"
    >
        <el-menu-item index="1" :route="routerDest.uploadScene">
            <i class="el-icon-picture"></i>
            上传场景图
        </el-menu-item>
        <el-submenu index="2">
            <template slot='title'>
                <i class="el-icon-menu"></i>
                <span slot="title">路由器操作</span>
            </template>
            <el-menu-item-group index="2">
                <el-menu-item index="2-1" :route="routerDest.uploadRouters">
                    <i class="el-icon-upload"></i>
                    上传路由器信息
                </el-menu-item>
                <el-menu-item index="2-2" :route="routerDest.modifyRouters">
                    <i class="el-icon-edit"></i>
                    修改路由器信息
                </el-menu-item>
                <el-menu-item index="2-3" :route="routerDest.previewRouters">
                    <i class="el-icon-news"></i>
                    查看路由器信息
                </el-menu-item>
            </el-menu-item-group>
        </el-submenu>
        <el-menu-item index="3">退出登录</el-menu-item>
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
            router: true,
            routerDest: {
                uploadScene:{
                    name: "main",
                    path: "/"
                },
                uploadRouters:{
                    name: "routerUpload",
                    path: "/routerUpload"
                },
                modifyRouters:{
                    name: "routerModified",
                    path: "/routerModified"
                },
                previewRouters:{
                    name: "main",
                    path: "/"
                },
                
            }
         }
     }
}
</script>

