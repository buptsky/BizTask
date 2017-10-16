/*
 * 新员工入职step2表单
 * 组件用于本流程第二步骤（leader对员工进行仓库权限分配）表单编辑/查看 本步骤只用于审批
 * 2017/10/14 gzj初测通过
 */
import ReactDOM from 'react-dom';
import {Button, Input, Row, Col, Icon, Popover, Select, Checkbox, AutoComplete, Tag, notification} from 'antd';
import {connect} from 'react-redux';
import {debounce} from '../../utils/common';
import {bindActionCreators} from 'redux';
import {getFlowData} from '../../actions/workflow';
// antd 组件配置
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

@connect(
  state => ({
    flowDetailData: state.workflow.flowDetailData,
    repositories: state.workflow.repositories
  }),
  dispatch => ({
    getFlowData: bindActionCreators(getFlowData, dispatch)
  })
)
class NewEmployeeStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableAll: false,
      groupAndSvnList: [], // svn分组数据
      currentSvns: [], // 当前组下的所有svn路径
      filterSvns: [], // svn路径自动补全的动态数据源
      svnTags: [], // 选中的svn标签集合
      popoverVisible: false,
      indeterminate: false, // checkbox全选样式控制（true - 当前有选中 false - 当前无选中）
      currentCheckedList: [], // 当前选中的check
      checkAll: false // 是否全选
    }
  }

  componentWillMount() {
    fetchData({
      url: '/serviceTree/getGroupAndSvnList.do',
      data: {}
    }).then((data) => {
      this.setState({
        groupAndSvnList: data,
        currentSvns: data[0].svns
      });
      console.log(data);
    });
    if (!this.props.flowDetailData.canEdit) {
      this.setState({
        disableAll: true
      });
    }
  }
  // 提交表单
  handleSubmit = (flag) => {
    const originData = this.props.flowDetailData;
    console.log(originData);
    const formData = {
      step: originData.formData.step,
      svn: this.state.svnTags
    }
    const args = {
      flowId: originData.flowId,
      flowName: originData.flowName,
      taskId: originData.taskId,
      isPassed: flag,
      message: this.props.getMsg(),
      formData: JSON.stringify(formData)
    }
    console.log(args);
    // 数据提交
    fetchData({
      url: '/workflow/approve.do',
      data: args
    }).then((data) => {
      notification.success({message: '操作成功!',duration: 2}); // 成功提示
      this.props.close(); // 关闭面板
      this.props.getFlowData(); // 成功后刷新流程列表数据
    });
  }
  // 更改svn组
  changeGroup = (value) => {
    const ret =  this.state.groupAndSvnList.filter((item) => {
      return item.group === value;
    })
    this.setState({
      currentSvns: ret[0].svns,
      currentCheckedList: [],
      indeterminate: false,
      checkAll: false
    });
  }
  /*搜索添加部分*/
  // 确认选中搜索出的svn
  confirmSvn = (value) => {
    let tags = this.state.svnTags;
    if (tags.includes(value)) return; // 重复选择
    tags = [...tags, value];
    this.setState({
      svnTags: tags
    }, () => {
      // 这里调用ReactDOM.findDOMNode是为了使用底层dom清空输入框的值
      // 异步调用的原因是外层autocomplete组件会在confirmSvn方法调用后同步远中的值，这将覆盖同步清空后的值
      // 发现给autoComplete中的input绑定value属性会失效，暂时使用此方法清空输入
      ReactDOM.findDOMNode(this.input).value = '';
    });

  }
  // 过滤匹配的svn路径
  filterSvn = (value) => {
    let ret = [];
    if (value) {
      // 权限人员集合
      const data = this.props.repositories;
      // 数据过滤
      ret = data.filter((person) => {
        return person.indexOf(value) !== -1;
      });
    }
    this.setState({
      filterSvns: ret
    });
  }
  /*分组添加部分*/
  // 切换卡片显示展开
  togglePopoverVisible = () => {
    this.setState((prevState) => {
      return {
        currentCheckedList: [], // 清空选中状态
        indeterminate: false,
        checkAll: false, // 清空全选状态
        popoverVisible: !prevState.popoverVisible
      };
    })
  }
  // 分组添加确认选中
  confirmPopover = () => {
    this.togglePopoverVisible(); // 关闭卡片
    let tags = this.state.svnTags;
    this.setState({ // 标签去重
      svnTags: [...new Set(tags.concat(this.state.currentCheckedList))]
    })
  }
  // 切换分组选项的全选状态
  onCheckAllChange = (e) => {
    this.setState({
      currentCheckedList: e.target.checked ? this.state.currentSvns : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
  // 勾选分组选项，用于判断是否已经全选/全取消
  checkSvn = (checkedList) => {
    this.setState({
      currentCheckedList: checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.currentSvns.length),
      checkAll: checkedList.length === this.state.currentSvns.length,
    });
  }

  // 删除已经添加的svn路径
  deleteSvn = (removedTag) => {
    console.log(this.state.svnTags);
    const tags = this.state.svnTags.filter(tag => tag !== removedTag);
    this.setState({svnTags: tags});
  }

  render() {
    const originData = this.props.flowDetailData;
    const lists = this.state.groupAndSvnList;
    const svns = this.state.currentSvns;
    // svn分组下拉选项（分组选择方式）
    const svnGroupOpts = lists.map((item) => {
      return (<Option key={item.group} value={item.group}>{item.group}</Option>)
    });
    // 多选框组内容（分组选择方式）
    let checkContent = svns.map((item) => {
      return (
        <Col span={6} key={item} title={item} className="checkbox-wrapper">
          <Checkbox value={item} style={{padding: '3px 0'}}>
            {item}
          </Checkbox>
        </Col>
      )
    });
    // 气泡卡片内容
    const svnContent = (
      <div style={{width: 450}}>
        <Checkbox
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选 / 取消
        </Checkbox>
        <Checkbox.Group value={this.state.currentCheckedList} onChange={this.checkSvn}>
          <Row>
            {checkContent}
          </Row>
        </Checkbox.Group>
        <div style={{marginTop: 20}}>
          <Button type="primary" onClick={this.confirmPopover}>确认</Button>
          <Button onClick={this.togglePopoverVisible} style={{marginLeft: '20px'}}>取消</Button>
        </div>
      </div>
    );

    return (
      <div className="employee-step2">
        {/*流程名称样式与antd-form组件样式协同*/}
        <Row className="employee-item">
          <Col span={3}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={originData.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row className="employee-item">
          <span className="employee-info" style={{paddingLeft: 0}}>
            {originData.formData.name}({originData.formData.email})
          </span>
          的入职准备工作如下:
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          请邀请QQ号
          <span className="employee-info">{originData.formData.qq}</span>
          加入biztechQQ群及组内联系群
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          请检查是否需要给邮箱号：
          <span className="employee-info">{originData.formData.email}</span>
          开通产品文档权限
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          请将微信账号
          <span className="employee-info">{originData.formData.weixin}</span>
          邀请加入biztech微信群
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          请将邮箱
          <span className="employee-info">{originData.formData.email}</span>
          加入组内邮件组
        </Row>
        <Row className="employee-item">
          <Icon type="flag" className="todo-icon" />
          开通对应svn权限：
        </Row>
        {/*分组添加svn*/}
        <Row className="employee-item">
          <span className="svn-add-type">分组添加：</span>
          <Select className="svn-select"
                  value={(lists.length && lists[0].group) || ''}
                  onSelect={this.changeGroup}
          >
            {svnGroupOpts}
          </Select>
          <Popover
            visible={this.state.popoverVisible}
            content={svnContent}
            title="仓库列表"
            placement="right"
            trigger="click">
            <Button type="primary" onClick={this.togglePopoverVisible}>选择svn</Button>
          </Popover>
        </Row>
        {/*搜索添加svn*/}
        <Row className="employee-item">
          <span className="svn-add-type">搜索添加：</span>
          <span>http://bizsvn.sogou-inc.com/svn/</span>
        </Row>
        <Row className="employee-item" style={{margin: '-5px 0 15px 0'}}>
          <AutoComplete
            className="employee-auto-complete"
            children={
              <Input
                ref={(input) => {this.input = input}}
              />
            }
            onSelect={this.confirmSvn}
            onSearch={debounce(this.filterSvn).bind(this)}
            dataSource={this.state.filterSvns}
          />
        </Row>
        {/*svn展示*/}
        <Row className="employee-item" style={{margin: '-20px 0 30px 0'}}>
          <div className="svn-tags">
            {this.state.svnTags.map((tag, index) => {
              const tagElem = (
                <Tag key={tag}
                     className="svn-tag-item"
                     color="#108ee9"
                     closable={true}
                     afterClose={() => this.deleteSvn(tag)}
                >
                  {tag}
                </Tag>
              );
              return tagElem;
            })}
          </div>
        </Row>
        <Row className="employee-item">
          <Col className="employee-btn-wrapper">
            {/*审批权限*/}
            {
              originData.canAuthorize && (
                <Button type="primary" size="large" onClick={() => {
                  this.handleSubmit(true);
                }} className="employee-btn">
                  通过
                </Button>
              )
            }
            {
              originData.canAuthorize && (
                <Button type="danger" size="large" onClick={() => {
                  this.handleSubmit(false);
                }} className="employee-btn">
                  拒绝
                </Button>
              )
            }
            <Button size="large" onClick={this.props.close} className="employee-btn">取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep2;
