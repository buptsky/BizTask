/*
 * 新员工入职step3表单
 * 组件用于本流程第三步骤（员工查看最后所有信息）本步骤只用于查看
 * 2017/10/14 gzj初测通过
 */
import {Button, Input, Row, Col, Icon, Tag} from 'antd';
import {connect} from 'react-redux';

const RowStyle = {marginBottom: 10, lineHeight: '28px'};
const ColorStyle = {color: '#108ee9'}

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
      <div>
        <Row style={{marginBottom: 24}}>
          <Col span={3} style={{textAlign: 'right'}}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={originData.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row style={{lineHeight: '28px'}}>
          <span style={ColorStyle}>{originData.formData.name}</span>
          （微信号：<span style={ColorStyle}>{originData.formData.weixin}</span>）
          （QQ号：<span style={ColorStyle}>{originData.formData.qq}</span>）
        </Row>
        <Row style={RowStyle}>
          申请开通SVN路径权限(前缀url：http://bizsvn.sogou-inc.com/svn/)：
        </Row>
        <Row style={{margin: '-5px 0 10px 0'}}>
          <div className="svn-tags" style={{marginLeft: 34, maxHeight: 150, overflow: 'auto'}}>
            {originData.formData.svn.map((tag, index) => {
              const tagElem = (
                <Tag key={tag}
                     style={{height: 28, lineHeight: '26px', marginTop: 10}}
                     color="#108ee9"
                >
                  {tag}
                </Tag>
              );
              return tagElem;
            })}
          </div>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          部门情况简介：
          <a href={originData.formData.depInfo}>{originData.formData.depInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          小组的对应简介：
          <a href={originData.formData.groupInfo}>{originData.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          小组特殊资料：
          <a href={originData.formData.groupSpec}>{originData.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          部门工作流程规范：
          <a href={originData.formData.groupDoc}>{originData.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          软件环境：
          <a href={originData.formData.software}>{originData.formData.software}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          下载公司办公app：
          <a href="https://xiaop.sogou-inc.com/">https://xiaop.sogou-inc.com/</a>
          <span style={{marginLeft: 10}}>并关注小P公众号bizwork</span>
        </Row>
        <Row style={RowStyle}>
          <div className="work-xiaop"></div>
        </Row>
        <Row style={RowStyle}>
          <Col style={{marginLeft: 34}}>
            <Button size="large" onClick={this.props.close}>取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep3;
