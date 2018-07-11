<template>
	<el-dialog :title="title" :visible.sync="dialogFormVisible" :show-close="false">
		<el-form>
			<el-form-item label="场景id" :label-width="formLabelWidth">
				<el-select v-model="value" placeholder="请选择活动区域">
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
		<div slot="footer" class="dialog-footer">
			<el-button @click="cancel">取 消</el-button>
			<el-button type="primary" @click="confirm">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
export default {
    data() {
        return {
            options: [],
            value: null,
			formLabelWidth: '120px',
			dialogFormVisible: true,
        };
	},
	methods:{
		confirm(){
			if(this.value== null){
				this.$message({
					message: '请选择场景id',
					type: 'warning'
				});
			}else{
				this.dialogFormVisible = false
				this.$router.push({
					path: "/routerEdit",
					query: {
						placeId: this.value
					}
				})
			}
		},
		cancel(){
			this.dialogFormVisible = false
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
	props:['sceneIds','title']
};
</script>
<style scoped>
</style>