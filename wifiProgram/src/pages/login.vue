
<template>
    <el-container>
        <div class="container">
            <el-form ref="form" class="form-container" :model="form" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="form.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="login">登陆</el-button>
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
                username: '',
                password: ''
            }
        };
    },
    components: {},
    created(){},
    methods: {
        login(){
            let $this = this
            let username = this.form.username,
                password = this.form.password
            let params = {
                username: username,
                password: password
            }
            let config = {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            this.axios.post('/login',params,config)
                .then((response)=>{
                    if(response.data.errcode == 0){
                        console.log(`origin role is ${response.data.data.role}`)
                        window.role = response.data.data.role
                        $this.$router.replace("/")
                    }
                })
        }
    }
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