import qs from "qs";
import {isEmpty} from "./common";

export function getUrl(url,data){
  if(!isHttp(url)){
    if(!url.startsWith("/api/")){
      if(url.startsWith("/")){
        url = "/api"+url ;
      }else{
        url = "/api/" + url ;
      }
    }
  }
  if(data){
    let timer=new Date().getTime().toString();

    if(isEmpty(data)){
      data = {} ;
    }
    data.t = timer ;

    if(url.includes('?')){
      url = url + "&" + qs.stringify(data);
    }else{
      url = url + "?" + qs.stringify(data);
    }
  }
  return url ;
}

export function isHttp(url){
  if(!url){
    return false ;
  }
  return url.startsWith("https://") || url.startsWith("http://") ;
}
