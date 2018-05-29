<template>
		<div>
			<div class="form-wrapper common-style" v-if="isUploadedImage">
				<el-form :model="sceneImageSize" ref="sceneImageSizeForm" :inline='true' :rules="imageSizeRules" label-width="100px">
					<el-form-item label="长度" prop="length">
						<el-input v-model.number="sceneImageSize.length"></el-input>
					</el-form-item>
					<el-form-item label="宽度" prop="width">
						<el-input v-model.number="sceneImageSize.width"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="submitForm('sceneImageSizeForm')">提交</el-button>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="triggerUpload">重新上传</el-button>
					</el-form-item>
				</el-form>
			</div>
			<input type="file" v-on:change="showUploadMsg" ref="uploadElem"/>
			<div class="upload-image-button common-style" v-on:click="triggerUpload" v-if="!isUploadedImage">
				<p>请选择要上传的图片</p>
			</div>
			<div class="upload-image-preview common-style" ref="uploadImagePreview">
			</div>
		</div>
</template>
<script>
import * as constant from "@/utils/constant";
import Bus from "@/common/js/bus"
export default {
	name: "uploadFile",
	data() {
		return {
			msg: "welcome To Hotal Califoria",
			isUploadedImage: false,
			uploadText: "上传图片",
			uploadMapImage: {},
			uploadImageWidth: 1000,
			sceneImageSize:{
				length: '',
				width: ''
			},
			imageSizeRules:{
				length:[
					{required:true,message: "请输入场景图长度",trigger:'blur'},
					{type:"number",message: "必须为数字", trigger:'blur'}
				],
				width:[
					{required: true, message: '请输入场景图宽度', trigger:'blur'},
					{type:"number", message: '必须为数字', trigger: 'blur'}
				]
			}
		};
	},
	mounted() {
	},
	watch: {},
	methods: {
		triggerUpload() {
			console.log("触发图片上传");
			let uploadElem = this.$refs.uploadElem;
			//触发文件域点击事件
			uploadElem.click();
		},
		//当文件域被改变(有上传的图片时),将图片渲染到canvas上
		showUploadMsg(e) {
			let $this = this;
			console.log("展示图片上传信息");
			let imageFile = this.$refs.uploadElem.files[0];
			this.imageFile = imageFile
			const reader = new FileReader();
			try {
				reader.readAsDataURL(imageFile);
				//图片信息读取后执行的操作
				reader.onload = function(event) {
					console.log("读取图片成功");
					let imageData = event.target.result;
					let image = new Image();
					image.src = imageData;
					image.style = `width: ${$this.uploadImageWidth}px`
					image.onload = function() {
						let uploadMapImage = {
							image: image,
							imageWidth: image.width,
							imageHeight: image.height
						};
						$this.uploadMapImage = uploadMapImage;
						$this.isUploadedImage = true;
						//将图片渲染到到页面上
						let uploadImagePreview = $this.$refs.uploadImagePreview;
						let oldImage = document.querySelector(".upload-image-preview>img")
						console.log(oldImage)
						if(oldImage != null)
							uploadImagePreview.removeChild(oldImage)
						uploadImagePreview.appendChild(image)
					};
				};
			} catch (e) {
				console.log("上传图片出错");
			}
		},
		//提交图片
		submitForm(formName){
			this.$refs[formName].validate((valid)=>{
				if(valid){
					console.log('验证通过')
					let length = this.sceneImageSize.length,
						width = this.sceneImageSize.width;
					let param = new FormData();
					// Bus.$emit('getTarget',length)
					// 
					param.append("placeMap",this.imageFile);
					param.append("mapLength",length)
					param.append("mapWidth",width)
					let config = {
						header:{'Content-Type':'multipart/form-data'}
					}
					console.log(this.imageFile)
					console.log(param.get('placeMap'))
					let url = 'http://[2001:da8:215:3c01::a85e]:3389/web/upload'
					this.axios.post(url,param,config)
					.then((response)=>{
						this.$message({
							message: '图片上传成功',
							type: 'success',
							showClose: true
						})
						console.log(response.data.data)
						let filePath = response.data.data.filePath
						let placeId = response.data.data.id
						let placeInfo = {
							filePath: filePath,
							placeId: placeId
						}
						Bus.$emit('placeInfo',placeInfo)
						this.$router.push({
							path: '/marker'
						})
					}).catch((error)=>{
						console.log(error)
					})
				}else{
					console.log('表单信息不合法')
				}
			})
		}
	}
};
</script>

<style scoped>
	input[type="file"] {
		display: none;
	}
	.upload-image-container {
		margin-bottom: 20px;
	}
	.common-style{
		position: relative;
		left: 50%;
		transform: translateX(-50%);
	}
	.upload-image-button{
		width: 800px;
		height: 500px;
		background-color: rgba(255, 255, 255, 0.5);
	}
	.upload-image-button p{
		text-align: center;
		font-size: 32px;
		padding-top: 100px;
	}
	.button-group {
		margin-top: 50px;
		margin-bottom: 50px;
		text-align: left;
	}
	.demonstration {
		color: white;
		font-size: 18px;
	}
	.preview-image{
		width: 	100px;
	}
	.el-input {
		width: 150px;
	}
	.el-form-item__label{
		color: #fff !important;
	}
	.form-wrapper{
		width: 800px;
		background-color: rgba(255, 255, 255, 0.5);
		margin-top: 30px;
		margin-bottom: 30px;
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		padding: 30px;
		border-radius: 10px;
	}
</style>
