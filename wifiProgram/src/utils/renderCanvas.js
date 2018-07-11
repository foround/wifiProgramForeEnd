import zrender from "zrender";
import * as constant from "@/utils/constant";

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
const renderCanvasAfterLoad = function ($this, imgWidth, imgHeight) {
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
	renderOriginRouter($this)
}
//在canvas上渲染路由器原始的标记
const renderOriginRouter = function ($this) {
	let imageWidth = $this.mapImageInfo.width,
		imageHeight = $this.mapImageInfo.height
	let mapLength = $this.sceneInfo.mapLength,
		mapWidth = $this.sceneInfo.mapWidth
	for(let item of $this.rawRouterList){
		//在图片上的位置
		let markX = Math.floor(item.x / mapLength * imageWidth)
		let markY = Math.floor(item.y / mapWidth * imageHeight)
		//	渲染时候的位置
		let offsetX = markX / $this.scale
		let offsetY = markY / $this.scale
		let routerText = `(${markX},${markY})\nSSID:${item.ssId}`;
		console.log(routerText)
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
			z: 3
		});
		let routerInfo = {
			x: markX,
			y: markY,
			routerId: routerImage.id,
			routerImage: routerImage,
			ssid: item.ssId
		};
		$this.routerList.push(routerInfo);
		$this.zr.add(routerImage);
	}
}
export {
	renderCanvasMapImage
}