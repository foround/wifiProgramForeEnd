<template>
    <div class="container">
        <el-container>
            <el-aside width="200px">
                <LeftBanner></LeftBanner>
            </el-aside>
            <el-container>
                <el-header>
                    <h1>
                        场景路由器信息编辑
			            <el-tag>场景ID:{{placeId}}</el-tag>
                    </h1>
                </el-header>
                <el-main>
                    <div class="grid-content bg-purple">
                        <routerHandler :place-id="placeId"></routerHandler>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import LeftBanner from "../components/LeftBanner"
    import routerHandler from "../components/routerHandler"
    export default{
        components:{
            LeftBanner,
            routerHandler
        },
        data(){
            return {
            }
        },
        beforeCreate() {
            this.placeId = this.$route.query.placeId;
        },
        created(){

        },
        methods:{

        },
    }
</script>
<style scoped>
    @import url("../common/css/layout.css");
    header{
        margin-top: 50px;
    }
</style>

