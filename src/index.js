const Role = require('./role');
const Sign = require('./sign');

async function run(){
   const user =  await Role.run();
   const info =  await Sign.run(user);
}

console.log('启动自动签到程序...');
const res = run();
