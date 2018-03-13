import { doRelogin } from './auth';
import {store} from './store';
import Moment from 'moment';
import { clearLessonMemberClipboard, clearMassageOrderClipboard } from './actions'


function expireClipboard() {
    const clipboard = store.getState().clipboard;
  //  console.log("expireClipboard",clipboard);
    if (clipboard.massage_order && clipboard.massage_expire) {
        if (Moment(clipboard.massage_expire).isBefore()) {
            store.dispatch(clearMassageOrderClipboard());
        }
    }
    if (clipboard.lesson_member && clipboard.lesson_expire) {
        if (Moment(clipboard.lesson_expire).isBefore()) {
            store.dispatch(clearLessonMemberClipboard());
        }
    }
}

function onTick(){
//    console.log("onTick");

    doRelogin();
    expireClipboard();

}
var timerId;

const startCron = ()=>{ timerId = setInterval(onTick,5000);}
const stopCron = () => { clearInterval(timerId);}

export {
    startCron,
    stopCron,
}