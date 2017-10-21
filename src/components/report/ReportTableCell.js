/*
 * 报告中可编辑的单元格
 */
import {Input, Tooltip, Icon, message, Popconfirm} from 'antd';

class ReportTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value,// 单元格的值
      isTypeCell: this.props.isTypeCell, // 是否为类型单元
      typeEditable: false, // 类型单元是否可编辑
      checkVisible: false
    }
  }

  componentWillReceiveProps(nextProps) {
    // 表头的逻辑自身控制
    if (this.state.isTypeCell) return;
    // 如果是可编辑状态
    if (nextProps.editable) {
      this.cacheValue = this.state.value; // 编辑模式下需要缓存原有的值，用于恢复
    }
    // 保存/取消操作
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') { // 确认存储本次输入
        this.props.onChange(this.state.value); // 将改变变更至父组件
      } else if (nextProps.status === 'cancel') { // 取消输入
        this.setState({value: this.cacheValue}); // 重新读回缓存
        // this.props.onChange(this.cacheValue); // 将改变变更至父组件
      }
    }
  }

  // 改变输入值
  handleChange = (e) => {
    const value = e.target.value;
    this.setState({value});
  }

  // 受传参限制，每次渲染都会传入一个内存位置变化的onChange函数，在判断中不考虑此变化
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.props.editable ||
      nextState.value !== this.state.value ||
      nextState.typeEditable !== this.state.typeEditable ||
      nextState.checkVisible !== this.state.checkVisible;
  }

  check = () => {
    if (!this.state.value) { // 保存的数据不能非空
      message.warning('请填写分类名');
      return;
    }
    if (this.state.value === '未定义bizreport') { // 保留类型
      message.warning("请填不要使用'未定义bizreport'作为分类名");
      return;
    }
    if (this.props.checkTypeCell(this.state.value)) { // 检测类名是否重复
      this.setState({checkVisible: true});
      return;
    }
    this.save();
  }


  save = () => {
    this.setState({
      typeEditable: false,
      checkVisible: false
    });
    this.props.onChange(this.state.value);
  }


  cancel = () => {
    this.setState({
      value: this.cacheValue,
      typeEditable: false
    });
  }

  edit = () => {
    this.cacheValue = this.state.value; // 编辑模式下需要缓存原有的值，用于恢复
    this.setState({typeEditable: true},() => this.input.focus());
  }

  render() {
    const {value, isTypeCell, typeEditable, checkVisible} = this.state;
    const {editable, tip} = this.props;
    return (
      <div>
        {
          isTypeCell ? (
              <div>
                {
                  typeEditable ? (
                      <div className="editable-cell-input-wrapper">
                        <Input
                          value={value}
                          onChange={this.handleChange}
                          ref={(input) => {this.input = input}}
                        />
                        <div style={{textAlign: 'center'}}>
                          <Popconfirm
                            visible={checkVisible}
                            onConfirm={this.save}
                            onCancel={this.cancel}
                            title="分类名已存在，合并分类?（不可撤销）"
                          >
                            <Icon
                              type="save"
                              title="保存"
                              style={{cursor: 'pointer'}}
                              onClick={this.check}
                            />
                          </Popconfirm>
                          <Popconfirm title="确定要取消更改么？"
                                      onConfirm={this.cancel}>
                            <Icon type="rollback"
                                  style={{cursor: 'pointer', paddingLeft: 10}}
                                  title="取消"
                            />
                          </Popconfirm>
                        </div>
                      </div>
                    ) :
                    (
                      <div className="editable-cell-text-wrapper">
                        {value.toString() || ' '}
                        <Icon
                          type="edit"
                          title="编辑"
                          style={{cursor: 'pointer'}}
                          onClick={this.edit}
                        />
                      </div>
                    )
                }
              </div>
            ) :
            (
              <div>
                {
                  editable ?
                    <div>
                      <Tooltip title={tip} placement="topLeft">
                        <Input value={value} onChange={this.handleChange}/>
                      </Tooltip>
                    </div>
                    :
                    <div className="editable-row-text">
                      {value.toString() || ' '}
                    </div>
                }
              </div>
            )
        }
      </div>
    );
  }
}

export default ReportTableCell;