import fetch from 'dva/fetch';
import {Type} from './common';
import qs from 'qs' ;
import {getUrl} from './urlTools';
import {Toast} from 'antd-mobile' ;
import {getTokenHeader, removeToken} from "./authority";

export default async function request(url, options = {}) {
  const GET = 'GET';
  const defaultOptions = {
    credentials: 'include',
    headers: {
      ...options.headers,
      ...getTokenHeader(),
    }
  };

  //data:查询条件，method：查询类型
  let {data = {}, method = GET} = options;
  //默认pc
  //data.systemSourceCode = Enum.SystemCode.PC;
  method = method.toUpperCase();

  //request参数
  const newOptions = {...defaultOptions, method};

  if (method === GET) {
    if (data) {
      //要和后台对应上
      data.current = data.current;
      data.size = data.pageSize;
      Reflect.deleteProperty(data, 'pageSize');
    }
    url = getUrl(url, data);
  } else {
    url = getUrl(url);
    if (data) {
      //默认使用这个
      if (Type.isObject(data)) {
        newOptions.headers = {
          Accept: 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          ...newOptions.headers,
        };
        newOptions.body = qs.stringify(data);
      } else {
        //form表单
        if (data instanceof FormData) {
          newOptions.headers = {
            Accept: 'application/json',
            //FormData上传不能加Content-Type，不然报错
            // "Content-Type": "multipart/form-data",
            ...newOptions.headers,
          };
          newOptions.body = data;
        } else if (Type.isString(data)) {
          newOptions.headers = {
            Accept: 'application/json',
            'Content-Type': 'application/json; charset=utf-8',
            ...newOptions.headers,
          };
          newOptions.body = data;
        }
      }
    }
  }

  let responseData = undefined ;

  let response = await promise(fetch(url, newOptions), 5000).then(data => {
    return data.json();
  }).catch(e => {
    Toast.fail(`调用后端服务时产生了异常【${e}】`)
  });

  if (response) {
    console.log('-----response request---');
    console.log(response);
    let {result, msg,code} = response;

    if (!result) {
        if (code === '401') {
            removeToken() ;
            Toast.info("登录已过期")
        }else{
            Toast.fail(msg) ;
        }
    }
    responseData = response;
  }else{
    responseData = {} ;
  }

  return responseData ;
}

async function promise(fetch, timeout) {
  return Promise.race([
    fetch,
    new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('请求超时'));
      }, timeout);
    }),
  ]);
}
