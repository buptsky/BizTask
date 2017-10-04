import {Icon, Button, Form, Select, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col} from 'antd';
import Panel from '../common/panel/panel';
import WorkflowTimeline from './WorkflowTimeline';
import config from './WorkflowConfig';
// antd 组件配置
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
// 表单样式结构配置
// 标签 + 输入
const formItemLayout = {
  labelCol: {span: 6},
  wrapperCol: {span: 16, offset: 1}
}
// 仅输入
const formItemLayout2 = {
  wrapperCol: {span: 16, offset: 7}
}
// 可选check(暂时放在这里，以后根据情况调整）
const checkOptions = [
  {label: '涉及财务、资金、计费、管理权限等', value: 'limit'},
  {label: '需要404审计', value: '404'}
];
// 时间轴数据测试（以后用mock）
const nodeList = [
  {name: "发起申请", employee: "陈曦", dateTime: "2017-09-28 19:26:24", status: "已完成", remarks: ""},
  {name: "leader审批", employee: "陈曦", dateTime: "2017-09-28 19:26:24", status: "同意", remarks: "【系统提醒】小组leader申请系统默认通过。"},
  {name: "仓库管理员审批", employee: "夏先波", dateTime: null, status: null, remarks: null}
]

class WorkflowCreate extends React.Component {
  constructor(props) {
    super(props);
    // 这里手动指定了flownamePrefix的默认值,以后可能会动态获取
    this.state = {
      managerTags: [],
      permissionTags: [],
      flownamePrefix: `svn权限分配-`,
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/',
      disableInput: false, // 申请流程中禁用流程名称输入框
      managerInputVisible: false, // 隐藏添加仓库管理员输入
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写' // 当前权限人员的权限类型
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    this.textInput.focus();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  // 切换流程类型,流程名称前缀联动
  changeType = (value) => {
    let newName = '';
    let disableInput = false;
    config.createType.forEach((item) => {
      if (item.value === value) {
        newName = item.title;
      }
    });
    if (value !== 'svn-allot') {
      disableInput = true;
    }
    this.setState({
      flownamePrefix: `${newName}-`,
      disableInput: disableInput
    })
    console.log(value);
  }
  // 隐藏仓库名input前缀
  hidePrefix = () => {
    // 由于改变input组件的前缀会使其失去焦点，所以这里需要再次触发focus使其重获焦点
    // 而setState的更新是异步更新，所以需要在更新成功后的回调中进行焦点的再次获取
    this.setState({storenamePrefix: ''}, () => {
      this.textInput.focus();
    });
  }
  // 显示仓库名input前缀
  showPrefix = () => {
    this.setState({
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/'
    });
  }
  // 同步输入 （可能影响性能，可优化）
  syncInput = (e) => {
    this.props.form.setFieldsValue({
      'create-name': e.target.value
    })
  }
  // 取消创建流程，关闭面板
  createCancel = () => {
    this.props.close();
    console.log('panel cancel');
  }
  // 显示添加仓库管理员输入框
  showManagerInput = () => {
    this.setState({managerInputVisible: true}, () => {
      this.managerInput.focus();
    });
  }
  // 隐藏添加仓库管理员输入框
  hideManagerInput = () => {this.setState({managerInputVisible: false});}
  // 显示添加权限人员输入框
  showPermissionInput = () => {
    this.setState({permissionInputVisible: true}, () => {
      this.permissionInput.focus();
    });
  }
  // 隐藏添加权限人员输入框
  hidePermissionInput = () => {this.setState({permissionInputVisible: false});}
  // 查找符合条件的管理员(暂时不使用默认的自动补全)
  searchManager = () => {

  }
  // 添加选中管理员
  confirmManager = (value) => {
    let tags = this.state.managerTags;
    if (value && tags.indexOf(value) === -1) {
      tags = [...tags, value];
    }
    console.log(tags);
    this.setState({
      managerTags: tags,
      managerInputVisible: false,
    });
  }
  // 删除管理员
  deleteManager = (removedTag) => {
    console.log(removedTag);
    const tags = this.state.managerTags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({managerTags: tags});
  }
  // 添加选中权限人员
  confirmPermission = (value) => {
    let tags = this.state.permissionTags;
    if (value && tags.indexOf(value) === -1) {
      tags = [...tags, `${value} ${this.state.permissionType}`];
    }
    console.log(tags);
    this.setState({
      permissionTags: tags,
      permissionInputVisible: false,
    });
  }
  // 删除权限人员
  deletePermission = (removedTag) => {
    console.log(removedTag);
    const tags = this.state.permissionTags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({permissionTags: tags})
  }
  // 切换分配权限的类型
  changePermission = (e) => {
    this.setState({permissionType: e.target.value})
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const workflowSelectItem = (
      config.createType.map((type) => {
        return (<Option key={type.value} value={type.value}>{type.title}</Option>);
      })
    );

    return (
      <Panel cancel={this.createCancel}
             disableBtn={true}
             panelTitle="创建流程"
      >
        {/*注意Form中字段没有按照实际情况配置，仅做测试使用*/}
        <Form
          onSubmit={this.handleSubmit}
          style={{width: '50%', marginRight: '60px', display: 'inline-block'}}
        >
          {/*工作流程*/}
          <FormItem label="工作流程" {...formItemLayout}>
            {/*这里手动指定了默认初始value,以后可能会动态获取*/}
            {getFieldDecorator('create-type', {initialValue: 'svn-allot'})(
              <Select onChange={this.changeType}>
                {workflowSelectItem}
              </Select>
            )}
          </FormItem>
          {/*流程名称*/}
          <FormItem label="流程名称" {...formItemLayout}>
            {getFieldDecorator('create-name', {initialValue: ''})(
              <Input
                addonBefore={this.state.flownamePrefix}
                disabled={this.state.disableInput}
              />
            )}
          </FormItem>
          {/*仓库名称*/}
          <FormItem label="仓库名称" {...formItemLayout}>
            {getFieldDecorator('storage-name', {initialValue: ''})(
              <Input addonBefore={this.state.storenamePrefix}
                     onFocus={this.hidePrefix}
                     onBlur={this.showPrefix}
                     onChange={this.syncInput}
                     ref={(input) => {
                       this.textInput = input;
                     }}
              />
            )}
          </FormItem>
          {/*仓库管理员*/}
          <FormItem label="仓库管理员" {...formItemLayout} style={{marginBottom: 0}}>
            {/*隐藏的input用于记录表单数据*/}
            {getFieldDecorator('storage-manager', {initialValue: ''})(
              <Input type="hidden"/>
            )}
            {this.state.managerInputVisible && (
              <AutoComplete
                children={
                  <Input
                    ref={(input) => this.managerInput = input}
                    onBlur={this.hideManagerInput}
                  />
                }
                dataSource={['当当', '淡淡的', '当当的']}
                onSearch={this.searchManager}
                onSelect={this.confirmManager}
              />
            )}
            {!this.state.managerInputVisible &&
            <Button type="dashed" onClick={this.showManagerInput}>+ 新增管理员</Button>}
          </FormItem>
          {/*仓库新增管理员显示*/}
          <Row style={{margin: '10px 0 20px 0'}}>
            <Col span={16} offset={7}>
              <div className="manager-tags">
                {this.state.managerTags.map((tag, index) => {
                  const tagElem = (
                    <Tag key={tag}
                         style={{fontSize: 16, height: 28, lineHeight: '25px'}}
                         color="#108ee9"
                         closable={true}
                         afterClose={() => this.deleteManager(tag)}
                    >
                      {tag}
                    </Tag>
                  );
                  return tagElem;
                })}
              </div>
            </Col>
          </Row>
          {/*仓库功能描述*/}
          <FormItem label="仓库功能描述" style={{marginBottom: '5px'}} {...formItemLayout}>
            {getFieldDecorator('storage-desc', {initialValue: ''})(
              <TextArea rows={4} style={{resize: 'none'}}></TextArea>
            )}
          </FormItem>
          {/*功能描述多选框*/}
          <FormItem  {...formItemLayout2}>
            {getFieldDecorator('check-opt', {
              initialValue: [],
            })(
              <CheckboxGroup options={checkOptions}/>
            )}
          </FormItem>
          {/*默认添加权限*/}
          <FormItem label="默认给谁添加权限" style={{marginBottom: '5px'}} {...formItemLayout}>
            {getFieldDecorator('default-add', {initialValue: ''})(
              <Input type="hidden"/>
            )}
            {this.state.permissionInputVisible && (
              <AutoComplete
                children={
                  <Input
                    ref={(input) => this.permissionInput = input}
                    onBlur={this.hidePermissionInput}
                  />
                }
                dataSource={['当', '淡', '的']}
                onSearch={this.searchManager}
                onSelect={this.confirmPermission}
                style={{width: '50%'}}
              />
            )}
            {!this.state.permissionInputVisible &&
            <Button type="dashed" onClick={this.showPermissionInput}>+ 新增成员</Button>}
            {/*权限描述*/}
            <RadioGroup defaultValue={"读写"}
                        onChange={this.changePermission}
                        style={{paddingLeft: '30px'}}
            >
              <Radio value="读写">读写</Radio>
              <Radio value="只读">只读</Radio>
            </RadioGroup>
          </FormItem>
          {/*权限描述*/}
          {/*<FormItem {...formItemLayout2}>*/}
          {/*{getFieldDecorator('read-write', {initialValue: 'readAndWirte'})(*/}
          {/*<RadioGroup>*/}
          {/*<Radio value="readAndWirte">读写</Radio>*/}
          {/*<Radio value="onlyRead">只读</Radio>*/}
          {/*</RadioGroup>*/}
          {/*)}*/}
          {/*</FormItem>*/}
          {/*新增权限人员显示*/}
          <Row style={{margin: '10px 0 20px 0'}}>
            <Col span={16} offset={7}>
              <div className="permission-tags">
                {this.state.permissionTags.map((tag, index) => {
                  const tagElem = (
                    <Tag key={tag}
                         style={{fontSize: 16, height: 28, lineHeight: '25px'}}
                         color="#108ee9"
                         closable={true}
                         afterClose={() => this.deletePermission(tag)}
                    >
                      {tag}
                    </Tag>
                  );
                  return tagElem;
                })}
              </div>
            </Col>
          </Row>
          {/*备注*/}
          <FormItem label="备注" {...formItemLayout}>
            {getFieldDecorator('remark', {initialValue: ''})(
              <TextArea rows={4} style={{resize: 'none'}}></TextArea>
            )}
          </FormItem>
          {/*表单提交*/}
          <FormItem {...formItemLayout2}>
            <Button type="primary" htmlType="submit">
              确认
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={this.createCancel}>
              取消
            </Button>
          </FormItem>
        </Form>
        <div className="time-line-wrapper">
          <WorkflowTimeline data={nodeList}/>
          {/*由于难以达到要求的表单布局，此项目单独拆开，表单提交时记得加上*/}
          <TextArea rows={4} className="note" placeholder="你可以在这里留言"/>
        </div>
      </Panel>
    );
  }
}

export default Form.create()(WorkflowCreate);
