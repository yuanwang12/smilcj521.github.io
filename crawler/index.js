const model = require("./model");
const basicPath = "https://www.dbmeinv.com/?pager_offset=";
let start = 1,
  end = 5,
  obj = {};
const main = async url => {
  let list = [],
    index = 0;
    const data = await model.getPage(url); //获取页面数据
    list = await model.getUrl(data); //根据页面数据获取url
    
    obj['content' + start] = list;
    await downLoadImages(list, index); //下载对应url图片
    // await model.getTitle(obj); // 写入文件描述
};

const downLoadImages = async (list, index) => {
  console.log(`正在下载第${start}组正/第'${index}个`);
  console.log(`第${start}组总长度:${list.length}`);
  if (index === list.length) {
    start++;
    if (start < end) {
      main(basicPath + start);//进行下一页图片组的爬取。
    }
    model.getTitle(obj); // 写入文件描述
    return false;
  }

  // 创建文件夹
  if (list[index]) {
    let item = await model.getPage(list[index].url);//获取图片所在网页
    if(item){
      let imageNum = await model.getImagesNum(item.res, list[index].name);//获取这组图片的数量

      // 爬取页面所在网页图片
      for (var i = 1; i <= imageNum; i++) {
        // let page = await model.getPage(list[index].url + `/${i}`);//遍历获取这组图片每一张所在的网页
        // await model.downloadImage(page, i);// 下载
        await model.downloadImage(item, list[index].name); // 下载
      }
      index++;
      downLoadImages(list, index);//循环完成下载下一组
    }else {
      setTimeout(()=>{
        let item = model.getPage(list[index].url);//获取图片所在网页
        if(item){
          let imageNum = model.getImagesNum(item.res, list[index].name);//获取这组图片的数量
    
        // 爬取页面所在网页图片
        for (var i = 1; i <= imageNum; i++) {
           model.downloadImage(item, list[index].name); // 下载
        }
        index++;
        downLoadImages(list, index);//循环完成下载下一组
        }
      },5000)
    }
  }
};

// 程序入口文件
main(basicPath + start);
