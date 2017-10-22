import 'antd/dist/antd.css';
import '../asset/css/app.less';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import AppRouter from './AppRouter';
import reducer from './reducers/index';
import fetchData from './utils/fetch-data';
window.fetchData = fetchData;
// 设置 moment locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
/*系统localStorage*/
storeJS.set('bizTask',{...storeJS.get('bizTask')});
/*redux 状态调试*/
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
  applyMiddleware(thunk)
));
//const store = createStore(reducer, applyMiddleware(thunk));
ReactDom.render(
  <Provider store={store}>
    {AppRouter}
  </Provider>,
  document.getElementById('app')
);