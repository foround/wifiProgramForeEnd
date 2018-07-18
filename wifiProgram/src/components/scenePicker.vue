<template>
	<section class='picker-container'>
		<header>{{title}}</header>
		<el-form>
			<el-form-item label="场景id" :label-width="formLabelWidth">
				<el-select v-model="value" placeholder="请选择场景id">
					<el-option 
						v-for="item in options"
						:key="item.value"
						:value="item.value"
						:label="item.label"
						>
					</el-option>
				</el-select>
			</el-form-item>
		</el-form>
		<div class="footer">
			<el-button @click="cancel">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</div>
	</section>
</template>

<script>
import * as constant from "@/utils/constant";
const keywordsList = ["查看","修改","上传"]
export default {
    data() {
        return {
            options: [],
            value: null,
			formLabelWidth: '120px',
        };
	},
	props:['sceneIds','sceneType'],
	methods:{
		confirm(){
			if(this.value== null){
				this.$message({
					message: '请选择场景id',
					type: 'warning'
				});
			}else{
				this.$router.push({
					path: "/routerEdit",
					query: {
						placeId: this.value,
						isPreview: this.sceneType == constant.PREVIEW? true: false
					}
				})
			}
		},
		cancel(){
			this.$router.go(-1)
		}
	},
	watch: { 
		sceneIds(newValue, oldValue) {
			let sceneIds = newValue
			console.log(`sceneIds is ${sceneIds}`)
			let options = sceneIds.map((id)=>{
				return {
					value: id,
					label: `场景${id}`
				}
			})
			console.log(options)
			this.options = options
		}
	},
	computed:{
		title(){
			let keyword = keywordsList[this.sceneType]
			return `请选择要${keyword}的场景id`
		}
	}
};
</script>
<style scoped>
	.picker-container{
		width: 60%;
		padding: 5% 10%;
		box-sizing: border-box;
		margin: 30px auto;
		background-color: rgba(0,0,0,0.2);
		border-radius: 10px;
	}
	header{
		font-size: 20px;
	}
	.el-form{
		margin-top: 50px;
	}
	.footer{
		display: flex;
		justify-content: space-around;
	}
</style>