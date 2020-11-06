/**
 * Created by wanghao on 19/06/26.
 * 工具函数
 */

/**
 * 返回JSON对象
 * @param {Number} code 状态码
 * @param {String} message 提示信息
 * @param {Object} data 数据
 */
export function resJson(code = 200, message, data) {
    return {
        code,
        message,
        data
    }
}

/**
 * 格式化日期根据值
 * @param {Date} time 日期
 * @param {String} cFormat 格式化方式
 */
export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 格式化日期根据值
 * @param {Date} time 日期
 * @param {String} option 格式化方式
 */
export function formatTime(time, option) {
    time = +time * 1000
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) { // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

/**
 * 格式化数字，保留两位小数
 * @param {Number} 数字
 */
export function numFilter(value) {
    // 截取当前数据到小数点后三位
    let tempVal = parseFloat(value).toFixed(3)
    let realVal = tempVal.substring(0, tempVal.length - 1)
    return realVal
}

/**
 * 格式化日期 - 2020-01-01
 * @param {Date} date 
 */
export function formatDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
};

/**
 * 格式化日期 - 2020年1月1日
 * @param {Date} date 
 */
export function formatChDate(date) {
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    //m = m < 10 ? '0' + m : m;  
    var d = date.getDate();
    //d = d < 10 ? ('0' + d) : d;  
    return m + '月' + d + '日';
};

/**
 * 
 * @param {*} date 日期 2020-02-02 08:00:00
 */
function add0(m) {
    return m < 10 ? '0' + m : m
}
export function formatDateByHMS(date) {
    let time = date
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    let s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
};
/**
 * 
 * @param {*} date 日期 2020-02-02 08:00
 */
export function formatDateByHM(date) {
    let time = date
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let mm = time.getMinutes();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm);
};

/**
 * 
 * @param {Date} time 时间戳
 * @param {Int} type 类型 1为天数 2为小时
 */
export function getDayOrHourByTime(time, type) {
    let result = 0
    if(type == 1) {
        result = Math.ceil(time / (1000 * 60 * 60 * 24))
    } else {
        result = time / (1000 * 60 * 60).toFixed(1)
    }
    return type == 1 ? Math.round(result) : result.toFixed(1)
}

/**
 * 把url参数变成对象
 * @param {String} url url字符串
 */
export function getRequest(url) {
    let theRequest = new Object();
    if (url.indexOf('?') != -1) {
        let str = url.substr(1); //去掉该字符串第一个字符
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
            const itemRequest = strs[i].split('=');
            theRequest[itemRequest[0]] = itemRequest[1];
        }
    }
    return theRequest;
}

/**
 * 防抖函数
 * @param {Function} func 执行函数 
 * @param {Number} wait 间隔时间
 * @param {Boolean} immediate 初次是否立即执行
 */
export function debounce(func, wait, immediate) {
    let timeout, result;
    const debounced = function () {
        const context = this
        const args = arguments
        if (timeout) clearTimeout(timeout)
        if (immediate) {
            const callNow = !timeout // 这是因为即使clearTimeout timeout也不是空 而是个数字
            timeout = setTimeout(function () {
                timeout = null
            }, wait)
            if (callNow) result = func.call(context, args)
        } else {
            timeout = setTimeout(function () {
                result = func.call(context, args)
            }, wait)
        }
        return result
    }
    debounced.cancel = function () {
        clearTimeout(timeout)
        timeout = null
    }
    return debounced
}

/**
 * 获取文件路径后缀名
 * @param {String} url url字符串
 */
export function getFileSuffix(url) {
    //获取最后一个.的位置
    const index = url.lastIndexOf(".");
    //获取后缀
    const ext = url.substr(index + 1);
    return ext;
}

/**
 * 判断是否是图片格式
 * @param {String} url 图片url字符串
 */
export function isAssetTypeAnImage(url) {
    if (!url) return false;
    return ['png', 'jpg', 'jpeg', 'bmp', 'gif'].indexOf(getFileSuffix(url).toLowerCase()) !== -1;
}

/**
 * 比较两个时间的大小
 * @param {*} s 开始时间
 * @param {*} e 结束时间
 */
export function compareTime(s, e) {
    if(!s || s == '') return true
    if(!e || e == '') return true
    return e >= s
}

/**
 * 获取当前月份
 */
export function getCurrentMonth () {
    const date  = new Date()
    const yyyy = date.getFullYear()
    const month = date.getMonth() + 1
    const MM = month < 10 ? '0' + month : month
    return yyyy + '-' + MM
}
