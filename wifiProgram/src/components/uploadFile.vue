<template>
    <div>
        <section class="upload-image-container">
            <el-button type="primary" v-on:click="triggerUpload">{{uploadText}}</el-button>
            <input type="file" v-on:change="showUploadMsg" ref="uploadElem"/>
        </section>
        <div class="upload-image-preview" ref="uploadImagePreview">
            
        </div>
				
    </div>
    
</template>
<script>
import * as constant from "@/utils/constant";
export default {
  name: "uploadFile",
  data() {
    return {
      msg: "welcome To Hotal Califoria",
      isUploadedImage: false,
      uploadText: "上传图片",
      uploadMapImage:{},
    };
  },
  mounted() {
    this.initZRender();
  },
  watch: {
  },
  methods: {
    initZRender() {
      const zr = zrender.init(this.$refs.myZrender);
      this.zr = zr;
    },
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
        const reader = new FileReader();
        try {
            reader.readAsDataURL(imageFile);
            //图片信息读取后执行的操作
            reader.onload = function(event) {
                console.log("读取图片成功");
                let imageData = event.target.result;
                let image = new Image();
                image.src = imageData;
                image.onload = function() {
                    let uploadMapImage = {
                        image: image,
                        imageWidth: image.width,
                        imageHeight: image.height
                    };
                    $this.uploadMapImage = uploadMapImage;
                    $this.isUploadedImage = true;
                    //jiangtupianxuanrandaoyemianshang
                    let uploadImagePreview = $this.$refs.uploadImagePreview
                    uploadImagePreview.appendChild(image)
                };
            };
        } catch (e) {
            console.log("上传图片出错");
        }
    }
  }
}
</script>

<style scoped>
input[type="file"] {
  display: none;
}
section {
  width: 100%;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-align: left;
}
.upload-image-container {
  margin-bottom: 20px;
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
.el-input{
		width: 150px;
}
</style>
