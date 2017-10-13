import {Button, Input, Row, Col, Icon, Modal} from 'antd';
import {connect} from 'react-redux';
import {getFlowData} from '../../actions/workflow';
import {bindActionCreators} from 'redux';

const RowStyle = {marginBottom: 24, lineHeight: '28px'};

@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({
    getFlowData: bindActionCreators(getFlowData, dispatch)
  })
)
class NewEmployeeStep1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableAll: false,
      qq: '',
      weixin: ''
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
  handleSubmit = (flag) => {
    const originData = this.props.flowDetailData;
    console.log(originData);
    const formData = {
      step: originData.formData.step,
      qq: this.state.qq,
      weixin: this.state.weixin
    }
    const args = {
      flowId: originData.flowId,
      flowName: originData.flowName,
      taskId: originData.taskId,
      isPassed: flag,
      message: this.props.getMsg(),
      formData: JSON.stringify(formData)
    }
    // 数据提交
    fetchData({
      url: '/workflow/approve.do',
      data: args
    }).then((data) => {
      console.log('提交成功');
      // 成功后刷新流程列表数据
      this.props.getFlowData();
    });
  }
  // qq输入
  changeQQ = (e) => {
    this.setState({
      qq: e.target.value
    });
  }

  // 微信输入
  changeWeixin = (e) => {
    this.setState({
      weixin: e.target.value
    });
  }

  render() {
    console.log('render');
    const originData = this.props.flowDetailData;
    return (
      <div>
        <Row style={{marginBottom: 24}}>
          <Col span={6} style={{textAlign: 'right'}}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={originData.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row style={{...RowStyle, color: '#108ee9'}}>
          欢迎入职biztech，入职准备工作如下:
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          准备一个qq号
          <Input onChange={this.changeQQ} style={{width: 165, margin: '0 10px'}} disabled={this.state.disableAll}/>
          ，用于leader下一步查看
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          联系直属leader邀请加入biztechQQ群，biztech邮件组
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          准备一个微信账号
          <Input
            style={{width: 165, margin: '0 10px'}}
            disabled={this.state.disableAll}
            onChange={this.changeWeixin}
          />
          ，用于加入部门微信群
        </Row>
        <Row style={RowStyle}>
          <Col style={{marginLeft: 34}}>
            {/*审批权限*/}
            {
              originData.canAuthorize && (
                <Button type="primary" size="large" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  通过
                </Button>
              )
            }
            {
              originData.canAuthorize && (
                <Button type="danger" size="large" onClick={() => {
                  this.handleSubmit(false);
                }} style={{marginRight: '20px'}}>
                  拒绝
                </Button>
              )
            }
            {/*修改权限*/}
            {
              originData.canDelete && (
                <Button type="primary" size="large" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  提交
                </Button>
              )
            }
            {
              originData.canDelete && (
                <Button type="danger"
                        size="large"
                        onClick={this.showConfirmModal}
                        style={{marginRight: '20px'}}
                >
                  删除
                </Button>
              )
            }
            <Button size="large" onClick={this.props.close}>取消</Button>
            {/*删除流程确认*/}
            <Modal
              title="删除流程"
              visible={this.state.deleteVisible}
              onOk={this.confirmDelete}
              onCancel={this.cancelDelete}
              zIndex="2000"
            >
              <p style={{color: '#f04134',fontSize: 16}}>确认是否删除该流程（删除后不可找回）</p>
            </Modal>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep1;
