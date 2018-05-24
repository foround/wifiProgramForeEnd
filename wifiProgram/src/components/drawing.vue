<template>
    <div>
        <section class="scaleChangeArea">
            <el-button type="primary" v-on:click="triggerUpload">{{uploadText}}</el-button>
            <input type="file" v-on:change="showUploadMsg" ref="uploadElem"/>
            <span class="demonstration">改变画布比例</span>
            <el-button-group>
                <el-button type="success" icon="el-icon-plus" v-on:click="changeCanvasScale(true)"></el-button>
                <el-button type="warning" icon="el-icon-minus" v-on:click="changeCanvasScale(false)"></el-button>
            </el-button-group>
        </section>
        <div class="canvasWrapper">
            <canvas ref="myZrender" class='myZrender' :width="canvasWidth" :height="canvasHeight" v-on:click="handlePoint"></canvas>
        </div>
        <section class="markerWrapper">
            <el-button type="primary" @click='addMarker'>增加标记</el-button>
            <el-button type="success" @click='removeMarker'>删除标记</el-button>
            <span class="demonstration">请输入平面图宽度：</span>
						<el-input v-model="mapWidthInput" placeholder="请输入平面图宽度"></el-input>
            <el-button type="success" @click='getMapWidth'>确定</el-button>
        </section>

        <!-- <el-dialog title="输入平面图的长宽" :visible="dialogFormVisible" :close="closeDialogue()">
          <el-form :inline='true' class="demo-form-inline" ref="numberValidateForm">
						<el-form-item label="平面图长度(m)">
              <el-input auto-complete="off" v-model="mapActuWidth"></el-input>
            </el-form-item>
						<el-form-item label="平面图宽度(m)">
              <el-input auto-complete="off" v-model="mapActuHeight"></el-input>
            </el-form-item>
          </el-form>
					<div v-if="!isFormValid">{{errMsg}}</div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeDialogue()">取 消</el-button>
            <el-button type="primary" @click="submitForm()">确 定</el-button>
          </div>
        </el-dialog> -->
				
    </div>
    
</template>
<script>
import zrender from "zrender";
import * as constant from "@/utils/constant";
export default {
  name: "drawing",
  data() {
    return {
      msg: "welcome To Hotal Califoria",
      zr: null,
      canvasWidth: 600,
      canvasHeight: 400,
      scale: 2,
      isUploadedImage: false,
      illegalChangeScale: true,
      uploadText: "上传图片",
      canvasMode: constant.DEFAULT,
			markerList: [],
			//填写地图长宽的有关变量
      dialogFormVisible: true,
      mapActuWidth: null,
      mapActuHeight: null,
			errMsg: "",
			isFormValid: true,
			mapWidthInput:""
    };
  },
  mounted() {
    this.initZRender();
  },
  watch: {
    isUploadedImage: function(newValue, oldValue) {
      if (newValue == true) {
        this.illegalChangeScale = false;
        this.uploadText = "重新上传图片";
      }
		},
		isUploadedImage: function(newValue, oldValue) {
			let imageWidth = this.mapImageInfo.imageWidth,
					imageHeight = this.mapImageInfo.imageHeight
			this.mapActuHeight = newValue*(imageHeight/imageWidth)
		}
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
            let mapImageInfo = {
              image: image,
              imageWidth: image.width,
              imageHeight: image.height
            };
						$this.mapImageInfo = mapImageInfo;
						$this.isUploadedImage = true;
						//删除之前的标记
						$this.clearAllMarker()
						//将上传的背景图渲染到canvas上
						$this.renderCanvasMapImage();
          };
        };
      } catch (e) {
        console.log("上传图片出错");
      }
		},
		// //验证地图长宽信息
		// submitForm(){
		// 	let mapActuWidth = this.mapActuWidth
		// 	let mapActuHeight = this.mapActuHeight
		// 	let imageWidth = this.mapImageInfo.imageWidth
		// 	let imageHeight = this.mapImageInfo.imageHeight
		// 	let errMsg = ''
		// 	let isValid = false
		// 	if(isNaN(mapActuWidth)||isNaN(mapActuHeight)){
		// 		errMsg = '长宽信息输入不符合规范'
		// 	}else{
		// 		if(Math.abs(mapActuWidth/mapActuHeight - imageWidth/imageHeight) > constant.MIN_DECIMAL){
		// 			errMsg = '长宽信息之比不符合规范'
		// 		}else{
		// 			isValid = true
		// 			//将背景图渲染到canvas上
		// 			this.dialogFormVisible = false
					
		// 		}
		// 	}
		// 	this.errMsg = errMsg;
		// 	this.isFormValid = isValid
		// },
		// //关闭对话框
		// //清空表单信息以及图片信息
		// closeDialogue(){
		// 	this.mapActuWidth = null
		// 	this.mapActuHeight = null
		// 	this.mapImageInfo = null
		// },
    //增加标记
    addMarker() {
      if (this.isUploadedImage == true) {
        this.canvasMode = constant.ADD_MARKER;
      }
    },
    //删除标记
    removeMarker() {
      if (this.isUploadedImage == true) {
        this.canvasMode = constant.REMOVE_MARKER;
      }
    },
    //渲染canvas背景
    renderCanvasMapImage() {
      let mapImageInfo = this.mapImageInfo;
      let scale = this.scale;
      let displayWidth = mapImageInfo.imageWidth / scale;
      let displayHeight = mapImageInfo.imageHeight / scale;
      //改变画布大小
      this.canvasWidth = displayWidth;
      this.canvasHeight = displayHeight;
      let zr = this.zr;
      //渲染地图背景
      let mapImage = new zrender.Image({
        style: {
          image: mapImageInfo.image,
          x: 0,
          y: 0,
          width: displayWidth,
          "height:": displayHeight
        }
      });
      this.mapImageElem = mapImage;
      zr.add(mapImage);
    },
    // 改变图片大小
    changeCanvasScale(isAddScale) {
      let scale = this.scale;
      let illegalChangeScale = this.illegalChangeScale;
      if (!illegalChangeScale) {
        if (isAddScale == true && scale > constant.MIN_SCALE) {
          scale--;
        } else {
          if (isAddScale == false && scale < constant.MAX_SCALE) {
            scale++;
          }
        }
        let mapImageInfo = this.mapImageInfo;
        this.scale = scale;

        let image = mapImageInfo.image;
        //设置画布大小
        let displayWidth = mapImageInfo.imageWidth / scale;
        let displayHeight = mapImageInfo.imageHeight / scale;
        //改变画布大小
        this.canvasWidth = displayWidth;
        this.canvasHeight = displayHeight;
        console.log(mapImageInfo);
        //改变背景图的尺寸
        let mapImageElem = this.mapImageElem;
        mapImageElem.attr({
          style: {
            width: displayWidth,
            "height:": displayHeight
          }
        });
        //改变标记的位置
        let markerList = this.markerList;
        for (let item of markerList) {
          let markerImage = item.markerImage;
          let markerX = item.x;
          let markerY = item.y;
          markerImage.attr({
            style: {
              x: markerX / scale,
              y: markerY / scale - constant.MARKER_SIZE
            }
          });
        }
      } else {
        console.log("非法改变图片大小");
      }
    },
    //标记点进行操作
    handlePoint(e) {
      let offsetX = e.offsetX;
      let offsetY = e.offsetY;
      let scale = this.scale;
      let markX = offsetX * scale;
      let markY = offsetY * scale;
      switch (this.canvasMode) {
        case constant.ADD_MARKER: {
          //标记的文本内容(x,y坐标)
          //增加标记
          let markerText = `(${markX},${markY})`
          let markerImage = new zrender.Image({
            style: {
              image: constant.MARKER_IMAGE,
              x: offsetX,
              y: offsetY - constant.MARKER_SIZE,
              width: constant.MARKER_SIZE,
              height: constant.MARKER_SIZE,
              text: markerText,
              fontSize: "8px",
              textPosition: "bottom",
              textWidth: "50px",
              textHeight: "10px",
              textBackgroundColor: "rgba(0,0,0,0.8)",
              textFill: "white"

            },
            z: 1
          });
          let markerInfo = {
            x: markX,
            y: markY,
            markerId: markerImage.id,
            markerImage: markerImage
          };
          this.markerList.push(markerInfo);
          //console.log(markerInfo)
          this.zr.add(markerImage);
          break;
        }
        //删除标记
        case constant.REMOVE_MARKER: {
          let markerList = this.markerList;
          for (let [index, item] of markerList.entries()) {
            let markerX = item.x;
            let markerY = item.y;

            //判断是否处在路由器标记点击的范围内
            let xDeviation = markerX / scale - offsetX
            let yDeviation = markerY / scale - offsetY
            let xInRouterRange = xDeviation > -constant.MARKER_SIZE && xDeviation < constant.MOUSE_DEVIATION
            let yInRouterRange = yDeviation < constant.MARKER_SIZE && xDeviation < constant.MOUSE_DEVIATION
            if (xInRouterRange && yInRouterRange) {
              this.zr.remove(item.markerImage);
              markerList.splice(index, 1);
            }
          }
          this.markerList = markerList;
          break;
        }
      }
    },
    //删除所有标记
    clearAllMarker(){
      let markerList = this.markerList
      for (let item of markerList) {
        this.zr.remove(item.markerImage);
      }
      this.markerList = [];
		},
		//得到地图宽度
		getMapWidth(){
			if(this.isUploadedImage){
				if(Number.isNaN(this.mapWidthInput)){
					alert('数据错误')
				}else{
					let imageWidth = this.mapImageInfo.imageWidth
					let imageHeight = this.mapImageInfo.imageHeight
					this.mapActuWidth = this.mapWidthInput
					this.mapActuHeight = this.mapWidthInput/imageWidth * imageHeight
				}
			}
		}
  }
};
</script>

<style scoped>
.canvasWrapper {
  width: 100%;
  height: 800px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.5);
  position: relative;
}
.myZrender {
  border: 1px solid #fff;
  position: absolute;
  left: 0;
  top: 0;
}
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
.scaleChangeArea {
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
.markerWrapper {
  margin-top: 20px;
}
.markerTable{
    width: 360px;
    margin-top: 20px;
}
.el-input{
		width: 150px;
}
</style>
