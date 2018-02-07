import { doRelogin } from './auth';

function onTick(){
//    console.log("onTick");

    doRelogin();
}
var timerId;

const startCron = ()=>{ timerId = setInterval(onTick,5000);}
const stopCron = () => { clearInterval(timerId);}

export {
    startCron,
    stopCron,
}