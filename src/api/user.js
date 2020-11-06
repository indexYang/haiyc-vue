import request from '../utils/request';

//获取用户的列表
export const listUsers = params => {
    return request({
        url: 'user/listUsers.htm',
        method: 'get',
        params: params
    });
};

//新增修改用户信息
export const addOrModifyUser = data => {
    return request({
        url: 'user/addOrModifyUser.do',
        method: 'post',
        data
    });
};

//获取用户详情
export const getUser = params => {
    return request({
        url: 'user/getUser.htm',
        method: 'get',
        params: params
    });
};

//用户信息删除
export const delUser = params => {
    return request({
        url: 'user/delUser.do',
        method: 'post',
        params: params
    });
};

//获取所有角色
export const listAllRoles = params => {
    return request({
        url: 'role/listAllRoles.htm',
        method: 'get',
        params: params
    });
};

//修改密码
export const doUpdatePwd = params => {
    return request({
        url: 'user/doUpdatePwd.do',
        method: 'post',
        params: params
    });
};

//重置密码
export const doResetPwd = params => {
    return request({
        url: 'user/doResetPwd.do',
        method: 'post',
        params: params
    });
};