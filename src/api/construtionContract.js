import request from '../utils/request';

//获取施工合同信息列表
export const listConstructionContract = params => {
    return request({
        url: 'constructionContract/listConstructionContract.htm',
        method: 'get',
        params: params
    });
};

//新增修改施工合同信息
export const addOrModifyConstructionContract = data => {
    return request({
        url: 'constructionContract/addOrModifyConstructionContract.do',
        method: 'post',
        data
    });
};

//获取施工合同详情
export const getConstructionContract = params => {
    return request({
        url: 'constructionContract/getConstructionContract.htm',
        method: 'get',
        params: params
    });
};

//删除施工合同信息
export const delConstructionContract = params => {
    return request({
        url: 'constructionContract/delConstructionContract.do',
        method: 'post',
        params: params
    });
};
