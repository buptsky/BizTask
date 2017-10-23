import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import ReportFilter from './ReportFilter';
import ReportOverall from './ReportOverall';
import ReportTable from './ReportTable';
import ReportPreview from './ReportPreview';
import {Menu, Icon, Button, Modal} from 'antd';
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
      currentMenu: 'team-report',
      modalVisible: false,
      importantData: []
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
  // 周报预览
  previewReport = () => {
    this.setState({
      importantData: this.reportTable.collectData(),
      modalVisible: true
    });
    console.log(this.reportOverAll.collectData());
  }
  // 确认发送周报
  confirmSend = () => {
    this.reportPreview.getTableHtml();
  }
  // 取消发送周报
  cancelSend = () => {
    this.setState({modalVisible: false});
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
                  onClick={this.previewReport}
                  icon="eye"
                  style={{position: 'absolute', top: 10, right: 33, height: 28}}
                  >周报预览
          </Button>
        </div>
        <ReportOverall ref={(value) => {this.reportOverAll = value}}/>
        <ReportTable data={this.state.reportData}
                     title="重要项目进展"
                     ref={(value) => {this.reportTable = value}}
        />
        <ReportTable data={[]} title="其他项目进展"/>
        <Modal
          title="周报预览"
          visible={this.state.modalVisible}
          onOk={this.confirmSend}
          okText={'发送'}
          cancelText={'取消'}
          onCancel={this.cancelSend}
          width={'70%'}
        >
          <ReportPreview
            ref={(value) => {this.reportPreview = value}}
            importantData={this.state.importantData}
          />
        </Modal>
      </div>
    );
  }
}

export default Report;