<template>
    <div>
        <section class="scaleChangeArea">
            <el-button type="primary" v-on:click="triggerUpload">{{uploadText}}</el-button>
            <input type="file" v-on:change="showUploadMsg" ref="uploadElem"/>
            <el-button-group>
                <el-button type="success" icon="el-icon-plus" v-on:click="changeCanvasScale(true)"></el-button>
                <el-button type="warning" icon="el-icon-minus" v-on:click="changeCanvasScale(false)"></el-button>
            </el-button-group>
            <span class="demonstration">改变画布比例</span>
        </section>
        <div class="canvasWrapper">
            <canvas ref="myZrender" class='myZrender' :width="canvasWidth" :height="canvasHeight" v-on:click="handlePoint"></canvas>
        </div>
        <section class="markerWrapper">
            <el-button type="primary">增加标记</el-button>
            <el-button type="success">删除标记</el-button>
        </section>
    </div>
</template>
<script>
    import zrender from 'zrender'
    const MAX_SCALE = 10
    const MIN_SCALE = 1
    const DEFAULT = 0
    const ADD_MARKER = 1
    const REMOVE_MARKER = 2
    const MARKER_SIZE = 30
    const MARKER_IMAGE = require('@/assets/images/marker.png')
    export default {
        name: 'drawing',
        data(){
            return {
                msg:"welcome To Hotal Califoria",
                zr: null,
                canvasWidth: 600,
                canvasHeight: 400,
                scale: 2,
                isUploadedImage: false,
                illegalChangeScale: true,
                uploadText:"上传图片",
                canvasMode: DEFAULT
            }
        },
        mounted(){
            this.initZRender()
        },
        watch:{
            isUploadedImage:function (newValue,oldValue) {
                if(newValue == true){
                    this.illegalChangeScale = false
                    this.uploadText = "重新上传图片"
                }
            }
        },
        methods:{
            initZRender(){
                const zr = zrender.init(this.$refs.myZrender)
                this.zr = zr
            },
            triggerUpload(){
                console.log('触发图片上传')
                let uploadElem = this.$refs.uploadElem
                //触发文件域点击事件
                uploadElem.click();
            },
            //当文件域被改变(有上传的图片时),将图片渲染到canvas上
            showUploadMsg(e){
                let $this = this
                console.log('展示图片上传信息');
                let imageFile = this.$refs.uploadElem.files[0];
                const reader = new FileReader();
                try{
                    reader.readAsDataURL(imageFile);
                    //图片信息读取后执行的操作
                    reader.onload = function (event) {
                        console.log("读取图片成功")
                        let imageData = event.target.result
                        let image = new Image()
                        image.src = imageData
                        image.onload = function(){
                            $this.image = image
                            console.log(image);
                            $this.isUploadedImage = true
                            //将上传的背景图渲染到canvas上
                            $this.renderCanvasMapImage()
                        };
                    }
                }catch(e){
                    console.log('上传图片出错');
                }
            },
            //渲染canvas背景
            renderCanvasMapImage() {
                let image = this.image
                let scale = this.scale
                let displayWidth = image.width/scale
                let displayHeight = image.height/scale
                //改变画布大小
                this.canvasWidth = displayWidth
                this.canvasHeight = displayHeight
                let zr = this.zr
                //渲染地图背景
                let mapImage = new zrender.Image({
                    style:{
                        "image": image,
                        "x": 0,
                        "y": 0,
                        "width": displayWidth,
                        "height:": displayHeight
                    },
                    
                })
                zr.add(mapImage)
            },
            // 改变图片大小
            changeCanvasScale(isAddScale) {
                let scale = this.scale
                let illegalChangeScale = this.illegalChangeScale
                if(!illegalChangeScale){
                    if(isAddScale == true && scale > MIN_SCALE){
                        scale--
                    }else{
                        if(isAddScale == false && scale < MAX_SCALE){
                            scale++
                        }
                    }
                    this.scale = scale
                    this.renderCanvasMapImage()
                }else{
                    console.log('非法改变图片大小')
                }

            },
            //标记点进行操作
            handlePoint(e){
                let offsetX = e.offsetX
                let offsetY = e.offsetY
                let scale = this.scale
                let markX = offsetX * scale
                let markY = offsetY * scale
                console.log(markX,markY)
                //增加标记
                let markerImage = new zrender.Image({
                    style:{
                        "image": "/static/img/marker.881b1ef.png",
                        "x": offsetX,
                        "y": offsetY - MARKER_SIZE,
                        "width": MARKER_SIZE,
                        "height:": MARKER_SIZE
                    },
                    z:1
                })
                console.log(markerImage)
                this.zr.add(markerImage)
            },
            generateACircle(){
                let zr = this.zr
                let circle = new zrender.Circle({
                    shape:{
                        cx: 100,
                        cy: 100,
                        r: 40
                    },style:{
                        fill: 'none',
                        stroke: "#F00"
                    },
                    draggable: true
                })
                zr.add(circle)

            }
        }
    }
</script>

<style scoped>
    .canvasWrapper{
        width: 100%;
        height: 800px;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
        position: relative;
    }
    .myZrender{
        border: 1px solid #fff;
        position: absolute;
        left: 0;
        top: 0;
    }
    input[type = 'file']{
        display: none;
    }
    section{
        width: 100%;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
        text-align: left;
    }
    .scaleChangeArea{
        margin-bottom: 20px;
    }
    .button-group{
        margin-top: 50px;
        margin-bottom: 50px;
        text-align: left;
    }
    .demonstration{
        color: white;
        font-size: 18px;
    }
    .markerWrapper{
        margin-top: 20px;
    }
</style>
