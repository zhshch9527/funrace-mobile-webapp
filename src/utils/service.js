import {Type} from "./common";
import request from "./request";

export async function callAsync({ url = new Error("common.service.url不可为空"), data = {}, method = 'GET',...params }) {
    return request(url, {
        method,
        data,
        ...params,
    });
}


export function call(callParam, { success, error }) {
    let promise = null ;
    if(Type.isFunction(callParam)){
        promise = callParam() ;
    }else{
        promise = callAsync(callParam) ;
    }
    promise.then((res) => {
        if(res) {
            let { data, result,msg} = res;
            if (data && result) {
                success && success(data,res);
            } else {
                error && error(msg,res);
            }
        }
    });
}
