import {Button, Input, Row, Col, Icon} from 'antd';
import {connect} from 'react-redux';
import config from './WorkflowConfig';
// antd 组件配置

const RowStyle = {marginBottom: 24, lineHeight: '28px'};


@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({})
)
class NewEmployeeStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableAll: false
    }
  }

  componentWillMount() {
    if (!this.props.flowDetailData.canEdit) {
      this.setState({
        disableAll: true
      });
    }
  }
  // 提交表单
  onSubmit = () => {

  }

  render() {
    const data = this.props.flowDetailData;
    return (
      <div>
        <Row style={{marginBottom: 24}}>
          <Col span={6} style={{textAlign: 'right'}}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={data.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row style={{...RowStyle, color: '#108ee9'}}>
          欢迎入职biztech，入职准备工作如下:
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          准备一个qq号
          <Input style={{width: 165, margin: '0 10px'}} disabled={this.state.disableAll}/>
          ，用于leader下一步查看
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          联系直属leader邀请加入biztechQQ群，biztech邮件组
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          准备一个微信账号
          <Input style={{width: 165, margin: '0 10px'}} disabled={this.state.disableAll}/>
          ，用于加入部门微信群
        </Row>
        <Row style={RowStyle}>
          <Col style={{marginLeft: 34}}>
            <Button type="primary" size="large" onClick={this.onSubmit}>提交</Button>
            <Button style={{marginLeft: '20px'}} size="large">取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep1;
