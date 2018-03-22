import { doRelogin } from './auth';
import {store} from './store';
import Moment from 'moment';
import { clearLessonMemberClipboard, clearMassageOrderClipboard, clearInfoMessage, clearErrorMessage } from './actions'


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

function expireNofity() {
    const notify = store.getState().notify;
  //  console.log("expireClipboard",clipboard);
    if (notify.error && notify.error_expire) {
        if (Moment(notify.error_expire).isBefore()) {
            store.dispatch(clearErrorMessage());
        }
    }
    if (notify.info && notify.info_expire) {
        if (Moment(notify.info_expire).isBefore()) {
            store.dispatch(clearInfoMessage());
        }
    }
}


function onTick(){
//    console.log("onTick");

    doRelogin();
    expireClipboard();
    expireNofity();

}
var timerId;

const startCron = ()=>{ timerId = setInterval(onTick,5000);}
const stopCron = () => { clearInterval(timerId);}

export {
    startCron,
    stopCron,
}