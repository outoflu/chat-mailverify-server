
const grpc = require('@grpc/grpc-js')
const message_proto = require('./proto.cjs')
const const_module = require('./const.cjs')
const { v4: uuidv4 } = require('uuid');
const emailModule = require('./email.cjs')


/**
 * GetVarifyCode grpc响应获取验证码的服务
 * @param {*} call 为grpc请求 
 * @param {*} callback 为grpc回调
 * @returns 
 */
async function GetVarifyCode(call, callback) {
    console.log("email is ", call.request.email)
    try{
        
        let uniqueId = uuidv4();
        if (uniqueId.length > 4) {
            uniqueId = uniqueId.substring(0, 4);
        } 

        console.log("uniqueId is ", uniqueId)
        let text_str =  '您的验证码为'+ uniqueId +'请三分钟内完成注册'
        //发送邮件
        let mailOptions = {
            from: 'jiangdongxian2002@163.com',
            to: call.request.email,
            subject: '验证码',
            text: text_str,
        };
    
        let send_res = await emailModule.SendMail(mailOptions);
        console.log("send res is ", send_res)

        callback(null, { email:  call.request.email,
            error:const_module.Errors.Success
        }); 
        
 
    }catch(error){
        console.log("catch error is ", error)

        callback(null, { email:  call.request.email,
            error:const_module.Errors.EXCEPTION
        }); 
    }
     
}

function main() {
    var server = new grpc.Server()
    server.addService(message_proto.VarifyService.service, { GetVarifyCode: GetVarifyCode })
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        //server.start()
        console.log('varify server started')        
    })
}

main()
