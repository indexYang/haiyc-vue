import request from '../utils/request';

//获取字典信息列表
export const queryDictionaryType = params => {
    return request({
        url: 'dictionary/queryDictionaryType.htm',
        method: 'get',
        params: params
    });
};