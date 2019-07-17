const rp = require("request-promise"), //进入request-promise模块
fs = require("fs"), //进入fs模块
cheerio = require("cheerio"), //进入cheerio模块
depositPath = "E:/img/"; //存放照片的地址
module.exports = {
  async getPage(url) {
    console.log('请求网页开始...')
    try {
      var res = await rp({
        url: url
      });
    } catch (error) {
      console.log('请求被限制,5秒后重新发起请求');
    }
    if(res){
      const data = {
        url,
        res: res
      };
      return data;
    }else{
      return false;
    }
  },
  getUrl(data) {
    let list = [];
    const $ = cheerio.load(data.res); //将html转换为可操作的节点
    $(".thumbnails li a")
      .children()
      .each(async (i, e) => {
        let obj = {
          id: i,
          name: e.attribs.alt, //图片网页的名字，后面作为文件夹名字
          url: e.parent.attribs.href, //图片网页的url
          imgUrl: e.attribs.src //图片的src
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
      let str = JSON.stringify(data, "","\t")
      fs.writeFile('data.json', str, function(err){
        if (err) {
          console.log(`文件创建error...`)
        }else{
          console.log(`文件创建成功，写入数据成功`)
        }
      })
    }else{
      
      // 图片描述写入txt文件
      let str = JSON.stringify(data,"","\t")
      fs.writeFile('data.json', str, function(err){
      if (err) {console.log(`文件创建error...`)}
      })
    }
  },

  getImagesNum(res, name) {
    if (res) {
      let $ = cheerio.load(res);
      let len = $(".image-container")
        .find("img").length;
      if (len === 0) {
        fs.rmdirSync(`${depositPath}${name}`);// 删除无法下载的文件夹
        return 0;
      }
      return len;//返回图片总数
    }
  },

  //下载相册照片
  async downloadImage(data, name) {
    let picName = name.replace('/', ''); //去掉斜杠 防止转义
    if (data.res) {
      var $ = cheerio.load(data.res);
      if ($(".topic-richtext").find("img")[0]) {
        let imgSrc = $(".topic-richtext").find("img")[0].attribs.src;//图片地址
        let headers = {};//反防盗链
        await rp({
          url: imgSrc,
          resolveWithFullResponse: true,
          headers
        // }).pipe(fs.createWriteStream(`${depositPath}/${picName}.jpg`));//下载
        }).pipe(fs.createWriteStream(`${__dirname}/img/${picName}.jpg`));//下载
        console.log(`${__dirname}/img/${picName}.jpg下载成功`);
      } else {
        console.log(`${__dirname}/img/${picName}.jpg加载失败`);
      }
    }
  }
};
