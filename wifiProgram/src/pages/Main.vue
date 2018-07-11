<template>
    <el-container class="container">
        <el-aside width="200px">
            <LeftBanner></LeftBanner>
        </el-aside>
        <el-main>
            <el-main>
                <div class="grid-content bg-purple">
                    <uploadFile></uploadFile>
                </div>
            </el-main>
        </el-main>
    </el-container>
</template>
<script>
    import LeftBanner from "../components/LeftBanner"
    import uploadFile from "../components/uploadFile"
    export default{
        components:{
            LeftBanner,
            uploadFile
        }
    }
    
</script>
<style scoped>
    @import url("../common/css/layout.css");
</style>

