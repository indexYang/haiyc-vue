import request from '../utils/request';

//获取基站
export const listBaseStation = params => {
    return request({
        url: 'baseStation/listBaseStation.htm',
        method: 'get',
        params: params
    });
};

//新增修改基站信息
export const addOrModifyBaseStation = params => {
    return request({
        url: 'baseStation/addOrModifyBaseStation.do',
        method: 'post',
        params: params
    });
};

//获取所有的铁通合同列表
export const listAllContractInfo = params => {
    return request({
        url: 'contract/listAllContractInfo.htm',
        method: 'get',
        params: params
    });
};

//获取所有的是施工合同列表
export const listAllConstructionContractInfo = params => {
    return request({
        url: 'constructionContract/listAllConstructionContractInfo.htm',
        method: 'get',
        params: params
    });
};

//获取基站详情
export const getBaseStationInfo = params => {
    return request({
        url: 'baseStation/getBaseStationInfo.htm',
        method: 'get',
        params: params
    });
};

//基站信息删除
export const delBaseStation = params => {
    return request({
        url: 'baseStation/delBaseStation.do',
        method: 'post',
        params: params
    });
};