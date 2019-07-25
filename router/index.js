const userRouter = require('./user');
const homeRouter = require('./home');
module.exports = app=>{
    app.use(homeRouter.routes());
    app.use(homeRouter.allowedMethods());
    
    app.use(userRouter.routes());
    app.use(userRouter.allowedMethods());
}