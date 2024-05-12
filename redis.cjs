const config_module=require('./config.cjs')
const Redis=require("ioredis")

const RedisCli=new Redis({
    host:config_module.redis_host, //Redis服务器主机名
    port:config_module.redis_port, //Redis服务端口号
    password:config_module.redis_passwd //Redis服务验证密码
});

RedisCli.on("error",function(err){
    console.log("RedisCli connect error");
    RedisCli.quit();
})

async function GetRedis(key){
    try {
        const result=await RedisCli.get(key);
        if (result == null){
            console.log('result:','<'+result+'>','This key cannot be find...');
            return null;
        }else {
            console.log('result:','<'+result+'>','Get key success...');
            return result;
        }
    }catch(error){
        console.log('GetRedis error is',err);
        return null;
    }
}

async function QueryRedis(key){
    try {
        const result=await RedisCli.exists(key);
        if (result === 0){
            console.log('result:','<'+result+'>','This key is null...');
            return null;
        }else {
            console.log('result:','<'+result+'>','This with this value!...');
            return result;
        }
    }catch(error){
        console.log('QueryRedis error is',error);
        return null;
    }
}

async function SetRedisExpire(key,value,expire_time){
    try {
        await RedisCli.set(key,value);
        //为键值对设置过期时间，以秒为单位
        await RedisCli.expire(key,expire_time);
        return true;
    }catch(error){
        console.log('SetRedisExpire error is',error);
        return false;
    }
}

function Quit(){
    RedisCli.quit();
}

module.exports={GetRedis,QueryRedis,Quit,SetRedisExpire}