const config = require('./config');
const https = require('https');
const url = require("url");
const watcher = require('./watcher');

const uri = url.parse(config.apis.roleApi);

const options = {
    headers:  config.headers,
    method: 'GET',
    hostname: uri.hostname,
    port: uri.port,
    path: `${uri.pathname}${uri.search}`,
    protocol: uri.protocol,
};

/**
 *
 * @returns {Promise<void>}
 */
async function getRole(){
    console.log("准备获取账号信息...");

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

async function run(){
    const roleRes = await getRole();
    if(!roleRes.message || roleRes.message !== 'OK'){
        console.log('失败', roleRes.message);
        return watcher.notify('失败', roleRes.message);
    }

    const user = roleRes.data.list && roleRes.data.list[0];
    console.log(`获取角色成功: 当前角色为<${user.region_name}>的${user.nickname}, 等级${user.level}`);

    return user;
}


module.exports = {
    run
}
