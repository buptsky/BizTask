import {Button, Form, Select, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col} from 'antd';
import config from './WorkflowConfig';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
// 表单样式配置
const { formItemLayout1, formItemLayout2}  = config;
// antd 组件配置
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
// 可选check(暂时放在这里，以后根据情况调整）
const checkOptions = [
  {label: '涉及财务、资金、计费、管理权限等', value: 'limit'},
  {label: '需要404审计', value: '404'}
];

@connect(
  state => ({
    persons: state.common.commonData.persons
  }),
  dispatch => ({})
)
class SvnApplyForm extends React.Component {
  constructor(props) {
    super(props);
    // 这里手动指定了flownamePrefix的默认值,以后可能会动态获取
    this.state = {
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      flownamePrefix: `svn权限申请-`, // 流程名称前缀
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/', // 仓库名称前缀
      permissionTags: [], // 添加权限人员
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写', // 当前权限人员的权限类型
      permissionPersons: [] // 权限人员自动补全的动态数据源
    }
  }

  componentWillMount() {
    // 如果是查看/编辑 状态
    if (this.props.data.canEdit === false) {
      console.log('disabled');
      this.setState({
        disableAll: true
      });
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
      commonArgs['flowTypeId'] = '101';
      // 获取流程名称（流程前缀 + 仓库名） (后续需要对名称进行处理，如去掉空格)
      commonArgs['flowName'] = this.state.flownamePrefix + values['create-name'];
      // 本次操作的留言,从父组件获取
      commonArgs['message'] = this.props.message;
      // 本次操作添加的权限人员
      this.state.permissionTags.forEach((item) => {
        // 获取人员的权限信息存入persons，读写-> 1 ,只读-> 2
        persons.push({
          email: item.split(' ')[0],
          permission: item.split(' ')[1] === '读写' ? '1' : '2'
        })
      });
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
      console.log({...commonArgs, formData}); // 最后提交的参数集
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
  // 显示添加权限人员输入框
  showPermissionInput = () => {
    this.setState({permissionInputVisible: true}, () => {
      // 这里直接访问了底层dom元素是为了使select组件的输入框获取焦点
      // 暂时只找到这种解决方案，因为不使用datasource时，发现children中的input自定义失效了
      ReactDOM.findDOMNode(this.permissionInput).click();
    });
  }
  // 隐藏添加权限人员输入框
  hidePermissionInput = () => {
    this.setState({permissionInputVisible: false});
  }
  // 查找符合条件的权限人员(暂时不使用默认的自动补全)
  searchPermissionPersons = (value) => {
    let ret  = [];
    if (value) {
      // 权限人员集合
      const persons = this.props.persons.map((person) => person.name);
      // 数据过滤
      ret = persons.filter((person) => {
        return person.indexOf(value) !== -1;
      });
    }
    this.setState({
      permissionPersons: ret
    });
  }
  // 添加选中权限人员
  confirmPermission = (value) => {
    let tags = this.state.permissionTags;
    if (!value) return; // 没有输入
    for (let i = 0; i < tags.length; i++) { // 输入重复
      this.setState({
        permissionInputVisible: false
      });
      if (tags[i].indexOf(value) !== -1) return;
    }
    tags = [...tags, `${value} ${this.state.permissionType}`];
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
  
  render() {
    const {getFieldDecorator} = this.props.form;
    // 获取表单回填数据
    const originData = this.props.data;
    // 仓库管理员下拉选项
    const managerOptions = this.props.persons.map((person)=>{
      return <Option key={person.name}>{person.name}</Option>;
    });
    // 权限人员下拉选项
    const permissionOptions = this.state.permissionPersons.map((person) => {
      return <Option key={person}>{person}</Option>;
    });

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          {/*流程名称*/}
          <FormItem label="流程名称" {...formItemLayout1}>
            {getFieldDecorator('create-name', {initialValue: ''})(
              <Input addonBefore={this.state.flownamePrefix} disabled/>
            )}
          </FormItem>
          {/*仓库名称*/}
          <FormItem label="仓库名称" {...formItemLayout1}>
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
          <FormItem label="仓库管理员" {...formItemLayout1}>
            {getFieldDecorator('storage-manager', {initialValue: []})(
              <Select mode="multiple">
                {managerOptions}
              </Select>
            )}
          </FormItem>
          {/*仓库功能描述*/}
          <FormItem label="仓库功能描述" style={{marginBottom: '5px'}} {...formItemLayout1}>
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
          <FormItem label="默认给谁添加权限" style={{marginBottom: '5px'}} {...formItemLayout1}>
            {getFieldDecorator('default-add', {initialValue: ''})(
              <Input type="hidden"/>
            )}
            {this.state.permissionInputVisible && (
              <AutoComplete
                onSelect={this.confirmPermission}
                onSearch={this.searchPermissionPersons}
                onBlur={this.hidePermissionInput}
                ref={(input) => this.permissionInput = input}
                style={{width: '45%'}}
              >
                {permissionOptions}
              </AutoComplete>
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
          <FormItem label="备注" {...formItemLayout1}>
            {getFieldDecorator('remark', {initialValue: (originData.formData && originData.formData.remark) || ''})(
              <TextArea rows={4}
                        style={{resize: 'none'}}
                        disabled={this.state.disableAll}
              >
              </TextArea>
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
      </div>
    );
  }
}

export default Form.create()(SvnApplyForm);
