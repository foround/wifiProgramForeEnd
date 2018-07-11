import zrender from "zrender";
//渲染canvas背景
const renderCanvasMapImage = function($this){
    let mapImagePath = $this.mapImagePath;
    console.log(`mapImagePath is ${mapImagePath}`)
    let imgElem = new Image();
    imgElem.src = mapImagePath;
    //判断是否还存了图片
    if (imgElem.complete == true) {
		let imgWidth = imgElem.width,
			imgHeight = imgElem.height;
		renderCanvasAfterLoad($this,imgWidth, imgHeight);
    } else {
      imgElem.onload = function () {
        let imgWidth = imgElem.width,
            imgHeight = imgElem.height;
        renderCanvasAfterLoad($this,imgWidth, imgHeight);
      };
    }
}
//在图片加载完成后渲染图片
const renderCanvasAfterLoad = function($this,imgWidth, imgHeight){
    console.log($this)
    $this.mapImageInfo.width = imgWidth;
    $this.mapImageInfo.height = imgHeight;
    let scale = $this.scale;
    let displayWidth = imgWidth / scale;
    let displayHeight = imgHeight / scale;
    //改变画布大小
    $this.canvasWidth = displayWidth;
    $this.canvasHeight = displayHeight;
    let zr = $this.zr;
    //渲染地图背景
    let mapImage = new zrender.Image({
		style: {
		image: $this.mapImagePath,
		x: 0,
		y: 0,
		width: displayWidth,
		height: displayHeight
		}
    });
    $this.mapImageInfo.mapImageElem = mapImage;
    zr.add(mapImage);
}
export default renderCanvasMapImage;