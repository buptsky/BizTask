import {
    HashRouter, Route
} from 'react-router-dom';
import {Layout} from 'antd';
import HeadMenu from './components/common/HeadMenu';
import Task from './components/task/Task';
import Score from './components/score/Score';
import Workflow from './components/workflow/Workflow';
const {Header} = Layout;

const AppRouter = (
    <HashRouter>
        <Layout>
            <Header className="">
                <HeadMenu/>
            </Header>
            <Route path="/task" component={Task}/>
            <Route path="/workflow" component={Workflow}/>
            <Route path="/score" component={Score}/>
        </Layout>
    </HashRouter>
);
export default AppRouter;
