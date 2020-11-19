import request from '../utils/request';

//获取网址信息列表
export const queryListUrlInfo = params => {
    return request({
        url: 'url/queryListUrlInfo.htm',
        method: 'get',
        params: params
    });
};

//新增修改网址信息
export const addOrModifyUrlInfo = params => {
    return request({
        url: 'url/addOrModifyUrlInfo.do',
        method: 'post',
        params: params
    });
};

//获取网址详情
export const getUrlInfo = params => {
    return request({
        url: 'url/getUrlInfo.htm',
        method: 'get',
        params: params
    });
};

//网址信息删除
export const delUrlInfo = params => {
    return request({
        url: 'url/delUrlInfo.do',
        method: 'post',
        params: params
    });
};