<template>
    <div class="container">
        <el-container>
            <el-main>
                <div class="grid-content bg-purple">
                    <marker-point></marker-point>
                </div>
            </el-main>
        </el-container>
    </div>
</template>
<script>
    import markerPoint from "../components/markerPoint"
    export default{
        components:{
            markerPoint
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

