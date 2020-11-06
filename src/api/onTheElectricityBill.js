import request from '../utils/request';

//获取对上用电账单信息列表
export const listOnTheElectricityBill = params => {
    return request({
        url: 'onTheElectricityBill/listOnTheElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//新增修改对上用电账单信息
export const addOrModifyStationOnTheElectricityBill = params => {
    return request({
        url: 'onTheElectricityBill/addOrModifyStationOnTheElectricityBill.do',
        method: 'post',
        params: params
    });
};

//获取对上用电账单信息详情
export const getStationOnTheElectricityBill = params => {
    return request({
        url: 'onTheElectricityBill/getStationOnTheElectricityBill.htm',
        method: 'get',
        params: params
    });
};

//对上信息用电账单删除
export const delStationOnTheElectricityBill = params => {
    return request({
        url: 'onTheElectricityBill/delStationOnTheElectricityBill.do',
        method: 'post',
        params: params
    });
};