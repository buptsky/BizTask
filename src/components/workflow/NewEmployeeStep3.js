/*
 * 新员工入职step3表单
 * 组件用于本流程第三步骤（员工查看最后所有信息）本步骤只用于查看
 * 2017/10/14 gzj初测通过
 */
import {Button, Input, Row, Col, Icon, Tag} from 'antd';
import {connect} from 'react-redux';

@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({})
)
class NewEmployeeStep3 extends React.Component {
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

  render() {
    const originData = this.props.flowDetailData;
    return (
      <div className="employee-step3">
        {/*流程名称样式与antd-form组件样式协同*/}
        <Row className="employee-item" style={{marginBottom: 24}}>
          <Col span={3} style={{textAlign: 'right'}}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={originData.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row className="employee-item" style={{marginBottom: 0}}>
          <span className="employee-info" style={{paddingLeft: 0}}>{originData.formData.name}</span>
          （微信号：<span className="employee-info">{originData.formData.weixin}</span>）
          （QQ号：<span className="employee-info">{originData.formData.qq}</span>）
        </Row>
        <Row className="employee-item">
          申请开通SVN路径权限(前缀url：http://bizsvn.sogou-inc.com/svn/)：
        </Row>
        <Row className="employee-item" style={{margin: '-5px 0 10px 0'}}>
          <div className="svn-tags">
            {originData.formData.svn.map((tag, index) => {
              const tagElem = (
                <Tag key={tag}
                     className="svn-tag-item"
                     color="#108ee9"
                >
                  {tag}
                </Tag>
              );
              return tagElem;
            })}
          </div>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          部门情况简介：
          <a href={originData.formData.depInfo} target="_blank">{originData.formData.depInfo}</a>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          小组的对应简介：
          <a href={originData.formData.groupInfo} target="_blank">{originData.formData.groupInfo}</a>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          小组特殊资料：
          <a href={originData.formData.groupSpec} target="_blank">{originData.formData.groupInfo}</a>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          部门工作流程规范：
          <a href={originData.formData.groupDoc} target="_blank">{originData.formData.groupInfo}</a>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          软件环境：
          <a href={originData.formData.software} target="_blank">{originData.formData.software}</a>
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          下载公司办公app：
          <a href="https://xiaop.sogou-inc.com/" className="employee-info" target="_blank">https://xiaop.sogou-inc.com/</a>
          <span>并关注小P公众号bizwork</span>
        </Row>
        <Row className="employee-item">
          <div className="work-xiaop"></div>
        </Row>
        <Row className="employee-item">
          <Col className="employee-btn-wrapper">
            <Button className="employee-btn" size="large" onClick={this.props.close}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep3;
