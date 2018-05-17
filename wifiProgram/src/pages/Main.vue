<template>
    <div class="container">
        <el-container>
            <el-aside width='300px'>
                <LeftBanner></LeftBanner>
            </el-aside>
            <el-main>
                <div class="grid-content bg-purple">
                    <drawing></drawing>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import LeftBanner from "../components/LeftBanner"
    import drawing from "../components/drawing"
    export default{
        components:{
            LeftBanner,
            drawing
        }
    }
</script>
<style scoped>
    .container{
        width: 100%;
        height: 100%;
        background-image: url("../assets/images/background.jpg");
        background-size: 100% 100%;
    }
    .el-container{
        height: 100%;
    }
    .el-aside{
        overflow: hidden;

    }
</style>

