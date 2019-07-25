const koaRouter = require('koa-router');
const router = new koaRouter({prefix:'/users'});
const {find,findById,create,update,delete:del,login,listfollowing,following,unfollowing,listFollowers} = require('../controller/user');
const jwt  = require('jsonwebtoken');
const  {secret}= require('../config/index');
const auth = async (ctx,next)=>{
    const {authorization=''} = ctx.request.header;
    const token = authorization.replace('Bearer ','');
    const user = await jwt.verify(token,secret);
    ctx.state.user = user;
    try{
        const user = await jwt.verify(token,secret);
        ctx.state.user = user;
    }catch(err){
        ctx.throw(401,err.message);
    }
    await next();

}
const checkOwner = async (ctx,next)=>{
    if(ctx.state.user._id!==ctx.params.id){
        ctx.throw(403,'No privileges')
    }
    await next();
}
const checkUserExist = async(ctx,next)=>{
    const user=  await User.findById(ctx.params.id);
    if(!user){
        ctx.throw(404);
    }
    next();
}
router.get('/',find);
router.get('/:id',findById);
router.get('/:id/following',listfollowing);
router.get('/following/:id',auth,checkUserExist,following);
router.delete('/following/:id',auth,checkUserExist,unfollowing);
router.get('/:id/followers',auth,listFollowers);
router.post('/create',create);
router.put('/update/:id',auth,checkOwner,update);
router.delete('/delete/:id',auth,checkOwner,del);
router.post('/login',login);
module.exports = router;