import request from '../utils/request';

//获取门户用电账单信息列表
export const listStationDoorNoElectricityBill = params => {
    return request({
        url: 'electricityBill/listStationDoorNoElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//新增修改门户用电账单信息
export const addOrModifyStationDoorNoElectricityBill = params => {
    return request({
        url: 'electricityBill/addOrModifyStationDoorNoElectricityBill.do',
        method: 'post',
        params: params
    });
};

//获取门户用电账单信息详情
export const getStationDoorNoElectricityBill = params => {
    return request({
        url: 'electricityBill/getStationDoorNoElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//门户信息用电账单删除
export const delStationDoorNoElectricityBill = params => {
    return request({
        url: 'electricityBill/delStationDoorNoElectricityBill.do',
        method: 'post',
        params: params
    });
};