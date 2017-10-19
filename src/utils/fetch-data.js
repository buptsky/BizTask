import axios from 'axios';
import {message, notification} from 'antd';

let instance = axios.create();
instance.defaults.timeout = 10000;
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const fetchData = (options) => {
  return instance({
    method: options.method || 'post',
    url: `/dispatch${options.url}`,
    data: options.data
  }).then(response => {
    const responseData = response.data;
    if (responseData.errno === 0) {
      /*if(respData.msgs && respData.msgs.length > 0){
        notification.success({
          message: '提示信息',
          description: respData.msgs.join(',')
        });
      }*/
      return responseData.data;
    } else if (responseData.errno === 103) { //session无效，重新登录
      window.location.reload();
    } else {
      notification.error({
        message: '错误信息',
        description: responseData.errmsg
      });
    }
  }).catch(error => {
    if (error instanceof Error) {
      // Something happened in setting up the request that triggered an Error
      notification.error({
        message: '错误信息',
        description: error.message
      });
    } else {
      // The request was made, but the server responded with a status code
      // that falls out of the range of 2xx
      message.error(`请求：${options.url}，状态: ${error.statusText}`);
    }
    return Promise.reject(error);
  });

};

export default fetchData;
