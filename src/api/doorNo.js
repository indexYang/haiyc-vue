import request from '../utils/request';

//获取门户信息列表
export const listStationDoorNoInfo = params => {
    return request({
        url: 'doorNo/listStationDoorNoInfo.htm',
        method: 'get',
        params: params
    });
};

//新增修改门户信息
export const addOrModifyStationDoorNoInfo = params => {
    return request({
        url: 'doorNo/addOrModifyStationDoorNoInfo.do',
        method: 'post',
        params: params
    });
};

//获取所有的基站信息
export const listAllBaseStation = params => {
    return request({
        url: 'baseStation/listAllBaseStation.htm',
        method: 'get',
        params: params
    });
};

//获取门户信息详情
export const getStationDoorNoInfo = params => {
    return request({
        url: 'doorNo/getStationDoorNoInfo.htm',
        method: 'get',
        params: params
    });
};

//门户信息删除
export const delStationDoorNoInfo = params => {
    return request({
        url: 'doorNo/delStationDoorNoInfo.do',
        method: 'post',
        params: params
    });
};