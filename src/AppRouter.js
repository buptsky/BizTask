import {HashRouter, Route, Redirect, Link} from 'react-router-dom';
import {Layout} from 'antd';
import BizTaskHeader from './components/common/BizTaskHeader';
import ChargeTask from './components/task/ChargeTask';
import AttentionTask from './components/task/AttentionTask';
import DailyWorksheet from './components/workflow/DailyWorksheet';
import Report from './components/report/Report';

const AppRouter = (
  <HashRouter>
    <Layout className="main-layout">
      <BizTaskHeader/>
      <Route exact path="/" render={() => (<Redirect to="/workflow"/>)}/>
      {/*task*/}
      <Route path="/task/charge" component={ChargeTask}/>
      <Route path="/task/attention" component={AttentionTask}/>
      {/*workflow*/}
      <Route exact path="/workflow" render={() => (<Redirect to="/workflow/daily"/>)}/>
      <Route path="/workflow/daily" component={DailyWorksheet}/>
      {/*score*/}
      <Route path="/report" component={Report}/>
    </Layout>
  </HashRouter>
);
export default AppRouter;
