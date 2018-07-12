<template>
    <div class="container">
        <el-container>
            <el-aside width="200px">
                <LeftBanner></LeftBanner>
            </el-aside>
            <el-main>
                <div class="grid-content bg-purple">
                    <scene-picker
                        :scene-ids = "routerList"
                        :title = "title"
                        :isPreview = true>
                    </scene-picker>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import LeftBanner from "../components/LeftBanner"
    import scenePicker from "../components/scenePicker"
    export default{
        components:{
            LeftBanner,
            scenePicker
        },
        data(){
            return {
                routerList:[],
                title: "请选择要察看的场景id"
            }
        },
        created(){
            let $this = this
            let url = "/web/getAllScene"
            this.axios.get(url)
                .then(response=>{
                    $this.routerList = response.data.data
                })

        },
        methods:{

        }
    }
</script>
<style scoped>
    @import url("../common/css/layout.css");
</style>