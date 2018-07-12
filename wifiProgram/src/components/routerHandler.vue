<template>
    <div class="main-container">
        <section class="scaleChangeArea">
			<div class="handlersWrapper">
				<el-row type="flex" class="row" justify="space-between">
					<el-col :span="6">
						<span class="demonstration">画布比例</span>
						<el-button-group>
							<el-button type="default" size="small" icon="el-icon-plus" v-on:click="changeCanvasScale(true)"></el-button>
							<el-button type="info" size="small" icon="el-icon-minus" v-on:click="changeCanvasScale(false)"></el-button>
						</el-button-group>
					</el-col>
					<el-col :span="6"  v-if="isPreview == false">
						<div class="router-handlers">
							<el-button type="primary" @click='addRouter'>增加标记</el-button>
							<el-button type="success" @click='removeRouter'>删除标记</el-button>
						</div>
					</el-col>
				</el-row>
			</div>
        </section>
        <div class="canvasWrapper">
            <canvas ref="myZrender" class='myZrender' :width="canvasWidth" :height="canvasHeight" v-on:click="handlePoint"></canvas>
        </div>
		<section class="uploadArea" v-if="isPreview == false">
			<el-button @click="uploadRouterInfo" :disabled="isUploaded">上传路由器信息</el-button>
		</section>
    </div>
</template>
<script>
import zrender from "zrender";
import * as constant from "@/utils/constant";
import {renderCanvasMapImage} from "@/utils/renderCanvas"
import Bus from "@/common/js/bus";
export default {
    name: "routerHandler",
    data() {
        return {
            msg: "welcome To Hotal Califoria",
            zr: null,
            canvasWidth: 600,
            canvasHeight: 400,
            scale: 2,
            canvasMode: constant.DEFAULT,
            routerList: [],
            mapImageInfo: {
                imageElem: "",
                width: 0,
                height: 0
            },
            sceneInfo:{},
            canvasWidth: 0,
            canvasHeight: 0,
            //是否已上传标记信息的标记为
            isUploaded: false
        };
    },
    props:["placeId","isPreview"],
    beforeMount() {
        console.log(this.placeId)
        this.mapImagePath = `/web/map/${this.placeId}`
    },
    mounted() {
        this.initZRender();
        this.isPreview = eval(this.isPreview)
        let $this = this;
        let url = `/web/getSceneInfo/${this.placeId}`
        this.axios
            .get(url)
            .then(response => {
                console.log(response.data.data);
                let res = response.data.data;
                let rawRouterList = res.routerSet
                $this.rawRouterList = rawRouterList;
                //获取地图实际长宽
                $this.sceneInfo.mapLength = res.mapLength
                $this.sceneInfo.mapWidth = res.mapWidth
                //获取已经有的标记信息
                renderCanvasMapImage(this);
            })
            .catch(error => {
                let rawRouterList = [];
                $this.rawRouterList = [];
            });
        //测试用
        
    },
    methods: {
        initZRender() {
            const zr = zrender.init(this.$refs.myZrender);
            this.zr = zr;
        },
        //上传标记信息
        uploadRouterInfo() {
            let routerList = this.routerList;
            let $this = this;
            if (routerList.length == 0) {
                this.$message({
                    type: "warning",
                    message: "请添加标记"
                });
            } else {
                let imgWidth = this.mapImageInfo.width;
                let imgHeight = this.mapImageInfo.height;
                let routerListInfo = routerList.map(item => {
                    return {
                        x: item.x / imgWidth,
                        y: item.y / imgHeight,
                        ssId: item.ssid
                    };
                });
                let param = {
                    placeId: this.placeId,
                    routerList: routerListInfo
                };
                let url = "/web/markers";
                let config = {
                    header: {
                        "Content-Type": "application/json"
                    }
                };
                this.axios
                    .post(url, param, config)
                    .then(response => {
                        $this.$message({
                            type: "success",
                            message: "上传标记列表成功"
                        });
                        $this.isUploaded = true;
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    });
            }
        },
        //增加标记
        addRouter() {
            this.canvasMode = constant.ADD_MARKER;
        },
        //删除标记
        removeRouter() {
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
            let mapImageInfo = this.mapImageInfo;
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
                let routerImage = item.routerImage;
                let routerX = item.x;
                let routerY = item.y;
                routerImage.attr({
                    style: {
                        x: routerX / scale,
                        y: routerY / scale - constant.MARKER_SIZE
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
                case constant.ADD_MARKER:{
                    //标记的文本内容(x,y坐标)
                    //增加标记
                    //输入ssid
                    this.$prompt("请输入SSID", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消"
                    })
                    .then(({
                        value
                    }) => {
                        let ssid = value;
                        let isValidSsid = true;
                        //确定ssid不可以重复，应该从后台得到已有的ssid列表
                        for (let item of [...this.routerList, ...this.rawRouterList]) {
                            if (ssid == item.ssid) isValidSsid = false;
                        }
                        if (isValidSsid) {
                            let routerText = `(${markX},${markY})\nSSID:${ssid}`;
                            let routerImage = new zrender.Image({
                                style: {
                                    image: constant.MARKER_IMAGE,
                                    x: offsetX,
                                    y: offsetY - constant.MARKER_SIZE,
                                    width: constant.MARKER_SIZE,
                                    height: constant.MARKER_SIZE,
                                    text: routerText,
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
                            let routerInfo = {
                                x: markX,
                                y: markY,
                                routerId: routerImage.id,
                                routerImage: routerImage,
                                ssid: ssid
                            };
                            this.routerList.push(routerInfo);
                            this.zr.add(routerImage);
                            this.$message({
                                type: "success",
                                message: "路由器添加成功"
                            });
                        } else {
                            this.$message({
                                type: "warning",
                                message: "路由器SSID不得重复"
                            });
                        }
                    })
                    .catch(e => {
                        console.log(e);
                        this.$message({
                            type: "info",
                            message: "取消添加"
                        });
                    });
                    break;
                }
                    //删除标记
                case constant.REMOVE_MARKER:{
                    let routerList = this.routerList;
                    for (let [index, item] of routerList.entries()) {
                        let routerX = item.x;
                        let routerY = item.y;

                        //判断是否处在路由器标记点击的范围内
                        let xDeviation = routerX / scale - offsetX;
                        let yDeviation = routerY / scale - offsetY;
                        let xInRouterRange =
                            xDeviation > -constant.MARKER_SIZE &&
                            xDeviation < constant.MOUSE_DEVIATION;
                        let yInRouterRange =
                            yDeviation < constant.MARKER_SIZE &&
                            xDeviation < constant.MOUSE_DEVIATION;
                        if (xInRouterRange && yInRouterRange) {
                            this.zr.remove(item.routerImage);
                            routerList.splice(index, 1);
                        }
                    }
                    this.routerList = routerList;
                    break;
                }
            }
        }
    }
};
</script>

<style scoped>
.main-container {
  width: 80%;
  padding-left: 10%;
}
.canvasWrapper {
  width: 100%;
  height: 600px;
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
  /* color: white; */
  font-size: 16px;
}
.router-handlers {
  width: 100%;
  text-align: right;
  margin-right: 200px;
}
.el-input {
  width: 150px;
}
.uploadArea{
    margin-top: 30px;
}
</style>
