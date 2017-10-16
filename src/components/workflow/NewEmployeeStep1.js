/*
 * 新员工入职step1表单
 * 组件用于本流程本流程第一步骤（员工填写个人信息）编辑/查看 , 不用于审批
 * 2017/10/14 gzj初测通过
 */
import {Button, Input, Row, Col, Icon, Modal, notification} from 'antd';
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
      deleteVisible: false,
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
      notification.success({message: '操作成功!',duration: 2}); // 成功提示
      this.props.close(); // 关闭面板
      this.props.getFlowData(); // 成功后刷新流程列表数据
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
  /*需要确认下员工入职流程是否支持删除*/
  // 打开确认删除对话框
  showConfirmModal = () => {
    this.setState({deleteVisible: true});
  }
  // 确认删除流程
  confirmDelete = () => {
    this.setState({deleteVisible: false});
    this.handleSubmit(false);
  }
  // 取消删除流程
  cancelDelete = () => {
    this.setState({deleteVisible: false});
  }

  render() {
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
