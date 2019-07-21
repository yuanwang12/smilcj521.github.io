const model = require("./model");
// const basicPath = "https://www.dbmeinv.com/?pager_offset=";
const basicPath = "http://www.bbsnet.com/doutu/page/";
let totalNum = 100; //控制总下载图片数量  不设定用 `totalNum = null` 默认采用方式
let downLoadPicNum = 0; //已下载图片数量
let start = 1, // 控制分页开始数
  end = 5, // 控制分页结束数 不启用组数控制用 `end = null`
  obj = {};
const main = async url => {
  let list = [],
    index = 0;
    const data = await model.getPage(url); //获取页面数据
    list = await model.getUrl(data); //根据页面数据获取url
    obj['content' + start] = list;
    await downLoadImages(list, index); //下载对应url图片
};

const downLoadImages = async (list, index) => {
  console.log(`第${start}组第${index}张图片，当前组共${list.length}张图片，共成功下载了${downLoadPicNum}张图片`);
  if(totalNum && downLoadPicNum >= totalNum) { //超过设定下载数量，就停止
    model.getTitle(obj); // 写入文件描述
    console.log("超过设定下载数量, 爬取结束>>>>>>>>>>>>>>>");
    return false;
  }else if (end && index >= list.length) {//未设定总下载图片数量 则通过下载组数控制
    console.log("切换一下组===================================");
    start++;
    console.log('start',start);
    if (start < end) {
      main(basicPath + start);//进行下一页图片组的爬取。
    } 
    model.getTitle(obj); // 写入文件描述
    console.log("加载完所有图片, 爬取结束>>>>>>>>>>>>>>>");
    return false;
  }
  // 下载判断
  if (list[index]) {
    let pageDomUrlWrapp1 = await model.getPage(list[index].url);//获取图片所在网页
    let pageDomUrlWrapp2 = await model.getPage(list[index + 1].url);//获取图片所在网页

    if(pageDomUrlWrapp1){
      let imageNum1 = await model.getImagesNum(pageDomUrlWrapp1.res);//获取详情页图片的数量
      let imageNum2 = await model.getImagesNum(pageDomUrlWrapp2.res);//获取详情页图片的数量
      if(imageNum1 >= 0 || imageNum2 >= 0){
        /**
         * 高并发处理
         */ 
        let p1, p2;
        if(imageNum1){
            p1 = new Promise((resolve, reject)=>{
            let isDownLoad = model.downloadImage(pageDomUrlWrapp1, imageNum1, list[index].name);// 下载图片
            if(isDownLoad){
              index++;
              downLoadPicNum++;
              resolve(''); 
            }
          });
        }
        
        if(imageNum2){
            p2 = new Promise((resolve, reject)=>{
            let isDownLoad = model.downloadImage(pageDomUrlWrapp2, imageNum2, list[index].name);// 下载图片
            if(isDownLoad){
              index++;
              downLoadPicNum++; 
              resolve(''); 
            }
          });
        }
        if(imageNum1 && imageNum2){
          Promise.all([p1, p2]).then(()=>{
            downLoadImages(list, index);//循环完成下载下一组
          });
        }else{
          Promise.all([p1]).then(()=>{
            downLoadImages(list, index);//循环完成下载下一组
          });
        } 
      }else{
        console.log("已爬取此网站所有图片, 爬取结束>>>>>>>>>>>>>>>");
        return false;
      }
    }else {
      console.log(`获取图片所在网页失败!，3s重新发起请求<<<<<<<<<<<<<<<`);
      setTimeout(()=>{
        downLoadImages(list, index);//循环完成下载下一组
      },3000)
    }
  }
};

// 程序入口文件
main(basicPath + start);
