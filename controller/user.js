const User = require('../model/user');
const jwt = require('jsonwebtoken');
const {secret} = require('../config/index')
class UserCtl{
    async find(ctx){
        ctx.body = await User.find();
    }
    async findById(ctx){
        const {fields} = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=>'+'+f).join(' ');
        const user = await User.findById(ctx.params.id).select('+employments +educations');
        if(!user){
            ctx.throw(404,'No this user');
        }
        ctx.body = user;
    }
    async create(ctx){
        ctx.verifyParams({
            name:{type:'string',required:true}
        });
        const userBody = ctx.request.body;
        
        if(await User.findOne({name:userBody.name})){
            ctx.throw(409,'This user already exists');
        }else{
            const user =  await new User(userBody).save();
            ctx.body = user;
        }
    }
    async update(ctx){
        ctx.verifyParams({
            name:{type:'string',required:false},
            password:{type:'string',required:false},
            avatar_url:{type:'string',required:false},
            gender:{type:'string',required:false},
            headline:{type:'string',required:false},
            locations:{type:'array',itemType:'string',required:false},
            business:{type:'string',required:false},
            employments:{type:'array',itemType:'object',required:false},
            educations:{type:'array',itemType:'object',required:false},
            
        });
        const user =  await User.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        if(!user){
            ctx.throw(404,'No this user');
        }
        ctx.body = user;
    }
    async delete(ctx){
        const user = await User.findByIdAndRemove(ctx.params.id);
        if(!user){
            ctx.throw(404,'No this user');
        }
        ctx.body = user;
    }
    async login(ctx){
        ctx.verifyParams({
            name:"string",
            password:"string"
        });
        const user = await User.findOne(ctx.request.body);
        if(!user){
            ctx.throw(401,'Username or password incorrect');
        }
        const {_id,name} = user;
        let token = jwt.sign({_id,name}, secret, {
            expiresIn: '1d'  // 1小时过期
        });
        ctx.body = {token};
    }
    async listfollowing(ctx){
        //populate拿到详细信息 
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        console.log(user,ctx.params.id);
        if(!user){ctx.throw(404)};
        ctx.body = user.following;
    }
    async following(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(me.following.map(f=>f.toString()).includes(ctx.params.id)===false){
            me.following.push(ctx.params.id);
            me.save();
        }
        ctx.status = 204;
    }
    async unfollowing(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = me.following.map(f=>f.toString()).indexOf(ctx.params.id);
        if(index>-1){
            me.following.splice(index,1);
            me.save();
        }
        ctx.status = 204;
    }
    async listFollowers(ctx){
        const users = await User.find({following:ctx.params.id});
        ctx.body = users;
    }
} 

module.exports = new UserCtl();