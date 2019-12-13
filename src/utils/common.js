/**
 * 是否有值（包括false和0）
 * @param values
 * @returns {boolean}
 */
import {isValidElement} from "react";

export function isHasValue(...values) {
  return values.every(value => value || value === 0 || value === false);
}

/**
 * 判断是否为某个类型
 */
export const Type = {
  isType: (data, type) => {
    if (!isHasValue(data)) return false;
    return Object.prototype.toString.call(data) == '[object ' + type + ']';
  },
  isObject: data => {
    return Type.isType(data, 'Object');
  },
  isArray: data => {
    return Type.isType(data, 'Array');
  },
  isMap: data => {
    return Type.isType(data, 'Map');
  },
  isFunction: data => {
    return Type.isType(data, 'Function');
  },
  isString: data => {
    return Type.isType(data, 'String');
  },
  isNumber: data => {
    return !isNaN(data) || Type.isType(data, 'Number');
  },
  isBoolean: data => {
    return Type.isType(data, 'Boolean');
  },
};

/**
 *
 * @desc   判断对象是否为空
 * @param  {Object} obj
 * @return {Boolean}
 */
function isEmptyObject(obj) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return false;
  }
  return !Object.keys(obj).length;
}

/**
 * 判断是否为空
 * @param data
 * @returns {*}
 */
export function isEmpty(data) {
  if (!data) return true;
  if (Type.isObject(data)) {
    return isEmptyObject(data);
  } else if (Type.isArray(data)) {
    return data.length == 0;
  }
  return false;
}

export function isReact(obj) {
  return isValidElement(obj) ;
}

/**
 * 判断是否不为空
 * @param data
 * @returns {boolean}
 */
export function isNotEmpty(data) {
  return !isEmpty(data);
}

export function deepClone(obj) {
  let o = obj instanceof Array ? [] : {};
  Object.keys(obj).forEach(key => {
    let value = obj[key];
    //判断是否是react组件
    let isReactFlag = isReact(value);
    if (isReactFlag) {
      value = Object.assign({}, value);
      value.props = deepClone(value.props);
      o[key] = value;
    } else {
      o[key] =
        (Type.isObject(value) || Type.isArray(value) || Type.isMap(value))
          ? deepClone(value)
          : value;

      //深复制，对于moment的日期类型，没有把方法复制进去
      //antd里边的日期组件就报错了
      //这里把方法加上
      //或者直接判断如果是日期或者是其他特殊的
      if (value && value.__proto__) {
        o[key].__proto__ = value.__proto__;
      }
    }
  });

  return o;
}

export function getFunctionValue(key,...params){
    if(Type.isFunction(key)){
        key = key(...params) ;
    }
    return key ;
}

Date.prototype.format = function(format) {
    /* 若格式化的pattern为空，则默认为"yyyy-MM-dd hh:mm:ss"。 */
    if (!format) {
        format = "yyyy-MM-dd hh:mm:ss";
    }
    var o = {
        "M+" : this.getMonth() + 1, // Month.
        "d+" : this.getDate(), // Day.
        "h+" : this.getHours(), // Hour.
        "m+" : this.getMinutes(), // Minute.
        "s+" : this.getSeconds(), // Second.
        "q+" : Math.floor((this.getMonth() + 3) / 3), // Quarter.
        "S" : this.getMilliseconds()
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};
