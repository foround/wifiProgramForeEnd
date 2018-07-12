
<template>
    <div class="container">
        <section>
            基本信息：场景长度{{mapLength}}m，场景宽度{{mapWidth}}m
        </section>
        <el-table
        :data="routerList"
        class="table-exhibiton"
        :cell-style="{textAlign:left}" >
            <el-table-column
                prop="id"
                label="id"
                width="180">
            </el-table-column>
            <el-table-column
                prop="ssId"
                label="ssId"
                width="180">
            </el-table-column>
            <el-table-column
                prop="x"
                label="x坐标"
                width="180">
            </el-table-column>
            <el-table-column
                prop="y"
                label="y坐标"
                width="180">
            </el-table-column>
        </el-table>
    </div>
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
        console.log('aa')
        let $this = this;
        console.log('aa')
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
.table-exhibiton{
    margin: 0 auto;
    width: 40%;
}
</style>