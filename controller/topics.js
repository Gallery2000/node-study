const Topics = require('../model/topics');
class TopicsCtl{
    async find(ctx){
        ctx.body = await Topics.find();
    }
    async findById(ctx){
        const {fields} = ctx.query;
        const selectFields = fields.split(';').filter(f=>f).map(f=>'+'+f.toString()).join(' ');
        const topic = await Topics.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }
    async create(ctx){
        ctx.verifyParmas({
            name:{type:String,required:true},
            avatar:{type:String,required:false},
            introduction:{type:String,required:false},
        });
        const topic = await new Topics(ctx.request.body).save();
        ctx.body = topic;
    }
    async update(ctx){
        ctx.verifyParmas({
            name:{type:String,required:true},
            avatar:{type:String,required:false},
            introduction:{type:String,required:false},
        });
        const topic = await Topics.findByIdAndUpdate(ctx.params.id,ctx.request.body);
        ctx.body = topic;
    }
    
}
module.exports = new TopicsCtl();