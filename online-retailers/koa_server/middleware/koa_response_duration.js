module.exports = async (ctx, next) => {

    // 记录开始时间
    const start = new Date().getTime();

    await next();

    const end = new Date().getTime();

    // 设置响应头 X-Response-Time
    ctx.set('X-Response-Time',end-start + 'ms');
}