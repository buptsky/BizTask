/*
 * 报告中可编辑的单元格
 */
import {Input, Tooltip} from 'antd';

class ReportTableCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value // 单元格的值
    }
  }

  componentWillReceiveProps(nextProps) {
    // 如果是可编辑状态
    if (nextProps.editable) {
      this.cacheValue = this.state.value; // 编辑模式下需要缓存原有的值，用于恢复
    }
    // 保存/取消操作
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') { // 确认存储本次输入
        this.props.onChange(this.state.value); // 将改变变更至父组件
      } else if (nextProps.status === 'cancel') { // 取消输入
        this.setState({ value: this.cacheValue }); // 重新读回缓存
        // this.props.onChange(this.cacheValue); // 将改变变更至父组件
      }
    }
  }
  // 改变输入值
  handleChange(e) {
    const value = e.target.value;
    this.setState({ value });
  }
  // 受传参限制，每次渲染都会传入一个内存位置变化的onChange函数，在判断中不考虑此变化
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.props.editable ||
      nextState.value !== this.state.value;
  }

  render() {
    const { value } = this.state;
    const { editable, tip } = this.props;
    return (
      <div>
        {
          editable ?
            <div>
              <Tooltip title={tip} placement="topLeft">
                <Input value={value} onChange={e => this.handleChange(e)}/>
              </Tooltip>
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