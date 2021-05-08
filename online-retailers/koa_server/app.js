// 1. 创建 koa 实例
const koa = require('koa');
const app = new koa();
const fs = require('fs');
const path = require('path');
const ws = require('ws');
const fileUtils = require('./utils/getFileData.js');

const respDuration = require('./middleware/koa_response_duration.js');
const respHeader = require('./middleware/koa_response_header.js');
const respData = require('./middleware/koa_response_data.js');

// 2. 绑定中间件
app.use(respDuration);
app.use(respHeader);
app.use(respData);

// 创建 websocket 对象，绑定端口号
const wss = new ws.Server({
    port: 9998
})
// 对客户端连接事件进行监听 client 代表客户端的连接socket对象
wss.on('connection', client => {
    console.log('连接成功！');

    // 对客户的的连接对象进行 message 事件监听 
    // msg: 由客户端发送给服务器的数据
    client.on('message', async msg => {
        console.log('客户端通过websocket发送过来的数据：', msg);

        const payload = JSON.parse(msg);
        const action = payload.action;
        if (action === 'getData') {
            let filePath = './data/' + payload.chartName + '.json';
            // payload.chartName trend seller map rank hot stock
            filePath = path.join(__dirname, filePath);
            const ret = await fileUtils(filePath);
            // 需要在服务端获取到数据的基础之上，增加一个 data 字段
            payload.data = ret;
            console.log('发送给客户端的数据：', payload)
            client.send(JSON.stringify(payload));
        } else {
            // 原封不动地将所接收到的数据转发给每个处于连接状态的客户端
            // wss.clients // 所有客户端的连接
            wss.clients.forEach(v => {
                v.send(msg);
            });
        }
    });
});

// 3. 绑定端口号
app.listen(8888, function () {
    console.log('server is start ...');
})
