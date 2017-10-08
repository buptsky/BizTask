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
const formItemLayout = { // 标签 + 输入
  labelCol: {span: 6},
  wrapperCol: {span: 16, offset: 1}
}
const formItemLayout2 = { // 仅输入
  wrapperCol: {span: 16, offset: 7}
}
// 可选check(暂时放在这里，以后根据情况调整）
const checkOptions = [
  {label: '涉及财务、资金、计费、管理权限等', value: 'limit'},
  {label: '需要404审计', value: '404'}
];
// 时间轴数据测试（以后用mock）, 线上采集的数据和给的mock数据不一致，待查验
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
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      currentFlowType: '102', // 当前的流程类型
      managerTags: [], // 申请流程中仓库管理员
      permissionTags: [], // 申请流程中添加权限人员
      flownamePrefix: `svn权限分配-`, // 流程名称前缀
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/', // 仓库名称前缀
      disableInput: false, // 申请流程中禁用流程名称输入框
      managerInputVisible: false, // 隐藏添加仓库管理员输入
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写', // 当前权限人员的权限类型
      message: '', // 本次操作的留言
      storeManagers: {}, // 仓库及管理信息（机制不清）
      storePaths: [] // 需要查询的仓库地址集合
    }
  }

  componentWillMount() {
    // 如果是查看/编辑 状态
    if (this.props.data.canEdit === false) {
      console.log('disabled');
      this.setState({disableAll: true})
    }
  }

  // 表单提交
  handleSubmit = (e) => {
    // 还没有进行表单检测处理
    e.preventDefault();
    let commonArgs = {}; // 表单通用数据
    let formData = {};
    let persons = []; // 权限人员集合
    this.props.form.validateFields((err, values) => {
      if (err) { // 表单提交错误
        console.log(err);
        return;
      }
      // 获取流程类型ID
      commonArgs['flowTypeId'] = values['create-type'];
      // 获取流程名称（流程前缀 + 仓库名） (后续需要对名称进行处理，如去掉空格)
      commonArgs['flowName'] = this.state.flownamePrefix + values['create-name'];
      // 本次操作的留言
      commonArgs['message'] = this.state.message;
      // 本次操作添加的权限人员
      this.state.permissionTags.forEach((item) => {
        // 获取人员的权限信息存入persons，读写-> 1 ,只读-> 2
        persons.push({
          email: item.split(' ')[0],
          permission: item.split(' ')[1] === '读写' ? '1' : '2'
        })
      });
      // 对于不同的流程类型，formData格式不同
      if (values['create-type'] === 'svn-apply') { // svn仓库申请
        formData = {
          repositoryName: values['storage-name'], // 仓库名
          manager: values['storage-manager'], // 仓库管理员
          description: values['storage-desc'], // 仓库功能描述
          needADPublish: false, // 后来去掉的选项,一直为false
          needFinance: values['check-opt'].includes('limit'), // 涉及财务等权限
          need404: values['check-opt'].includes('404'), // 需要404审计
          persons: persons, // 权限人员
          remark: values['remark'] // 备注
        }
      } else if (values['create-type'] === 'svn-allot') { // svn权限分配
        formData = {
          repositories: this.state.storeManagers.repositories, // 添加的仓库信息
          needEmailManagers: values['inform-manager'], // 需要邮件通知的管理员
          managers: this.state.storeManagers.managerIntersection, // 仓库公共管理员
          persons: persons, // 权限人员
          remark: values['remark'] // 备注
        }
      }
      console.log({...commonArgs, formData}); // 最后提交的参数集
    });
  }
  // 切换流程类型,流程名称前缀联动
  changeType = (value) => {
    this.props.form.resetFields();  // 重置表单
    let newName = '';
    let disableInput = false;
    // 获取流程类型名称
    config.createType.forEach((item) => {
      if (item.value === value) {
        newName = item.title;
      }
    });
    // 如果不是权限分配流程，禁用流程名称输入框
    if (value !== '102') {
      disableInput = true;
    }
    this.setState({
      currentFlowType: value,
      flownamePrefix: `${newName}-`,
      disableInput: disableInput,
      permissionTags: [], // 重置权限人员
      message: '', // 重置留言
      storeManagers: {}, // 重置仓库及管理信息
      storePaths: [] // 重置库地址集合
    });
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
  searchManager = (e) => {

  }
  // 添加选中管理员
  confirmManager = (value) => {
    let tags = this.state.managerTags; // 获取保存的管理员标签
    if (value && tags.indexOf(value) === -1) { // 忽略重复管理员标签
      tags = [...tags, value];
    }
    this.setState({ // 重设标签，隐藏管理员输入框
      managerTags: tags,
      managerInputVisible: false,
    });
    this.props.form.setFieldsValue({'storage-manager': tags.join(',')});  // 表单同步
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
    this.props.form.setFieldsValue({'default-add': tags.join(',')});  // 表单同步
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
  // 记录留言以备表单提交
  changeMessage = (e) => {
    this.setState({message: e.target.value});
  }
  // 仓库路径搜索
  searchStorage = (e) => {

  }
  // 选取仓库路径
  confirmStorage = (path) => {
    let paths = this.state.storePaths; // 获取当前地址集合
    if (paths.includes(path)) return; // 如果传递重复路径，则忽略
    paths.push(path); // 添加新地址
    this.setState({storePaths: paths});
    // 获取路径信息
    fetchData({
      url: '/svnService/getManagersByPaths.do',
      data: {paths}
    }).then((data) => {
      this.setState({
        storeManagers: data,
        storePaths: data.repositories.map((item) => item.path) // 获取到的仓库路径集合
      });
      // 添加邮件通知管理员checkbox后即设定为选中状态,清空输入框
      this.props.form.setFieldsValue({
        'inform-manager': data.managerIntersection,
        'storage-name-allot': ''
      })
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    // 新建流程下拉列表选项
    const workflowSelectItem = (
      config.createType.map((type) => {
        return (<Option key={type.value} value={type.value}>{type.title}</Option>);
      })
    );
    // 获取表单回填数据
    const originData = this.props.data;
    console.log(originData);
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
            {getFieldDecorator('create-type', {initialValue: originData['flowTypeId'] || '102'})(
              <Select onChange={this.changeType} disabled={this.state.disableAll}>
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
          {/*仓库名称（分配逻辑）、仓库添加和管理员通知（仅权限分配流程）*/}
          {
            this.state.currentFlowType === '102' ?
              (
                <div>
                  {/*仓库名称*/}
                  <FormItem label="仓库名称" {...formItemLayout}>
                    {getFieldDecorator('storage-name-allot', {initialValue: ''})(
                      <AutoComplete
                        children={
                          <Input
                            addonBefore={this.state.storenamePrefix}
                            // onFocus={this.hidePrefix}
                            // onBlur={this.showPrefix}
                            ref={(input) => {this.textInput = input;}}
                          />
                        }
                        dataSource={['路径1', '路径2', '路径3']}
                        onSearch={this.searchStorage}
                        onSelect={this.confirmStorage}
                      />
                    )}
                  </FormItem>
                  {/*仓库名称显示及操作*/}
                  {
                    this.state.storeManagers['repositories'] &&
                    this.state.storeManagers['repositories'].map((item, index) => {
                      const storeElem = (
                        <Row className="store-wrapper" key={index}>
                          <Col span={16} offset={7}>
                            <div className="store-item">
                              <p className="store-path">{item.path}</p>
                              <span className="close">删除</span>
                              <span className="manager">管理员: {item.managers.join(' ')}</span>
                            </div>
                          </Col>
                        </Row>
                      )
                      return storeElem;
                    })
                  }
                  {/*管理员通知*/}
                  <FormItem label="邮件通知以下管理员审批" {...formItemLayout}>
                    {getFieldDecorator('inform-manager', {initialValue: []})(
                      <CheckboxGroup
                        options={this.state.storeManagers.managerIntersection}
                      />
                    )}
                  </FormItem>
                </div>
              )
              : null
          }
          {/*仓库名称（申请逻辑）、仓库管理员和功能描述（仅仓库申请流程）*/}
          {
            this.state.currentFlowType === '101' ?
              (
                <div>
                  {/*仓库名称*/}
                  <FormItem label="仓库名称" {...formItemLayout}>
                    {getFieldDecorator('storage-name', {initialValue: ''})(
                      <Input addonBefore={this.state.storenamePrefix}
                             onFocus={this.hidePrefix}
                             onBlur={this.showPrefix}
                             onChange={this.syncInput}
                             ref={(input) => {this.textInput = input;}}
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
                                 style={{height: 28, lineHeight: '25px'}}
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
                </div>
              )
              : null
          }
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
          {/*新增权限人员显示*/}
          <Row style={{margin: '10px 0 20px 0'}}>
            <Col span={16} offset={7}>
              <div className="permission-tags">
                {this.state.permissionTags.map((tag, index) => {
                  const tagElem = (
                    <Tag key={tag}
                         style={{height: 28, lineHeight: '25px'}}
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
              启动
            </Button>
            <Button type="primary" style={{marginLeft: '20px'}} onClick={this.createCancel}>
              取消
            </Button>
          </FormItem>
        </Form>
        {/*时间线和留言*/}
        <div className="time-line-wrapper">
          <WorkflowTimeline data={this.props.data.nodeList || null}/>
          {/*由于难以达到要求的表单布局，此项目单独拆开，表单提交时记得加上*/}
          <TextArea rows={4}
                    value={this.state.message}
                    className="note"
                    placeholder={this.state.disableAll ? '暂无留言' : "你可以在这里留言"}
                    onChange={this.changeMessage}
                    disabled={this.state.disableAll}
          />
        </div>
      </Panel>
    );
  }
}

export default Form.create()(WorkflowCreate);
