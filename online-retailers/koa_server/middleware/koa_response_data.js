const path = require('path');
const getFileData = require('../utils/getFileData.js');

module.exports = async (ctx, next) => {

    // 根据请求路径获取对应的 data 文件夹数据
    let filePath = ctx.request.url;
    filePath = '../data/' + filePath.replace('/api/','') + '.json';
    // 要使用绝对路劲， 这里使用相对路劲调用 getFileData 会出错
    filePath = path.join(__dirname, filePath);

    try {
        const fileData = await getFileData(filePath);
        ctx.response.body = fileData;
    }catch(err){
        ctx.response.body = {
            code: 404,
            message: '文件路径出错，导致文件读取不到!'
        }
    }
    
    await next();
}