import request from '../utils/request';

export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};

//获取左侧的菜单
export const rolePermissions = params => {
    return request({
        url: 'user/userRolePermission.htm',
        method: 'get'
    });
};

//退出
export const loginout = params => {
    return request({
        url: '/logout',
        method: 'post'
    });
};
