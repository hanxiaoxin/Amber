const apis = {
    roleApi: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn',
    infoApi: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/info',
    signApi: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign'
};

const appVersion = "2.3.0";

const headers = {
    "User-Agent": `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${appVersion}`,
    "Cookie": '',
    "Referer": 'https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=e202009291139501&utm_source=bbs&utm_medium=mys&utm_campaign=icon'
};

const scKey = '';

const actId = 'e202009291139501';

module.exports = {
    apis,
    headers,
    scKey,
    actId,
    appVersion
}
