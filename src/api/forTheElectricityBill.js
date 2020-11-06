import request from '../utils/request';

//获取对下用电账单信息列表
export const listForTheElectricityBill = params => {
    return request({
        url: 'forTheElectricityBill/listForTheElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//新增修改对下用电账单信息
export const addOrModifyStationForTheElectricityBill = params => {
    return request({
        url: 'forTheElectricityBill/addOrModifyStationForTheElectricityBill.do',
        method: 'post',
        params: params
    });
};

//获取对下账单信息详情
export const getStationForTheElectricityBill = params => {
    return request({
        url: 'forTheElectricityBill/getStationForTheElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//对下用电账单删除
export const delStationForTheElectricityBill = params => {
    return request({
        url: 'forTheElectricityBill/delStationForTheElectricityBill.do',
        method: 'post',
        params: params
    });
};