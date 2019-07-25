const koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const parameter = require('koa-parameter');
const mongoose = require('mongoose');
const error = require('koa-json-error');
const path = require('path');
const app = new koa();
const router = require('./router/index');
const config = require('./config/index');
mongoose.connect(config.connecting,{useNewUrlParser:true},()=>{
    console.log('MongoDB connect success');
});
mongoose.connection.on("error",console.error);

app.use(koaStatic(path.join(__dirname,'/public')))
app.use(error());
app.use(koaBody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/uploads'),
        keepExtensions:true
    }
}));
parameter(app);
router(app);
app.listen(config.port,()=>{
    console.log("server is running:localhost:"+config.port);
})