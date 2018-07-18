<template>
    <div class="container">
        <el-container>
            <el-aside width="200px">
                <LeftBanner></LeftBanner>
            </el-aside>
            <el-container>
                <el-header>
                    <h1>
                        <span v-if="isPreview == false">场景路由器信息编辑</span>
                        <span v-else>场景路由器信息查看</span>
			            <el-tag>场景ID:{{placeId}}</el-tag>
                    </h1>
                </el-header>
                <el-main>
                    <section class="sliderContainer" v-if="isPreview != false">
                        <el-tag>
                            地图模式
                            <el-switch
                                v-model="isMapMode"
                                active-color="#56A2FF"
                                inactive-color="grey">
                            </el-switch>
                        </el-tag>
                    </section>

                    <div class="grid-content bg-purple">
                        <routerHandler :place-id="placeId" :isPreview="isPreview" v-if="isMapMode"></routerHandler>
                        <routerTable :place-id="placeId" v-if="!isMapMode"></routerTable>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
    import LeftBanner from "../components/LeftBanner"
    import routerHandler from "../components/routerHandler"
    import routerTable from "../components/routerTable"
    export default{
        components:{
            LeftBanner,
            routerHandler,
            routerTable
        },
        data(){
            return {
                isMapMode: true
            }
        },
        activated() {
            this.placeId = this.$route.query.placeId;
            this.isPreview = eval(this.$route.query.isPreview);
        },
        created(){
            this.placeId = this.$route.query.placeId;
            this.isPreview = eval(this.$route.query.isPreview);
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
    .sliderContainer{
        text-align: left;
        margin-bottom: 50px;
        margin-left: 10%;
    }
    .el-main{
        margin-left: 10%;
    }
</style>

