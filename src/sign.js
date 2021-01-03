const config = require("./config");
const https = require("https");
const url = require("url");
const md5 = require('md5');

async function getInfo(user){
    console.log("准备获取签到信息...");

    if(!user.region) return console.log('区域数据错误');

    if(!user.game_uid) return console.log("uid数据错误");

    const infoUrl = `${config.apis.infoApi}?region=${user.region}&act_id=${config.actId}&uid=${user.game_uid}`;

    const uri = url.parse(infoUrl);

    const options = {
        headers:  config.headers,
        method: 'GET',
        hostname: uri.hostname,
        port: uri.port,
        path: `${uri.pathname}${uri.search}`,
        protocol: uri.protocol,
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            res.on("data", chunk => {
                resolve(JSON.parse(chunk.toString()));
            });

            res.on("error", err => {
                reject(err);
            });
        });

        req.end();
    });
}

async function handleSign(user){
    const uri = url.parse(config.apis.signApi);

    const options = {
        headers:  getHeader(),
        method: 'POST',
        hostname: uri.hostname,
        path: `${uri.pathname}`,
        protocol: uri.protocol,
    };

    const body = {
        "act_id": config.actId,
        "region": user.region,
        "uid": user.game_uid
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, res => {
            res.on("data", chunk => {
                resolve(chunk.toString());
            });

            res.on("error", err => {
                reject(err);
            });
        });

        req.write(Buffer.from(JSON.stringify(body)));
        req.end();
    });
}


function getHeader(){

    const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    return {
        'x-rpc-device_id': 'CF4AC1CD8CD23511888060DA7C95624' + str[Math.floor(Math.random() * str.length)],
        'x-rpc-client_type': '5',
        'Accept-Encoding': 'gzip, deflate, br',
        'User-Agent': config.headers["User-Agent"],
        'Referer': config.headers.Referer,
        'x-rpc-app_version': config.appVersion,
        'DS': getDS(),
        'Cookie': config.headers.Cookie
    };
}

function getDS(){
    const str = 'abcdefghijklmnopqrstuvwxyz0123456789';

    const n = 'h8w582wxwgqvahcdkpvdhbh2w9casgfl';
    const i = Math.floor(new Date().getTime()/1000);
    let r = '';

    for(let i = 0; i< 6; i++){
        r += str[Math.floor(Math.random()) * str.length];
    }

    const c = md5('salt=' + n + '&t='+ i + '&r=' + r)
    return `${i},${r},${c}`;
}


async function run(user){
    const infoRes = await getInfo(user);

    const data = infoRes.data;

   /* if(data.is_sign && data.is_sign === true) {
        return console.log("旅行者今天你已经签过到了.");
    }

    if(data.is_sign !== false) {
        return console.log("签到状态异常");
    }

    if(data.first_bind && data.first_bind === true){
        return console.log("请先绑定米游社账号");
    }*/

    console.log("准备进行签到");

    const signRes = await handleSign(user);

    if(signRes.retcode !== '-5003'){
        return console.log('旅行者，你已经签到过了.');
    }

    if(signRes.message !== 'OK'){
        return console.log(signRes);
    }

    console.log("签到成功");
}

module.exports = {
    run
}
