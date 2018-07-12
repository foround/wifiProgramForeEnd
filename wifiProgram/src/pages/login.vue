
<template>
    <el-container>
        <div class="container">
            <el-form ref="form" class="form-container" :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">登陆</el-button>
                    <el-button>取消</el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            form:{
                name: '',
                password: ''
            }
        };
    },
    components: {},
    created(){},
    mounted(){},
    methods: {}
}

</script>
<style scoped>
    .el-container{
        width: 100%;
        height: 100%;
        background-image: url("../assets/images/background.jpg");
        display: flex;
        align-items:center;
        justify-content:center;
    }
    .form-container{
        padding: 20px;
        background-color: rgba(255,255,255,0.5);
        border-radius: 5px;
    }
</style>