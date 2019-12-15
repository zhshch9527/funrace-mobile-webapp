const tokenKey = 'token';

export function getToken() {
    let token = sessionStorage.getItem(tokenKey) || localStorage.getItem(tokenKey);
    return JSON.parse(token);
}

export function getTokenHeader() {
    return {
        Authorization: getToken(),
    }
}

export function setToken(tokenObj, remeberPassword = true) {
    let token = JSON.stringify(tokenObj);
    if (remeberPassword) {
        localStorage.setItem(tokenKey, token);
        sessionStorage.removeItem(tokenKey);
    } else {
        sessionStorage.setItem(tokenKey, token);
        localStorage.removeItem(tokenKey);
    }
}

export function removeToken() {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
}


export function isLogin() {
   return !!getToken() ;
}

export function isRemeberPassword() {
    return !!localStorage.getItem(tokenKey) ;
}
