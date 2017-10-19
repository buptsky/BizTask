/*
 * svn 仓库申请流程表单
 * 组件用于本流程的新建，编辑/查看
 * 2017/10/13 gzj初测通过
 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import config from './WorkflowConfig';
import {trim} from '../../utils/common';
import {getFlowData, getRepositories} from '../../actions/workflow';
import {Button, Form, Select, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col, Modal, message, notification} from 'antd';
// 表单样式配置
const {formItemLayout1, formItemLayout2} = config;
// antd 组件配置
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
// 仓库功能可选check
const checkOptions = [
  {label: '涉及财务、资金、计费、管理权限等', value: 'limit'},
  {label: '需要404审计', value: '404'}
];

@connect(
  state => ({
    persons: state.common.commonData.persons,
    flowDetailData: state.workflow.flowDetailData
  }),
  dispatch => ({
    getFlowData: bindActionCreators(getFlowData, dispatch),
    getRepositories: bindActionCreators(getRepositories, dispatch)
  })
)
class SvnApplyForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      disableManager: false, // 勾选仓库404禁止自选仓库管理员
      flownamePrefix: `svn权限申请-`, // 流程名称前缀
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/', // 仓库名称前缀
      permissionTags: [], // 添加权限人员
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写', // 当前权限人员的权限类型
      permissionPersons: [] // 权限人员自动补全的动态数据源
    }
  }

  componentWillMount() {
    // 若为查看流程
    if (this.props.flowDetailData.flowTypeId) {
      // 获取表单回填数据
      let originData = this.props.flowDetailData;
      let tags = [];
      // 设置权限人员数据
      originData.formData.persons.forEach((person) => {
        if (person.permission === '1') {
          tags.push(`${person.email} 读写`);
        } else {
          tags.push(`${person.email} 只读`);
        }
      });
      this.setState({permissionTags: tags});
      // 如果是查看/编辑 状态
      if (originData.canEdit === false) {
        this.setState({
          disableAll: true
        });
      }
    }
  }

  // 表单提交
  handleSubmit = (flag) => {
    const originData = this.props.flowDetailData;
    // 还没有进行表单检测处理
    let commonArgs = {}; // 表单通用数据
    let formData = {};
    let persons = []; // 权限人员集合
    this.props.form.validateFields((err, values) => {
      if (err) { // 表单提交错误
        console.log(err);
        return;
      }
      // 判断当前权限
      if (originData.canAuthorize || originData.canDelete) { // 审批权限和修改权限
        Object.assign(commonArgs, {
          flowId: originData.flowId, // 当前流程id
          taskId: originData.taskId, // 当前流程的taskId
          isPassed: flag // 当前流程被拒绝/删除还是通过/提交
        });
      } else { // 创建流程
        // 设置流程类型ID（svn仓库申请-101）(number)
        commonArgs['flowTypeId'] = 101;
      }
      // 获取流程名称（流程前缀 + 仓库名）
      commonArgs['flowName'] = this.state.flownamePrefix + trim(values['create-name']);
      // 本次操作的留言,从父组件获取
      commonArgs['message'] = trim(this.props.getMsg());
      // 本次操作添加的权限人员
      this.state.permissionTags.forEach((item) => {
        // 获取人员的权限信息存入persons，读写-> 1 ,只读-> 2
        persons.push({
          email: item.split(' ')[0],
          permission: item.split(' ')[1] === '读写' ? '1' : '2'
        })
      });
      formData = {
        repositoryName: trim(values['storage-name']), // 仓库名
        manager: values['storage-manager'].join(','), // 仓库管理员
        description: trim(values['storage-desc']), // 仓库功能描述
        needADPublish: false, // 后来去掉的选项,一直为false
        needFinance: values['check-opt'].includes('limit'), // 涉及财务等权限
        need404: values['check-opt'].includes('404'), // 需要404审计
        persons: persons, // 权限人员
        remark: trim(values['remark']) // 备注
      }
      // 表单校验
      let ret = this.checkFormData({...commonArgs, formData});
      if (!ret) return;
      // console.log({...commonArgs, formData}); // 最后提交的参数集
      // 数据提交
      fetchData({
        url: `/workflow/${flag === undefined ? 'submitWorkflow.do': 'approve.do'}`,
        data: {...commonArgs, formData: JSON.stringify(formData)}
      }).then((data) => {
        // notification.success({message: '操作成功!',duration: 2}); // 成功提示
        this.props.close(); // 关闭面板
        this.props.getFlowData(); // 成功后刷新流程列表数据
        this.props.getRepositories(); // 因为申请了新的仓库，这里还要更新仓库列表
      });
    });
  }
  // 校验必需的表单数据，由于表单设计问题，采用自行验证的方式
  checkFormData = (data) => {
    console.log(data);
    // 流程名非空
    if (!data.flowName.split('-').slice(1).join('-')) {
      message.error('请输入流程名！');
      return false;
    }
    // 仓库名非空
    if (!data.formData.repositoryName) {
      message.error('请输入仓库名!');
      return false;
    }
    // 仓库管理员非空
    if (!data.formData.manager) {
      message.error('请选择至少一个仓库管理员!');
      return false;
    }
    // 权限人员非空
    if (!data.formData.persons.length) {
      message.error('请选择至少一人添加权限！');
      return false;
    }
    return true;
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
      // 保证autocomplete组件已经渲染
      this.permissionInput.focus();
    });
  }
  // 隐藏添加权限人员输入框
  hidePermissionInput = () => {
    this.setState({
      permissionPersons: [], // 清空补全数据
    }, () => {
      // 放入回调更新的原因是，不能在react组件已经卸载的情况下，更新该react组件的状态。
      // 在当前情景下，不遵守该顺序不会出现错误，但会出现警告
      this.setState({
        permissionInputVisible: false
      })
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
    const tags = this.state.permissionTags.filter(tag => tag !== removedTag);
    this.setState({permissionTags: tags})
  }
  // 切换分配权限的类型
  changePermission = (e) => {
    this.setState({permissionType: e.target.value})
  }
  // 仓库描述多选框变动
  onCheckChange = (values) => {
    if (values.includes('404')) {
      this.setState({disableManager: true});
      this.props.form.setFieldsValue({'storage-manager': ['404管理员']});
    } else {
      this.setState({disableManager: false});
      this.props.form.setFieldsValue({'storage-manager': []});
    }
    console.log(values);
  }
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
    let flowName = '';
    let formCheck = [];
    const {getFieldDecorator} = this.props.form;
    const originData = this.props.flowDetailData;
    const formData = originData.formData ? originData.formData : {};
    // 表单回填的流程名称
    if (originData.flowName) {
      flowName = originData.flowName.split('-').slice(1).join('-');
    }
    // 表单回填中多选框处理
    formData.needFinance ? formCheck.push('limit') : '';
    formData.need404 ? formCheck.push('404') : '';
    // 仓库管理员下拉选项
    const managerOptions = this.props.persons.map((person) => {
      return <Option key={person.name}>{person.name}</Option>;
    });

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          {/*流程名称*/}
          <FormItem label="流程名称" {...formItemLayout1}>
            {getFieldDecorator('create-name', {initialValue: flowName || ''})(
              <Input addonBefore={this.state.flownamePrefix} disabled/>
            )}
          </FormItem>
          {/*仓库名称*/}
          <FormItem label="仓库名称" {...formItemLayout1}>
            <span>http://bizsvn.sogou-inc.com/svn/</span>
            {getFieldDecorator('storage-name', {
              initialValue: formData.repositoryName || ''
            })(
              <Input onChange={this.syncInput} disabled={this.state.disableAll}/>
            )}
          </FormItem>
          {/*仓库管理员*/}
          <FormItem label="仓库管理员" {...formItemLayout1}>
            {getFieldDecorator('storage-manager',
              {initialValue: (formData.manager && formData.manager.split(',')) || []})(
              <Select mode="multiple" disabled={this.state.disableAll || this.state.disableManager}>
                {managerOptions}
              </Select>
            )}
          </FormItem>
          {/*仓库功能描述*/}
          <FormItem label="仓库功能描述" style={{marginBottom: '5px'}} {...formItemLayout1}>
            {getFieldDecorator('storage-desc', {initialValue: formData.description || ''})(
              <TextArea rows={4} style={{resize: 'none'}} disabled={this.state.disableAll}></TextArea>
            )}
          </FormItem>
          {/*功能描述多选框*/}
          <FormItem  {...formItemLayout2}>
            {getFieldDecorator('check-opt', {
              initialValue: formCheck || [],
            })(
              <CheckboxGroup
                options={checkOptions}
                onChange={this.onCheckChange}
                disabled={this.state.disableAll}
              />
            )}
          </FormItem>
          {/*默认添加权限*/}
          {
            !this.state.disableAll && (
              <FormItem label="默认给谁添加权限" style={{marginBottom: '5px'}} {...formItemLayout1}>
                {getFieldDecorator('default-add', {initialValue: ''})(
                  <Input type="hidden"/>
                )}
                {
                  this.state.permissionInputVisible ? (
                    <AutoComplete
                      dataSource={this.state.permissionPersons}
                      children={<Input ref={(input) => this.permissionInput = input}/>}
                      onSelect={this.confirmPermission}
                      onSearch={this.searchPermissionPersons}
                      onBlur={this.hidePermissionInput}
                      style={{width: '45%'}}
                    />
                  ) : (
                    <Button type="dashed" onClick={this.showPermissionInput}
                            disabled={this.state.disableAll}>+新增成员</Button>
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
              </FormItem>
            )
          }
          {/*新增权限人员显示*/}
          <Row style={{margin: '10px 0 24px 0'}}>
            {/*禁用编辑模式下展示，用于配合显示隐藏*/}
            <Col span={6} style={{textAlign: 'right'}}>
              {
                this.state.disableAll && (
                  <div className="ant-form-item-label">
                    <label title="默认给谁添加权限">默认给谁添加权限</label>
                  </div>
                )
              }
            </Col>
            <Col span={16} offset={1}>
              <div className="permission-tags">
                {this.state.permissionTags.map((tag, index) => {
                  const tagElem = (
                    <Tag key={tag}
                         style={{height: 32, lineHeight: '28px', marginBottom: 10}}
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
            </Col>
          </Row>
          {/*备注*/}
          <FormItem label="备注" {...formItemLayout1}>
            {getFieldDecorator('remark', {initialValue: formData.remark || ''})(
              <TextArea rows={4}
                        style={{resize: 'none'}}
                        disabled={this.state.disableAll}
              >
              </TextArea>
            )}
          </FormItem>
          {/*表单提交*/}
          <FormItem {...formItemLayout2}>
            {/*仅创建流程*/}
            {
              !originData.formData && (
                <Button type="primary" onClick={() => {
                  this.handleSubmit();
                }} style={{marginRight: '20px'}}>
                  启动
                </Button>
              )
            }
            {/*审批权限*/}
            {
              originData.canAuthorize && (
                <Button type="primary" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  通过
                </Button>
              )
            }
            {
              originData.canAuthorize && (
                <Button type="danger" onClick={() => {
                  this.handleSubmit(false);
                }} style={{marginRight: '20px'}}>
                  拒绝
                </Button>
              )
            }
            {/*修改权限*/}
            {
              originData.canDelete && (
                <Button type="primary" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  提交
                </Button>
              )
            }
            {
              originData.canDelete && (
                <Button type="danger"
                        onClick={this.showConfirmModal}
                        style={{marginRight: '20px'}}
                >
                  删除
                </Button>
              )
            }
            <Button onClick={this.props.close}>
              取消
            </Button>
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
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SvnApplyForm);
