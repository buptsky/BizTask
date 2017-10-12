import {Button, Input, Row, Col, Icon, Popover, Select, Checkbox, AutoComplete, Tag} from 'antd';
import {connect} from 'react-redux';
import {debounce} from '../../utils/common';
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
  dispatch => ({})
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
      indeterminate: true, // checkbox全选样式控制
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
  onSubmit = () => {

  }
  // 更改svn组
  changeGroup = (value) => {
    const ret =  this.state.groupAndSvnList.filter((item) => {
      return item.group === value;
    })
    this.setState({
      currentSvns: ret[0].svns,
      currentCheckedList: [],
      indeterminate: true,
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
        indeterminate: true,
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
    const data = this.props.flowDetailData;
    const lists = this.state.groupAndSvnList;
    const svns = this.state.currentSvns;
    // 筛选后的仓库路径下拉选项
    // 仓库路径下拉选项
    const svnOpts = this.state.filterSvns.map((path) => {
      return <Option key={path}>{path}</Option>;
    });
    // svn分组下拉选项
    const svnGroupOpts = lists.map((item) => {
      return (<Option key={item.group} value={item.group}>{item.group}</Option>)
    });
    // 多选框组内容
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
            <Input value={data.flowName} style={{height: 32}} disabled/>
          </Col>
        </Row>
        <Row style={{...RowStyle, ...ColorStyle}}>
          {data.formData.name}({data.formData.email})的入职准备工作如下:
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请邀请QQ号 <span style={ColorStyle}>{data.formData.qq}</span> 加入biztechQQ群及组内联系群
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请检查是否需要给邮箱号：<span style={ColorStyle}>{data.formData.email}</span> 开通产品文档权限
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请将微信账号 <span style={ColorStyle}>{data.formData.weixin}</span> 邀请加入biztech微信群
        </Row>
        <Row style={RowStyle}>
          <Icon type="flag" style={{padding: '0 10px'}} />
          请将邮箱 <span style={ColorStyle}>{data.formData.email}</span> 加入组内邮件组
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
            <Button type="primary" size="large" onClick={this.onSubmit}>提交</Button>
            <Button style={{marginLeft: '20px'}} size="large">取消</Button>
          </Col>
        </Row>
      </div>
    );
  }
}

export default NewEmployeeStep2;
