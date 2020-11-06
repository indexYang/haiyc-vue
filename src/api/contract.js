import request from '../utils/request';

//获取铁通合同信息列表
export const listContractInfo = params => {
    return request({
        url: 'contract/listContractInfo.htm',
        method: 'get',
        params: params
    });
};

//新增修改铁通合同信息
export const addOrModifyContractInfo = data => {
    return request({
        url: 'contract/addOrModifyContractInfo.do',
        method: 'post',
        data
    });
};

//获取铁通合同详情
export const getContractInfo = params => {
    return request({
        url: 'contract/getContractInfo.htm',
        method: 'get',
        params: params
    });
};

//删除铁通合同信息
export const delContract = params => {
    return request({
        url: 'contract/delContractInfo.do',
        method: 'post',
        params: params
    });
};
