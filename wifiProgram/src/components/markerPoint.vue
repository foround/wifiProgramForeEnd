<template>
    <div>
        <section class="scaleChangeArea">
            <span class="demonstration">改变画布比例</span>
            <el-button-group>
                <el-button type="success" icon="el-icon-plus" v-on:click="changeCanvasScale(true)"></el-button>
                <el-button type="warning" icon="el-icon-minus" v-on:click="changeCanvasScale(false)"></el-button>
            </el-button-group>
            <el-button type="primary" @click='addMarker'>增加标记</el-button>
            <el-button type="success" @click='removeMarker'>删除标记</el-button>
        </section>
        <div class="canvasWrapper">
            <canvas ref="myZrender" class='myZrender' :width="canvasWidth" :height="canvasHeight" v-on:click="handlePoint"></canvas>
        </div>
		<section class="upload-marker-info">
			<el-button @click="uploadMarkerInfo" :disabled="isUploaded">上传Marker信息</el-button>
		</section>
    </div>
</template>
<script>
import zrender from "zrender";
import * as constant from "@/utils/constant";
import Bus from "@/common/js/bus"
export default {
    name: "markerPoint",
    data() {
        return {
            msg: "welcome To Hotal Califoria",
            zr: null,
            canvasWidth: 600,
            canvasHeight: 400,
            scale: 2,
            canvasMode: constant.DEFAULT,
			routerList: [],
			mapImagePath: "",
			mapImageInfo:{
				imageElem: "",
				width: 0,
				height: 0
			},
			canvasWidth: 0,
			canvasHeight: 0,
			//是否已上传标记信息的标记为
			isUploaded: false
        };
    },
    mounted() {
        this.initZRender();
		this.renderCanvasMapImage();
		Bus.$on("placeInfo",(target)=>{
			console.log(target)
			if(target == null){
				this.$router.push({
					path: '/'
				})
			}
			console.log(`placeId is ${target.placeId}`)
			//测试用
			this.mapImagePath = target.imageData
			this.placeId = target.placeId
			//获取已经有的标记信息
			let $this = this
			let url = '/web/routerList/'+this.placeId
			this.axios.get(url)
			.then((response)=>{
				let rawRouterList = response.data.data
				$this.rawRouterList = rawRouterList
			})
			this.renderCanvasMapImage();
		})
    },
    methods: {
        initZRender() {
            const zr = zrender.init(this.$refs.myZrender);
            this.zr = zr;
        },
        //渲染canvas背景
        renderCanvasMapImage() {
            let $this = this
            let mapImagePath = this.mapImagePath;
            let imgElem = new Image()
            imgElem.src = mapImagePath;
            //判断是否还存了图片
            if (imgElem.complete == true) {
                let imgWidth = imgElem.width,
                    imgHeight = imgElem.height
                $this.renderCanvasAfterLoad(imgWidth, imgHeight)
            } else {
                imgElem.onload = function() {
                    let imgWidth = imgElem.width,
                        imgHeight = imgElem.height
                    $this.renderCanvasAfterLoad(imgWidth, imgHeight)
                }
            }
        },
        //在图片加载完成后渲染图片
        renderCanvasAfterLoad(imgWidth, imgHeight) {
			this.mapImageInfo.width = imgWidth
			this.mapImageInfo.height = imgHeight
            let scale = this.scale;
            let displayWidth = imgWidth / scale;
            let displayHeight = imgHeight / scale;
            //改变画布大小
            this.canvasWidth = displayWidth;
			this.canvasHeight = displayHeight;
            let zr = this.zr;
            //渲染地图背景
            let mapImage = new zrender.Image({
                style: {
                    image: this.mapImagePath,
                    x: 0,
                    y: 0,
                    width: displayWidth,
                    height: displayHeight
                }
            });
            this.mapImageInfo.mapImageElem = mapImage;
            zr.add(mapImage);
		},
		//上传标记信息
		uploadMarkerInfo(){
			let routerList = this.routerList
			let $this = this
			if(routerList.length == 0){
				this.$message({
					type: "warning",
					message: "请添加标记"
				})
			}else{
				let imgWidth = this.mapImageInfo.width
				let imgHeight = this.mapImageInfo.height
				let routerListInfo = routerList.map((item)=>{
					return {
						"x": item.x/imgWidth,
						"y": item.y/imgHeight,
						"ssId": item.ssid
					}
				})
				let param = {
					placeId: this.placeId,
					routerList: routerListInfo
				}
				let url = '/web/markers'
				let config = {
					header:{'Content-Type':'application/json'}
				}
				this.axios.post(url,param,config)
				.then((response)=>{
					$this.$message({
						type: "success",
						message: "上传标记列表成功"
					})
					$this.isUploaded = true
					console.log(response)
				}).catch((error)=>{
					console.log(error)
				})
			}
		},
        //增加标记
        addMarker() {
			this.canvasMode = constant.ADD_MARKER;
        },
        //删除标记
        removeMarker() {
			this.canvasMode = constant.REMOVE_MARKER;
        },
        // 改变图片大小
        changeCanvasScale(isAddScale) {
            let scale = this.scale;
			if (isAddScale == true && scale > constant.MIN_SCALE) {
				scale--;
			} else {
				if (isAddScale == false && scale < constant.MAX_SCALE) {
					scale++;
				}
			}

			this.scale = scale;
			let mapImageInfo = this.mapImageInfo
			let imageElem = mapImageInfo.imageElem;
			//设置画布大小
			let displayWidth = mapImageInfo.width / scale;
			let displayHeight = mapImageInfo.height / scale;
			//改变画布大小
			this.canvasWidth = displayWidth;
			this.canvasHeight = displayHeight;
			//改变背景图的尺寸
			let mapImageElem = mapImageInfo.mapImageElem;
			mapImageElem.attr({
				style: {
					width: displayWidth,
					height: displayHeight
				}
			});
			//改变标记的位置
			let routerList = this.routerList;
			for (let item of routerList) {
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
        },
        //标记点进行操作
        handlePoint(e) {
            let offsetX = e.offsetX;
            let offsetY = e.offsetY;
            let scale = this.scale;
            let markX = offsetX * scale;
            let markY = offsetY * scale;
            switch (this.canvasMode) {
                case constant.ADD_MARKER:
				{
					//标记的文本内容(x,y坐标)
					//增加标记
					//输入ssid
					this.$prompt('请输入SSID', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({ value }) => {
						let ssid = value
						let isValidSsid = true
						//确定ssid不可以重复，应该从后台得到已有的ssid列表
						for(let item of [...this.routerList,...this.rawRouterList]){
							if(ssid == item.ssid)
								isValidSsid = false
						}
						if(isValidSsid){
							let markerText = `(${markX},${markY})\nSSID:${ssid}`
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
									textFill: "white",
									draggable: true

								},
								z: 1
							});
							let markerInfo = {
								x: markX,
								y: markY,
								markerId: markerImage.id,
								markerImage: markerImage,
								ssid:ssid
							};
							this.routerList.push(markerInfo);
							this.zr.add(markerImage);
							this.$message({
								type: 'success',
								message: '路由器添加成功'
							});
						}else{
							this.$message({
								type: 'warning',
								message: '路由器SSID不得重复'
							});
						}
					}).catch((e) => {
						this.$message({
							type: 'info',
							message: '取消添加'
						});
					});
					break;
				}
				//删除标记
                case constant.REMOVE_MARKER:
				{
					let routerList = this.routerList;
					for (let [index, item] of routerList.entries()) {
						let markerX = item.x;
						let markerY = item.y;

						//判断是否处在路由器标记点击的范围内
						let xDeviation = markerX / scale - offsetX
						let yDeviation = markerY / scale - offsetY
						let xInRouterRange = xDeviation > -constant.MARKER_SIZE && xDeviation < constant.MOUSE_DEVIATION
						let yInRouterRange = yDeviation < constant.MARKER_SIZE && xDeviation < constant.MOUSE_DEVIATION
						if (xInRouterRange && yInRouterRange) {
							this.zr.remove(item.markerImage);
							routerList.splice(index, 1);
						}
					}
					this.routerList = routerList;
					break;
				}
            }
		},
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
