import {Button, Input, Row, Col, Icon, Tag} from 'antd';
import {connect} from 'react-redux';
import config from './WorkflowConfig';
// antd 组件配置

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
  // 提交表单
  onSubmit = () => {
    console.log(this.props.getMsg());
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
        <Row style={{lineHeight: '28px'}}>
          <span style={ColorStyle}>{data.formData.name}</span>
          （微信号：<span style={ColorStyle}>{data.formData.weixin}</span>）
          （QQ号：<span style={ColorStyle}>{data.formData.qq}</span>）
        </Row>
        <Row style={RowStyle}>
          申请开通SVN路径权限(前缀url：http://bizsvn.sogou-inc.com/svn/)：
        </Row>
        <Row style={{margin: '-5px 0 10px 0'}}>
          <div className="svn-tags" style={{marginLeft: 34, maxHeight: 150, overflow: 'auto'}}>
            {data.formData.svn.map((tag, index) => {
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
          <a href={data.formData.depInfo}>{data.formData.depInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          小组的对应简介：
          <a href={data.formData.groupInfo}>{data.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          小组特殊资料：
          <a href={data.formData.groupSpec}>{data.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          部门工作流程规范：
          <a href={data.formData.groupDoc}>{data.formData.groupInfo}</a>
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          软件环境：
          <a href={data.formData.software}>{data.formData.software}</a>
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
            <Button type="primary" size="large" onClick={this.onSubmit}>提交</Button>
            <Button style={{marginLeft: '20px'}} size="large">取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep3;
