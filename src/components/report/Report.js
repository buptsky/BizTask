import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import ReportOverall from './ReportOverall';
import ReportTable from './ReportTable';
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
      reportData: []
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

  render() {
    return (
      <div style={{padding: '20px 30px'}}>
        <ReportOverall/>
        周报列表操作交互演示
        <ReportTable data={this.state.reportData}/>
      </div>
    );
  }
}

export default Report;