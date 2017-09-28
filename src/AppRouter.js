import {
    HashRouter, Route, Redirect, Link
} from 'react-router-dom';
import {Layout} from 'antd';
import HeadMenu from './components/common/HeadMenu';
import ChargeTask from './components/task/ChargeTask';
import AttentionTask from './components/task/AttentionTask';

import Score from './components/score/Score';
import Workflow from './components/workflow/Workflow';
const {Header} = Layout;

const AppRouter = (
    <HashRouter>
        <Layout className="main-layout">
            <Header>
                <Link to="/">
                    <div className="logo"/>
                </Link>
                <HeadMenu/>
            </Header>
            <Route exact path="/" render={()=>(<Redirect to="/workflow"/>)}/>
            <Route exact path="/task" render={()=>(<Redirect to="/task/charge"/>)}/>
            <Route path="/task/charge" component={ChargeTask}/>
            <Route path="/task/attention" component={AttentionTask}/>
            <Route path="/workflow" component={Workflow}/>
            <Route path="/score" component={Score}/>
        </Layout>
    </HashRouter>
);
export default AppRouter;
