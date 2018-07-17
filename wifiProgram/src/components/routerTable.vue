
<template>
    <el-row class="container">
        <el-col :span="4" :offset="2">
            <el-card>
                <div slot="header" class="clearfix">
                    <span>场景基本信息</span>
                </div>
                <div class="basic-card-info">
                    <p>长度{{mapLength}}m</p>
                    <p>宽度{{mapWidth}}m</p>
                </div>
            </el-card>
        </el-col>
        <el-col :span="12" :offset="1">
            <el-card class="table-card" >
                <div slot="header" class="clearfix">
                    <span>场景详细信息</span>
                </div>
                <div>
                    <el-table
                    :data="routerList"
                    class="table-exhibiton" align="center" header-align="left">
                        <el-table-column
                            prop="id"
                            label="id"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="ssId"
                            label="ssId"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="x"
                            label="x坐标"
                            >
                        </el-table-column>
                        <el-table-column
                            prop="y"
                            label="y坐标"
                            >
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data () {
        return {
            routerList:[]
        };
    },
    components: {},
    created(){
        let $this = this;
        let url = `/web/getSceneInfo/${this.placeId}`
        this.axios
            .get(url)
            .then(response => {
                let res = response.data.data;
                console.log(response.data.data.routerSet)
                console.log(res)
                $this.mapLength = res.mapLength
                $this.mapWidth = res.mapWidth
                $this.routerList = response.data.data.routerSet
            })
    },
    props:['placeId'],
    mounted(){
        console.log(this.routerList)
    },
    watch:{

    },
    methods: {}
}

</script>
<style scoped>
.container{
    display: flex;
}
.el-card{
    min-height: 200px;
}
.table-exhibiton{
    margin: 0 auto;
}
.basic-card-info{
    display: flex;
    flex-direction: column;
    align-items: stretch

}
</style>