export default class SocketServe {
  /**
   * 单例模式
   */
  static instance = null
  static get Instance () {
    if (!this.instance) {
      this.instance = new SocketServe()
    }
    return this.instance
  }

  // 和服务器连接的 socket 对象
  ws = null

  // 标识是否连接成功
  connected = false
  // 记录重新发送的次数
  sendRetryCount = 0
  // 记录重新尝试连接的次数
  connectRetryCount = 0

  // 存储回调函数
  callBackMapping = {}

  // 定义连接服务器的方法
  connect () {
    if (!window.WebSocket) {
      return console.log('您的浏览器不支持WebScoket')
    } else {
      this.ws = new WebSocket('ws://127.0.0.1:9998')
    }

    // 连接成功的事件
    this.ws.onopen = () => {
      this.connected = true
      this.sendRetryCount = 0
      this.connectRetryCount = 0
      console.log('连接服务器成功')
    }
    // 连接服务端失败
    this.ws.onclose = () => {
      this.connected = false
      this.connectRetryCount++
      // 连接失败，尝试重连
      setTimeout(() => {
        this.connect()
      }, 500 * this.connectRetryCount)
      console.log('连接服务端失败')
    }
    // 得到服务器发送过来的数据
    this.ws.onmessage = msg => {
      console.log('从服务端获取到了数据')
      console.log(msg)

      const recvData = JSON.parse(msg.data)
      console.log(recvData.socketName)
      const socketType = recvData.socketType
      // 判断回调函数是否存在
      if (this.callBackMapping[socketType]) {
        console.log('进入')
        const action = recvData.action
        if (action === 'getData') {
          const realData = JSON.parse(recvData.data)
          this.callBackMapping[socketType].call(this, realData)
        } else if (action === 'fullScreen') {
          console.log(1)
        } else if (action === 'themeChange') {
          console.log(2)
        }
      }
    }
  }

  // 注册与取消对应 socketType 的回调函数
  registerCallBack (socketType, callBack) {
    this.callBackMapping[socketType] = callBack
  }

  unRegisterCallBack (socketType) {
    this.callBackMapping[socketType] = null
  }

  // 发送数据
  send (data) {
    // 判断有没有连接成功
    if (this.connected) {
      this.ws.send(JSON.stringify(data))
    } else {
      this.sendRetryCount++
      setTimeout(() => {
        this.send(data)
      }, 500 * this.sendRetryCount)
    }
  }
}
