/*
 * svn 权限分配流程表单
 * 组件用于本流程的新建，编辑/查看
 * 2017/10/13 gzj初测通过
 */
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import config from './WorkflowConfig';
import {trim} from '../../utils/common';
import {getFlowData} from '../../actions/workflow';
import {Button, Form, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col, Modal, message, notification} from 'antd';

// 表单样式配置
const {formItemLayout1, formItemLayout2} = config;
// antd 组件配置
const FormItem = Form.Item;
const Option =  AutoComplete.Option;;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

@connect(
  state => ({
    persons: state.common.commonData.persons,
    flowDetailData: state.workflow.flowDetailData,
    repositories: state.workflow.repositories
  }),
  dispatch => ({
    getFlowData: bindActionCreators(getFlowData, dispatch)
  })
)
class SvnPermissionForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      originData: {}, // 回填表单数据中的formData
      disableAll: false, // 禁用所有编辑（操作流程中的不可编辑权限）
      flownamePrefix: `svn权限分配-`, // 流程名称前缀
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/', // 仓库名称前缀
      permissionInputVisible: false,// 隐藏添加权限人员输入
      permissionType: '读写', // 当前权限人员的权限类型
      permissionTags: [], // 添加的权限人员集合
      permissionPersons: [], // 权限人员自动补全的动态数据源
      storeManagers: {}, // 仓库及管理信息（机制不清）
      storePaths: [], // 需要查询的仓库地址集合
      filterPaths: [], // 筛选后的仓库地址
      deleteVisible: false // 确认删除流程
    }
  }

  componentWillMount() {
    // 查看模式
    if (this.props.flowDetailData.flowTypeId) {
      // 获取表单回填数据
      let originData = this.props.flowDetailData;
      let tags = [];
      // 设置权限人员数据,仓库数据
      let repositories = originData.formData.repositories;
      let managerIntersection = originData.formData.needEmailManagers;
      originData.formData.persons.forEach((person) => {
        if (person.permission === '1') {
          tags.push(`${person.email} 读写`);
        } else {
          tags.push(`${person.email} 只读`);
        }
      });
      this.setState({
        permissionTags: tags,
        storeManagers: {repositories, managerIntersection}
      });
      // 如果是查看/编辑 状态
      if (originData.canEdit === false) {
        this.setState({
          disableAll: true
        });
      }
    }
  }

  // 表单提交(为了进行不同方式的提交，暂不使用antd自带的提交方式)
  // 参数只会在审批/修改流程中使用，true -> 通过/提交， false -> 拒绝/删除
  handleSubmit = (flag) => {
    console.log(flag);
    const originData = this.props.flowDetailData;
    let commonArgs = {}; // 表单通用数据
    let formData = {};
    let persons = []; // 权限人员集合
    this.props.form.validateFields((err, values) => {
      if (err) { // 表单提交错误（验证失败）
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
        // 设置流程类型ID（svn权限分配-102）(number)
        commonArgs['flowTypeId'] = 102;
      }
      // 获取流程名称（流程前缀 + 仓库名）
      commonArgs['flowName'] = this.state.flownamePrefix + trim(values['create-name']);
      // 本次操作的留言,从父组件获取
      commonArgs['message'] = this.props.getMsg();
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
        remark: trim(values['remark']) // 备注
      }
      // 表单校验
      let ret = this.checkFormData({...commonArgs, formData});
      if (!ret) return;
      // 校验成功，发送请求
      fetchData({
        url: `/workflow/${flag === undefined ? 'submitWorkflow.do' : 'approve.do'}`,
        data: {...commonArgs, formData: JSON.stringify(formData)}
      }).then((data) => {
        notification.success({message: '操作成功!',duration: 2}); // 成功提示
        this.props.close(); // 关闭面板
        this.props.getFlowData(); // 成功后刷新流程列表数据
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
    // 仓库列表非空
    if (!data.formData.managers) {
      message.error('请选择至少一个仓库！');
      return false;
    }
    // 权限人员非空
    if (!data.formData.persons.length) {
      message.error('请选择至少一人添加权限！');
      return false;
    }
    return true;
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
      });
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
  }
  // 删除权限人员
  deletePermission = (removedTag) => {
    console.log(removedTag);
    const tags = this.state.permissionTags.filter(tag => tag !== removedTag);
    console.log(tags);
    this.setState({permissionTags: tags});
  }
  // 切换分配权限的类型
  changePermission = (e) => {
    this.setState({permissionType: e.target.value})
  }
  // 仓库路径筛选
  filterStorage = (value) => {
    let ret = [];
    if (value) {
      // 数据过滤
      ret = this.props.repositories.filter((path) => {
        return path.indexOf(value) !== -1;
      });
    }
    this.setState({
      filterPaths: ret
    });
  }
  // 选取仓库路径
  confirmStorage = (path) => {
    console.log(path);
    let paths = this.state.storePaths; // 获取当前地址集合
    if (paths.includes(path)) return; // 如果传递重复路径，则忽略
    paths.push(path); // 添加新地址
    this.setState({storePaths: paths}, () => {
      this.searchStorage();
    });
  }
  // 删除仓库路径
  deleteStorage = (path) => {
    let newPaths = this.state.storePaths.filter((item) => {
      return item !== path;
    });
    this.setState({storePaths: newPaths}, () => {
      this.searchStorage();
    });
  }
  // 仓库路径查询
  searchStorage = () => {
    // 获取路径信息
    fetchData({
      url: '/svnService/getManagersByPaths.do',
      data: {path: this.state.storePaths}
    }).then((data) => {
      // 如果有仓库数据，但是没有交叉管理员，则该仓库不可选
      if (!data.managerIntersection.length && data.repositories.length) {
        message.error('该仓库不可被选取');
        this.props.form.setFieldsValue({
          'storage-name-allot': ''
        });
        return;
      }
      this.setState({
        storeManagers: data,
        storePaths: data.repositories.map((item) => item.path) // 获取到的仓库路径集合
      });
      // 添加邮件通知管理员checkbox后即设定为选中状态,清空输入框
      this.props.form.setFieldsValue({
        'inform-manager': data.managerIntersection,
        'storage-name-allot': ''
      });
    });
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
    const {getFieldDecorator} = this.props.form;
    // 获取表单回填数据
    const originData = this.props.flowDetailData;
    const formData = originData.formData ? originData.formData : {};
    // 表单回填的流程名称
    if (originData.flowName) {
      flowName = originData.flowName.split('-').slice(1).join('-');
    }

    return (
      <div>
        {/*注意Form中字段没有按照实际情况配置，仅做测试使用*/}
        <Form
          onSubmit={this.handleSubmit}
        >
          {/*流程名称*/}
          <FormItem label="流程名称" {...formItemLayout1}>
            {getFieldDecorator('create-name', {initialValue: flowName || ''})
            (
              <Input
                addonBefore={this.state.flownamePrefix}
                disabled={this.state.disableAll}
              />
            )}
          </FormItem>

          {/*仓库名称*/}
          <FormItem label={<span>仓库名称</span>} {...formItemLayout1} >
            <span>http://bizsvn.sogou-inc.com/svn/</span>
            {/*禁用编辑情况下隐藏*/}
            {
              !this.state.disableAll && (
                getFieldDecorator('storage-name-allot', {initialValue: ''})
                (
                  <AutoComplete
                    onSearch={this.filterStorage}
                    onSelect={this.confirmStorage}
                    disabled={this.state.disableAll}
                    dataSource={this.state.filterPaths}
                  />
                )
              )
            }
            {/*仓库名称显示及操作*/}
            {
              this.state.storeManagers['repositories'] &&
              this.state.storeManagers['repositories'].map((item, index) => {
                const storeElem = (
                  <div className="store-wrapper" key={index}>
                    <div className="store-item">
                      <p className="store-path">{item.path}</p>
                      <span className="close" onClick={() => {
                        this.deleteStorage(item.path);
                      }}>{this.state.disableAll ? '' : '删除'}</span>
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
            {getFieldDecorator('inform-manager', {initialValue: formData.needEmailManagers || []})(
              <CheckboxGroup
                options={this.state.storeManagers.managerIntersection}
                disabled={this.state.disableAll}
              />
            )}
          </FormItem>
          {/*默认添加权限*/}
          {
            !this.state.disableAll && (
              <FormItem label="默认给谁添加权限" style={{marginBottom: '5px'}} {...formItemLayout1}>
                {getFieldDecorator('default-add', {initialValue: ''})
                (
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
              <p style={{color: '#f04134', fontSize: 16}}>确认是否删除该流程（删除后不可找回）</p>
            </Modal>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create()(SvnPermissionForm);
