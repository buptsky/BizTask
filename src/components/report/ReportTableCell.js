/*
 * 报告中可编辑的单元格
 */
import {Table, Input, Popconfirm} from 'antd';

class ReportTableCell extends React.PureComponent {
  constructor(props) {
    super(props);
    console.log(this.props.value);
    this.state = {
      value: this.props.value, // 单元格的值
      editable: false // 单元格当前是否可编辑
    }
  }

  componentWillReceiveProps(nextProps) {
    // 改变编辑状态
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      // 编辑模式下需要缓存原有的值，用于恢复
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    // 保存/取消操作
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') { // 确认存储本次输入
        this.props.onChange(this.state.value); // 将改变变更至父组件
      } else if (nextProps.status === 'cancel') { // 取消输入
        this.setState({ value: this.cacheValue }); // 重新读回缓存
        this.props.onChange(this.cacheValue); // 将改变变更至父组件
      }
    }
  }
  // 改变输入值
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }

  render() {
    const { value, editable } = this.state;
    // console.log(value);
    return (
      <div>
        {
          editable ?
            <div>
              <Input
                value={value}
                onChange={e => this.handleChange(e)}
              />
            </div>
            :
            <div className="editable-row-text">
              {value.toString() || ' '}
            </div>
        }
      </div>
    );
  }
}

export default ReportTableCell;