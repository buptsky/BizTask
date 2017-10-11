import {Select, Input, Row, Col} from 'antd';
import WorkflowTimeline from './WorkflowTimeline';
import SvnPermissionForm from './SvnPermissionForm';
import SvnApplyForm from './SvnApplyForm';
import NewEmployeeForm from './NewEmployeeForm';
// antd 组件配置
const {TextArea} = Input;
const Option = Select.Option;

class WorkflowPanel extends React.Component {
  constructor(props) {
    super(props);
    // 这里手动指定了flownamePrefix的默认值,以后可能会动态获取
    this.state = {
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      flowTypes: [], // 所有流程
      currentFlowType: '102', // 当前的流程类型
      message: '', // 本次操作的留言
    }
  }

  componentWillMount() {
    const flowTypes = [];
    // 获取所有流程
    fetchData({
      url: '/workflow/getFlowTypes.do',
      data: {}
    }).then((data) => {
      data.forEach((flowType) => {
        flowType['subFlowTypeList'].forEach((subFlowType) => {
          // 如果是新建流程模式，则不添加新员工入职选项
          if (this.props.data.flowTypeId || subFlowType.flowTypeId !== 201) {
            flowTypes.push(subFlowType);
          }
        });
      });
      this.setState({
        flowTypes
      });
    });
    // 判断当前是新建流程还是查看/修改流程
    if (this.props.data.flowTypeId) { // 非新建流程
      this.setState({
        currentFlowType: this.props.data.flowTypeId.toString(),
      });
      if (!this.props.data.canEdit) { // 不可编辑
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

  render() {
    const {flowTypes, data} = this.props;
    let availableTypes = [];
    // 如果是新建流程模式，则不添加新员工入职选项
    if (!data.flowTypeId) {
      availableTypes = flowTypes.filter((type) => type.flowTypeId !== 201);
    } else {
      availableTypes = flowTypes;
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
          <SvnApplyForm data={this.props.data} message={this.state.message} close={this.props.close}/>
        )
        break;
      case '102':
        flowForm = (
          <SvnPermissionForm data={this.props.data} message={this.state.message} close={this.props.close}/>
        )
        break;
      case '201':
        flowForm = (
          <NewEmployeeForm data={this.props.data} message={this.state.message}/>
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
              <Col span={6} style={{textAlign: 'right'}}>
                <div className="ant-form-item-label">
                  <label htmlFor="create-type" title="工作流程">工作流程</label>
                </div>
              </Col>
              <Col span={16} offset={1}>
                {/*保证默认选中异步返回的请求数据*/}
                {
                  this.state.flowTypes.length ?
                    (
                      <Select
                        style={{width: '100%'}}
                        className="create-type"
                        defaultValue="102"
                        value={this.state.currentFlowType}
                        onSelect={this.changeType}
                        disabled={this.state.disableAll}
                      >
                        {workflowSelectItem}
                      </Select>
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
              <WorkflowTimeline data={this.props.data.nodeList || null}/>
              {/*由于难以达到要求的表单布局，此项目单独拆开，表单提交时记得加上*/}
              {
                !this.state.disableAll && (
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
