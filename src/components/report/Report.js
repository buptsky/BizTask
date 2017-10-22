import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import ReportFilter from './ReportFilter';
import ReportOverall from './ReportOverall';
import ReportTable from './ReportTable';
import {Menu, Icon, Button} from 'antd';
import * as CommonActions from '../../actions/common';


@connect(
  state => ({}),
  dispatch => ({
    activeHeaderMenu: () => {
      dispatch(actionCreator('change_header_menu', 'report'));
    }
  })
)
class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      reportData: [],
      currentMenu: 'team-report'
    }
  }

  componentWillMount() {
    this.props.activeHeaderMenu('report');
    // 获取所有流程
    fetchData({
      url: '/report/getImportantReport.do',
      data: {}
    }).then((data) => {
      this.setState({
        reportData: data
      })
    });
  }

  switchMenu = (e) => {
    this.setState({currentMenu: e.key});
  }

  render() {
    return (
      <div style={{padding: '20px 30px'}} className="report">
        <ReportFilter/>
        <div className="report-select" style={{position: 'relative', width: '80%'}}>
          <Menu
            onClick={this.switchMenu}
            selectedKeys={[this.state.currentMenu]}
            style={{marginTop: 20}}
            mode="horizontal"
          >
            <Menu.Item key="team-report">
              <Icon type="team"/>小组周报
            </Menu.Item>
            <Menu.Item key="personal-report">
              <Icon type="user"/>个人周报
            </Menu.Item>
          </Menu>
          <Button type="primary"
                  icon="eye"
                  style={{position: 'absolute', top: 10, right: 33, height: 28}}
                  >周报预览
          </Button>
        </div>
        <ReportOverall/>
        <ReportTable data={this.state.reportData} title="重要项目进展"/>
        <ReportTable data={[]} title="其他项目进展"/>
      </div>
    );
  }
}

export default Report;