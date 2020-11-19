import request from '../../utils/request';

//获取卡会员信息列表
export const listCarCardInfo = params => {
    return request({
        url: 'card/listCarCardInfo.htm',
        method: 'get',
        params: params
    });
};

//新增修改卡会员信息
export const addOrModifyCarCardInfo = params => {
    return request({
        url: 'card/addOrModifyCarCardInfo.do',
        method: 'post',
        params: params
    });
};

//获取卡会员详情
export const getCarCardInfo = params => {
    return request({
        url: 'card/getCarCardInfo.htm',
        method: 'get',
        params: params
    });
};

//删除卡会员信息
export const delCarCardInfo = params => {
    return request({
        url: 'card/delCarCardInfo.do',
        method: 'post',
        params: params
    });
};
