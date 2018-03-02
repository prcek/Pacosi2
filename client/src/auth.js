

import { setAuth, clearAuth, setLocation } from './actions'
import Cookies from 'js-cookie';
import Jwt from 'jsonwebtoken';
import {store} from './store';

function processAuthResp(data) {
    const dt = Jwt.decode(data.auth_token);
    console.log("DT:",dt)
    Cookies.set('auth',data.auth_token,{ expires: new Date(dt.exp*1000)});

    if (data.location_id) {
        const loc = store.getState().location;
        if (loc !== data.location_id) {
            console.log("force location",data.location_id)
            store.dispatch(setLocation(data.location_id));
        }
    }

    store.dispatch(
        setAuth(data.auth_token,{role:dt.role,login:data.login, id:dt.user_id,name:data.name,location_id:data.location_id})
    );
}


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
                resolve({ok:true,cont: ()=>{processAuthResp(data);}});
            } else {
                resolve({ok:false})
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
    if (!d) {
        return false;
    }
    if (!d.exp) {
        return false;
    }

    var now = new Date();
    var exp = (d.exp*1000)-now.getTime();
    if (exp>5000) {
        //console.log("login auth exp: ", exp/60000, "min left")
        if (exp<120000) {
            console.log("doRelogin");

            fetch("/auth/relogin",{
                method:'POST',
                body:JSON.stringify({token:token}), 
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }).then((resp) => resp.json()).then(data=>{
                if (data.auth_ok) {
                    processAuthResp(data);
                } else {
                    console.log("relogin no auth")
                }
            }).catch(err=>{
                console.log("relogin failed");
            })
        }
    }
}

const doLogout = () => {
    store.dispatch(clearAuth());
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
    if (!d) {
        return false;
    }
    if (!d.exp) {
        return false;
    }
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