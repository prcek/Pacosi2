

import { setAuthToken } from './actions'
import Cookies from 'js-cookie';
import Jwt from 'jsonwebtoken';
import {store} from './store';

const doLogin = (username,password) => {
    return new Promise(function(resolve, reject) {
        fetch("/auth/login",{
            method:'POST',
            body:JSON.stringify({login:username,password:password}), 
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((resp) => resp.json()).then(data=>{
            if (data.auth_ok) {
                const dt = Jwt.decode(data.auth_token);
                Cookies.set('auth',data.auth_token,{ expires: new Date(dt.exp*1000)});
                store.dispatch(setAuthToken(data.auth_token));
                resolve(true);
            } else {
                resolve(false)
            }
        })
    });

}

const doRelogin = () => {
    const auth = store.getState().auth;
    if (!auth) return false;
    const token = auth.token;
    if (!token) {
        return false;
    }
    if (token==="") {
        return false;
    }
    const d = Jwt.decode(token);
    var now = new Date();
    var exp = (d.exp*1000)-now.getTime();
    if (exp>5000) {
        console.log("login auth exp: ", exp/60000, "min left")
        if (exp<60000) {
            console.log("doRelogin TODO");
        }
    }
}

const doLogout = () => {
    store.dispatch(setAuthToken(""));
    Cookies.remove('auth');
}

const isAuth = () => {
    const auth = store.getState().auth;
    if (!auth) return false;
    const token = auth.token;
    if (!token) {
        return false;
    }
    if (token==="") {
        return false;
    }

    const d = Jwt.decode(token);
    var now = new Date();
    var exp = (d.exp*1000)-now.getTime();
    return exp>0;
}

export {
    doLogin,
    doRelogin,
    doLogout,
    isAuth,
}