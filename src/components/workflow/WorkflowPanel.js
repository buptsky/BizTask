import {Select, Input, Row, Col, Popover, Button} from 'antd';
import WorkflowTimeline from './WorkflowTimeline';
import SvnPermissionForm from './SvnPermissionForm';
import SvnApplyForm from './SvnApplyForm';
import NewEmployeeForm from './NewEmployeeForm';
import {connect} from 'react-redux';
// antd 组件配置
const {TextArea} = Input;
const Option = Select.Option;

@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({})
)
class WorkflowPanel extends React.Component {
  constructor(props) {
    super(props);
    // 这里手动指定了flownamePrefix的默认值,以后可能会动态获取
    this.state = {
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      currentFlowType: '102', // 当前的流程类型
      message: '', // 本次操作的留言
    }
  }

  componentWillMount() {
    // 判断当前是新建流程还是查看/修改流程
    if (this.props.flowDetailData.flowTypeId) { // 非新建流程
      this.setState({
        currentFlowType: this.props.flowDetailData.flowTypeId.toString(),
      });
      if (!this.props.flowDetailData.canEdit) { // 不可编辑
        this.setState({
          disableAll: true
        });
      }
    }
  }

  // 切换流程类型,流程名称前缀联动
  changeType = (value) => {
    // 获取流程类型名称
    this.setState({
      currentFlowType: value,
      message: '' // 重置留言
    });
  }
  // 记录留言以备表单提交
  changeMessage = (e) => {
    this.setState({message: e.target.value});
  }
  // 获取留言内容
  getMessage = () => {
    return this.state.message;
  }

  render() {
    const {flowTypes, flowDetailData} = this.props;
    const onlyWatch = (flowDetailData.canAuthorize === false && flowDetailData.canDelete === false); // 是否只有查看权限，利用false判断是为了规避undefined
    let availableTypes = [];
    let selectWidth = '100%';
    let flowWatch = '';
    // 如果是新建流程模式，则不添加新员工入职选项
    if (!flowDetailData.flowTypeId) {
      availableTypes = flowTypes.filter((type) => type.flowTypeId !== 201);
    } else { // 留出流程查看的空间
      availableTypes = flowTypes;
      selectWidth = '60%';
      let content = (
        <div>
          <img src={flowDetailData.flowImageUrl} style={{width: 582, height: 236}}></img>
        </div>
      );
      // 查看流程
      flowWatch = (
        <Popover placement="bottom" title="流程示意图" content={content} trigger="click">
          <Button size="large" type="primary">查看流程图</Button>
        </Popover>
      )
    }
    // 新建流程下拉列表选项
    const workflowSelectItem = (
      availableTypes.map((type) => {
        return (<Option key={type.flowTypeId} value={type.flowTypeId.toString()}>{type.flowTypeName}</Option>);
      })
    );
    // 根据流程类型选取对应表单
    let flowForm = '';
    switch (this.state.currentFlowType) {
      case '101':
        flowForm = (
          <SvnApplyForm getMsg={this.getMessage} close={this.props.close}/>
        )
        break;
      case '102':
        flowForm = (
          <SvnPermissionForm getMsg={this.getMessage} close={this.props.close}/>
        )
        break;
      case '201':
        flowForm = (
          <NewEmployeeForm getMsg={this.getMessage} close={this.props.close}/>
        )
        break;
    }

    return (
      <div className="workflow-panel">
        <Row>
          {/*左侧表单*/}
          <Col span={12} className="panel-left">
            {/*工作流程选项框*/}
            <Row style={{marginBottom: 24}}>
              <Col span={this.state.currentFlowType === '201'? 3 : 6}
                   style={{textAlign: this.state.currentFlowType === '201' ? 'left ':'right'}}
              >
                <div className="ant-form-item-label">
                  <label htmlFor="create-type" title="工作流程">工作流程</label>
                </div>
              </Col>
              <Col span={16} offset={1}>
                {/*保证默认选中异步返回的请求数据*/}
                {
                  this.props.flowTypes.length ?
                    (
                      <div className="">
                        <Select
                          style={{width: selectWidth, marginRight: 10}}
                          className="create-type"
                          defaultValue="102"
                          value={this.state.currentFlowType}
                          onSelect={this.changeType}
                          disabled={
                            this.state.disableAll ||
                            flowDetailData.canDelete ||
                            flowDetailData.canAuthorize
                          }
                        >
                          {workflowSelectItem}
                        </Select>
                        {flowWatch}
                      </div>
                    ) : null
                }
              </Col>
            </Row>
            {/*表单内容*/}
            <Row>
              {flowForm}
            </Row>
          </Col>
          {/*右侧时间线和留言*/}
          <Col span={10} offset={2} className="panel-right">
            <div className="time-line-wrapper">
              <WorkflowTimeline data={this.props.flowDetailData.nodeList || null}/>
              {/*由于难以达到要求的表单布局，此项目单独拆开，表单提交时记得加上*/}
              {/*只有查看权限的的情况不展示*/}
              {
                !onlyWatch && (
                  <TextArea rows={4}
                            value={this.state.message}
                            className="note"
                            placeholder="你可以在这里留言"
                            onChange={this.changeMessage}
                  />
                )
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default WorkflowPanel;
