<template>
    <div>
        <div class="canvasWrapper">
            <canvas ref="myZrender" class = 'myZrender' :width="canvasWidth" :height="canvasHeight" v-on:mousewheel="scrollFn"></canvas>
        </div>
        <section>
            <el-alert title="还未上传任何图片，不能改变图片尺寸" v-bind:class="{'hide-el-alert':!illegalChangeScale}" type="error"></el-alert>
            <el-button type="primary" v-on:click="triggerUpload">{{uploadText}}</el-button>
            <input type="file" v-on:change="showUploadMsg" ref="uploadElem"/>
            <div>
                <span class="demonstration">改变画布比例</span>
                <el-slider
                v-model="scale"
                :step="1"
                :min=1
                :max=10
                v-on:change='changeMapScale'>
                </el-slider>
            </div>
        </section>
    </div>
</template>
<script>
    import zrender from 'zrender'
    const MAX_SCALE = 10
    const MIN_SCALE = 1
    export default {
        name: 'drawing',
        data(){
            return {
                msg:"welcome To Hotal Califoria",
                zr: null,
                canvasWidth: 600,
                canvasHeight: 400,
                scale:2,
                isUploadedImage: false,
                illegalChangeScale: false,
                uploadText:"上传图片"
            }
        },
        mounted(){
            this.initZRender()
        },
        watch:{
            scale:{
                handler(oldValue,newValue) {
                    if(this.isUploadedImage == false){
                        this.illegalChangeScale = true
                    }else{
                        this.renderCanvasMapImage()
                    }
                }
            },
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
            //鼠标在画布上发生滚动触发的事件
            scrollFn(e){
                //if(this.isUploadedImage){
                let isUpDirection = e.deltaY< 0? true: false;
                let scale = this.scale
                if(isUpDirection){
                    scale++;
                }else{
                    scale--;
                }
                if(scale > MAX_SCALE)
                    scale = MAX_SCALE
                if(scale < MIN_SCALE)
                    scale = MIN_SCALE
                this.scale = scale
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
                            $this.isUploadedImage = true
                            //将上传的背景图渲染到canvas上
                            $this.renderCanvasMapImage()
                        };
                    }
                }catch(e){
                    console.log('上传图片出错');
                    console.log(e)
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
                    }
                })
                zr.add(mapImage)
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

            },
            //改变画布比例的函数
            changeMapScale() {
                console.log("滑杆改变比例")
            }
        }
    }
</script>

<style scoped>
    .myZrender{
        background-color: rgba(0, 0, 0, 0.5);
        margin-left: 100px;
        margin-top: 200px;
        border: 1px solid #fff;
    }
    .canvasWrapper{
        width: 100%;
        max-height: 800px;
        overflow: auto;
    }
    input[type = 'file']{
        display: none;
    }
    section{
        width: 600px;
        position: relative;
        left: 50%;
        transform: translateX(-50%);
    }
    .demonstration{
        color: white;
        font-size: 18px;
    }
    .el-slider{
        width: 600px;
    }
    .hide-el-alert{
        display: none;
    }
</style>
