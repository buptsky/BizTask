import 'antd/dist/antd.css';
import ReactDom from 'react-dom';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import AppRouter from './AppRouter';
import reducer from './reducers/index'
// redux 状态调试
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(thunk)
));
//const store = createStore(rootReducer, applyMiddleware(thunk));
ReactDom.render(
    <Provider store={store}>
        {AppRouter}
    </Provider>,
    document.getElementById('app')
);
