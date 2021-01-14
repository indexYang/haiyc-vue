import request from '../../utils/request';

//获取项目信息列表
export const listCarProjectInfo = params => {
    return request({
        url: 'project/listCarProjectInfo.htm',
        method: 'get',
        params: params
    });
};

//新增修改项目信息
export const addOrModifyCarProjectInfo = params => {
    return request({
        url: 'project/addOrModifyCarProjectInfo.do',
        method: 'post',
        params: params
    });
};

//获取项目详情
export const getCarProjectInfo = params => {
    return request({
        url: 'project/getCarProjectInfo.htm',
        method: 'get',
        params: params
    });
};

//删除项目信息
export const delCarProjectInfo = params => {
    return request({
        url: 'project/delCarProjectInfo.do',
        method: 'post',
        params: params
    });
};

//获取所有项目信息
export const findAllCarProjectInfo = params => {
    return request({
        url: 'project/findAllCarProjectInfo.htm',
        method: 'get',
        params: params
    });
};