import axios from 'axios';
import {
    Message,
    Notification
} from 'element-ui'
import router from '../router';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 20000
});

// post不提示白名单
const whiteList = [] 

service.interceptors.request.use(
    config => {
		let loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
		if(loginInfo){
			let token  = loginInfo.token;
			if(token){
				config.headers['token'] = token;
			}
		}
        return config;
    },
    error => {
        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
		const { method, url } = response.config;
		const res = response.data;
        if (response.status === 200) {
			if(res.code != 1){
				if(res.code == 10001 || res.code == 10002 || res.code == 10003 || res.code == 10004  ){
					Message.error(res.message);
					router.push({ path: "/login" });
					return;
				}else{
					Notification({
					    type: 'error',
					    position: 'bottom-right',
					    customClass: 'notification-error',
					    duration: 3000,
					    offset: 50,
					    title: '操作提醒',
					    message: res.message ? res.message : '操作失败！'
					})
					return Promise.reject();
				}
			}else{
				if (method == 'post') {
				    if(whiteList.indexOf(url) == -1) {
				        Notification({
				            type: 'success',
				            position: 'bottom-right',
				            duration: 3000,
				            customClass: 'notification-success',
				            offset: 50,
				            title: '操作提醒',
				            message: res.msg ? res.msg : '操作成功！'
				        })
				    }
				}
				return res;
			}
            
        } else {
            Promise.reject();
        }
    },
    error => {
        return Promise.reject();
    }
);

export default service;
