import request from '../../utils/request';

//获取卡会员等级信息列表
export const listCarCardLevel = params => {
    return request({
        url: 'carCardLevel/listCarCardLevel.htm',
        method: 'get',
        params: params
    });
};

//新增修改卡会员等级信息
export const addOrModifyCarCardLevel = params => {
    return request({
        url: 'carCardLevel/addOrModifyCarCardLevel.do',
        method: 'post',
        params: params
    });
};

//获取卡会员等级详情
export const getCarCardLevel = params => {
    return request({
        url: 'carCardLevel/getCarCardLevel.htm',
        method: 'get',
        params: params
    });
};

//删除卡会员等级信息
export const delCarCardLevel = params => {
    return request({
        url: 'carCardLevel/delCarCardLevel.do',
        method: 'post',
        params: params
    });
};
