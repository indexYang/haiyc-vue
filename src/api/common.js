import request from '../utils/request';

//获取省市区
export const listProvincesModel = params => {
    return request({
        url: 'common/listProvincesModel.htm',
        method: 'get',
        params: params
    });
};

