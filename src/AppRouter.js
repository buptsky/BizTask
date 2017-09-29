import {
  HashRouter, Route, Redirect, Link
} from 'react-router-dom';
import {Layout} from 'antd';
import HeadMenu from './components/common/HeadMenu';
import ChargeTask from './components/task/ChargeTask';
import AttentionTask from './components/task/AttentionTask';
import DailyWorksheet from './components/workflow/DailyWorksheet';
import Score from './components/score/Score';

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
      <Route exact path="/" render={() => (<Redirect to="/workflow"/>)}/>
      {/*task*/}
      <Route exact path="/task" render={() => (<Redirect to="/task/charge"/>)}/>
      <Route path="/task/charge" component={ChargeTask}/>
      <Route path="/task/attention" component={AttentionTask}/>
      {/*workflow*/}
      <Route exact path="/workflow" render={() => (<Redirect to="/workflow/daily"/>)}/>
      <Route path="/workflow/daily" component={DailyWorksheet}/>
      {/*score*/}
      <Route path="/score" component={Score}/>
    </Layout>
  </HashRouter>
);
export default AppRouter;
