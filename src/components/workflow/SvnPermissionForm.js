import {Button, Form, Select, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col} from 'antd';
import config from './WorkflowConfig';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
// 表单样式配置
const {formItemLayout1, formItemLayout2} = config;
// antd 组件配置
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

@connect(
  state => ({
    persons: state.common.commonData.persons
  }),
  dispatch => ({})
)
class SvnPermissionForm extends React.Component {
  constructor(props) {
    super(props);
    // 这里手动指定了flownamePrefix的默认值,以后可能会动态获取
    this.state = {
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      flownamePrefix: `svn权限分配-`, // 流程名称前缀
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/', // 仓库名称前缀
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写', // 当前权限人员的权限类型
      permissionTags: [], // 添加的权限人员集合
      permissionPersons: [], // 权限人员自动补全的动态数据源
      storeManagers: {}, // 仓库及管理信息（机制不清）
      storePaths: [], // 需要查询的仓库地址集合
      allPaths: [], // 所有可用仓库地址
      filterpaths: [] // 筛选后的仓库地址
    }
  }

  componentWillMount() {
    // 获取所有可用仓库路径
    fetchData({
      url: '/svnService/getRepositories.do',
      data: {}
    }).then((data) => {
      this.setState({
        allPaths: data
      })
    });
    // 如果是查看/编辑 状态
    // if (this.props.data.canEdit === false) {
    //   console.log('disabled');
    //   this.setState({
    //     disableAll: true
    //   });
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.permissionInputVisible) {
      // 这里直接访问了底层dom元素是为了使select组件的输入框获取焦点
      // 暂时只找到这种解决方案，因为不使用datasource时，发现children中的input自定义失效了
      ReactDOM.findDOMNode(this.permissionInput).click();
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
      // 设置流程类型ID（svn权限分配-102）
      commonArgs['flowTypeId'] = '102';
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
        repositories: this.state.storeManagers.repositories, // 添加的仓库信息
        needEmailManagers: values['inform-manager'], // 需要邮件通知的管理员
        managers: this.state.storeManagers.managerIntersection, // 仓库公共管理员
        persons: persons, // 权限人员
        remark: values['remark'] // 备注
      }
      console.log({...commonArgs, formData}); // 最后提交的参数集
    });
  }
  // 查找符合条件的权限人员(暂时不使用默认的自动补全)
  searchPermissionPersons = (value) => {
    let ret = [];
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
  // 显示添加权限人员输入框
  showPermissionInput = () => {
    this.setState({permissionInputVisible: true});
  }
  // 隐藏添加权限人员输入框
  hidePermissionInput = () => {
    this.setState({permissionInputVisible: false});
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
      permissionPersons: []
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
  // 仓库路径搜索
  searchStorage = (value) => {
    let ret = [];
    if (value) {
      // 数据过滤
      ret = this.state.allPaths.filter((path) => {
        return path.indexOf(value) !== -1;
      });
    }
    this.setState({
      filterpaths: ret
    });
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
    // 获取表单回填数据
    const originData = this.props.data;
    // if (originData.formData) { // 部分数据字符串转json（确认下线上数据是否一致）
    //   originData.formData = JSON.parse(originData.formData);
    // }
    // 仓库路径下拉选项
    const pathOptions = this.state.filterpaths.map((path) => {
      return <Option key={path}>{path}</Option>;
    });
    // 权限人员下拉选项
    const permissionOptions = this.state.permissionPersons.map((person) => {
      return <Option key={person}>{person}</Option>;
    });
    return (
      <div>
        {/*注意Form中字段没有按照实际情况配置，仅做测试使用*/}
        <Form
          onSubmit={this.handleSubmit}
        >
          {/*流程名称*/}
          <FormItem label="流程名称" {...formItemLayout1}>
            {getFieldDecorator('create-name', {initialValue: ''})(
              <Input
                addonBefore={this.state.flownamePrefix}
                disabled={this.state.disableInput}
              />
            )}
          </FormItem>
          {/*仓库名称*/}
          <FormItem label="仓库名称" {...formItemLayout1}>
            <span>http://bizsvn.sogou-inc.com/svn/</span>
            {getFieldDecorator('storage-name-allot', {initialValue: ''})(
              <AutoComplete
                onSearch={this.searchStorage}
                onSelect={this.confirmStorage}
              >
                {pathOptions}
              </AutoComplete>
            )}
            {/*仓库名称显示及操作*/}
            {
              this.state.storeManagers['repositories'] &&
              this.state.storeManagers['repositories'].map((item, index) => {
                const storeElem = (
                  <div className="store-wrapper" key={index}>
                      <div className="store-item">
                        <p className="store-path">{item.path}</p>
                        <span className="close">删除</span>
                        <span className="manager">管理员: {item.managers.join(' ')}</span>
                      </div>
                  </div>
                )
                return storeElem;
              })
            }
          </FormItem>

          {/*管理员通知*/}
          <FormItem label="邮件通知以下管理员审批" {...formItemLayout1}>
            {getFieldDecorator('inform-manager', {initialValue: []})(
              <CheckboxGroup
                options={this.state.storeManagers.managerIntersection}
              />
            )}
          </FormItem>
          {/*默认添加权限*/}
          <FormItem label="默认给谁添加权限" style={{marginBottom: '5px'}} {...formItemLayout1}>
            {getFieldDecorator('default-add', {initialValue: ''})(
              <Input type="hidden"/>
            )}
            {
              this.state.permissionInputVisible ? (
                <AutoComplete
                  onSelect={this.confirmPermission}
                  onSearch={this.searchPermissionPersons}
                  onBlur={this.hidePermissionInput}
                  ref={(input) => this.permissionInput = input}
                  style={{width: '45%'}}
                >
                  {permissionOptions}
                </AutoComplete>
              ) : (
                <Button type="dashed" onClick={this.showPermissionInput} disabled={this.state.disableAll}>+新增成员</Button>
              )
            }
            {/*权限描述*/}
            <RadioGroup defaultValue={"读写"}
                        onChange={this.changePermission}
                        style={{paddingLeft: '30px'}}
                        disabled={this.state.disableAll}
            >
              <Radio value="读写">读写</Radio>
              <Radio value="只读">只读</Radio>
            </RadioGroup>
            {/*新增权限人员显示*/}
            <div className="permission-tags" style={{margin: '10px 0 20px 0'}}>
              {this.state.permissionTags.map((tag, index) => {
                const tagElem = (
                  <Tag key={tag}
                       style={{height: 28, lineHeight: '25px'}}
                       color="#108ee9"
                       closable={!this.state.disableAll}
                       afterClose={() => this.deletePermission(tag)}
                  >
                    {tag}
                  </Tag>
                );
                return tagElem;
              })}
            </div>
          </FormItem>
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
            <Button type="primary" style={{marginLeft: '20px'}} onClick={this.props.close}>
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SvnPermissionForm);
