const rp = require("request-promise"), //进入request-promise模块
fs = require("fs"), //进入fs模块
cheerio = require("cheerio"); //进入cheerio模块
module.exports = {
  async getPage(url) {
    console.log('请求网页开始...')
    try {
      var res = await rp({
        url: url
      });
    } catch (error) {
      console.log('报错了', error);
    }
    if(res){
      const data = {
        url,
        res: res
      };
      console.log('请求网页...')
      return data;
    }else{
      return false;
    }
  },
  getUrl(data) {
    let list = [];
    const $ = cheerio.load(data.res); //将html转换为可操作的节点
    $("#post_container li a")
      .children()
      .each(async (i, element) => {
        let obj = {
          name: element.attribs.alt || '', //图片网页的名字，后面作为文件夹名字
          url: element.parent.attribs.href || '', //图片网页的url
          imgUrl: element.attribs.src || '' //图片的src
        };
        list.push(obj); //输出目录页查询出来的所有链接地址
      });
    return list;
  },

  /**
   * 创建json文件写入描述
   */
  getTitle(data) {
    if(!(fs.existsSync('data.json'))) {
      let str = JSON.stringify(data, "","\t");
      fs.writeFile('data.json', str, function(err){
        if (err) {
          console.log(`文件创建error...`)
        }else{
          console.log(`文件创建成功，写入数据成功`)
        }
      })
    }else{
      // 图片描述写入json文件
      let str = JSON.stringify(data,"","\t")
      fs.writeFile('data.json', str, function(err){
      if (err) {console.log(`文件创建error...`)}
      })
    }
  },

  getImagesNum(res) {
    if (res) {
      let $ = cheerio.load(res);
      let len = $(".context")
        .find("img").length;
      return len;//返回图片总数
    }
  },

  //下载图片
  async downloadImage(pageDomUrlWrapp, imageNum, name) {
    name = name.replace('/', '').trim(); //去掉斜杠和空格 防止转义
    let $ = cheerio.load(pageDomUrlWrapp.res); // 把网页转化为可操作的dom节点
    let headers = {};//反防盗链
    
    // 循环下载详情页图片
    for (let i = 0; i <= imageNum; i++) {
      if (pageDomUrlWrapp.res) {
        if ($(".context").find("img")[i]) {
          let imgSrc = $(".context").find("img")[i].attribs.src;//图片地址
          console.log(`详情页第${i}张图片地址：imgSrc`);
          await rp({
            url: imgSrc,
            resolveWithFullResponse: true,
            headers
          }).pipe(fs.createWriteStream(`${__dirname}/img/${name}.jpg`));//下载
            console.log(`${__dirname}/img/${name}.jpg下载成功`);
            return true;
        } else {
            console.log(`${__dirname}/img/${name}.jpg加载失败`);
            return false;
        }
      }
    }
  }
};
