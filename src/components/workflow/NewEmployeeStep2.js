/*
 * 新员工入职step2表单
 * 组件用于本流程第二步骤（leader对员工进行仓库权限分配）表单编辑/查看
 * 2017/10/14 gzj初测通过
 * 该系列表单(step1-3)存在一些问题 ①是否允许删除 ②是否每个表单的操作模式是固定的，比如当前表单只能用来提交/（删除）/取消，或者查看，而不能进行审批 ③员工入职表单验证，是否需要验证
 */
import {Button, Input, Row, Col, Icon, Popover, Select, Checkbox, AutoComplete, Tag, Modal} from 'antd';
import {connect} from 'react-redux';
import {debounce} from '../../utils/common';
import {bindActionCreators} from 'redux';
import {getFlowData} from '../../actions/workflow';
// antd 组件配置
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;

const RowStyle = {marginBottom: 15, lineHeight: '28px'};
const ColorStyle = {color: '#108ee9'};
const textStyle = {overflow: 'hidden', textOverflow:'ellipsis', whiteSpace: 'nowrap'}

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
      console.log('提交成功');
      // 成功后刷新流程列表数据
      this.props.getFlowData();
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
    console.log('render');
    const originData = this.props.flowDetailData;
    const lists = this.state.groupAndSvnList;
    const svns = this.state.currentSvns;
    // 筛选后的仓库路径下拉选项
    // 仓库路径下拉选项（搜索方式）
    const svnOpts = this.state.filterSvns.map((path) => {
      return <Option key={path}>{path}</Option>;
    });
    // svn分组下拉选项（分组选择方式）
    const svnGroupOpts = lists.map((item) => {
      return (<Option key={item.group} value={item.group}>{item.group}</Option>)
    });
    // 多选框组内容（分组选择方式）
    let checkContent = svns.map((item) => {
      return (
        <Col span={6} key={item} style={textStyle} title={item}>
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
      <div>
        <Row style={{marginBottom: 24}}>
          <Col span={6} style={{textAlign: 'right'}}>
            <div className="ant-form-item-label">
              <label title="工作流程">流程名称</label>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Input value={originData.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row style={{...RowStyle, ...ColorStyle}}>
          {originData.formData.name}({originData.formData.email})的入职准备工作如下:
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请邀请QQ号 <span style={ColorStyle}>{originData.formData.qq}</span> 加入biztechQQ群及组内联系群
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请检查是否需要给邮箱号：<span style={ColorStyle}>{originData.formData.email}</span> 开通产品文档权限
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请将微信账号 <span style={ColorStyle}>{originData.formData.weixin}</span> 邀请加入biztech微信群
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请将邮箱 <span style={ColorStyle}>{originData.formData.email}</span> 加入组内邮件组
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          开通对应svn权限：
        </Row>
        {/*分组添加svn*/}
        <Row style={RowStyle}>
          <span style={{marginLeft: 34}}>分组添加：</span>
          <Select style={{width: 165, margin: '0 10px'}}
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
        <Row style={RowStyle}>
          <span style={{marginLeft: 34}}>搜索添加：</span>
          <span style={{marginLeft: 10}}>http://bizsvn.sogou-inc.com/svn/</span>
        </Row>
        <Row style={{margin: '-5px 0 15px 0'}}>
          <AutoComplete
            style={{height: 32, width: 205, marginLeft: 114}}
            onSelect={this.confirmSvn}
            onSearch={debounce(this.filterSvn).bind(this)}
            ref={(input) => {this.svnInput = input}}
          >
            {svnOpts}
          </AutoComplete>
        </Row>
        {/*svn展示*/}
        <Row style={{margin: '-20px 0 30px 0'}}>
          <div className="svn-tags" style={{marginLeft: 34}}>
            {this.state.svnTags.map((tag, index) => {
              const tagElem = (
                <Tag key={tag}
                     style={{height: 28, lineHeight: '26px', marginTop: 10}}
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
        <Row style={RowStyle}>
          <Col style={{marginLeft: 34}}>
            {/*审批权限*/}
            {
              originData.canAuthorize && (
                <Button type="primary" size="large" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  通过
                </Button>
              )
            }
            {
              originData.canAuthorize && (
                <Button type="danger" size="large" onClick={() => {
                  this.handleSubmit(false);
                }} style={{marginRight: '20px'}}>
                  拒绝
                </Button>
              )
            }
            {/*修改权限*/}
            {
              originData.canDelete && (
                <Button type="primary" size="large" onClick={() => {
                  this.handleSubmit(true);
                }} style={{marginRight: '20px'}}>
                  提交
                </Button>
              )
            }
            {
              originData.canDelete && (
                <Button type="danger"
                        size="large"
                        onClick={this.showConfirmModal}
                        style={{marginRight: '20px'}}
                >
                  删除
                </Button>
              )
            }
            <Button size="large" onClick={this.props.close}>取消</Button>
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep2;
