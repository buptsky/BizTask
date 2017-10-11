/*
 * 时间轴组件，用于展示流程进度
 * 根据不同的流程状态，显示对应的提示图标和颜色
 */
import {Timeline, Icon} from 'antd';

class WorkflowTimeline extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      defaultLine: [
        {name: "拟稿", employee: "当前用户", dateTime: null, status: null, remarks: null}
      ]
    }
  }

  renderItem = (item) => {
    let statusClass = '';
    let color = '';
    switch (item.status) {
      case '已完成':
        statusClass = 'success';
        color = '#00a854';
        break;
      case '同意':
        statusClass = 'success';
        color = '#00a854';
        break;
      case '拒绝':
        statusClass = 'fail';
        color = '#f04134';
        break;
      default:
        statusClass = 'pending';
        color = '#108ee9';
    }
    let content = (
      <div className="line-content">
        <div className={`line-head ${statusClass}`}>
          <div className="line-split"></div>
          <div className="line-title">{item.name}</div>
        </div>
        <div className="line-date">{item.dateTime}</div>
        <div className="line-check">
          <span>{item.dateTime ? item.employee : `等候 ${item.employee} 处理...`}</span>
          <span>{item.dateTime ? item.status : ''}</span>
        </div>
        {
          item.remarks ?
            (
              <p className="line-remark">
                {item.remarks}
              </p>
            ) : ''
        }
      </div>
    );

    return {
      color: color,
      content: content
    }
  }

  render() {
    const data = this.props.data || this.state.defaultLine;
    return (
      <Timeline className="timeline">
        {
          data.map((item, index) => {
            let flag = !item.dateTime;
            let ret = this.renderItem(item);
            let dot = "";
            if (item.status === "拒绝") {
              dot = (<Icon type="exclamation-circle-o" style={{color: ret.color}}></Icon>);
            }
            return (
              <Timeline.Item
                key={item.dateTime}
                dot={flag ? <Icon type="clock-circle-o" style={{color: ret.color}}></Icon> : dot}
                color={ret.color}
              >{ret.content}</Timeline.Item>)
          })
        }
        {/*流程已经完成*/}
        {
          (data[data.length - 1].dateTime && data[data.length - 1].status !== '拒绝') &&
            (
              <Timeline.Item
                key="end"
                dot={<Icon type="check-circle-o" style={{color: "#00a854"}}></Icon>}
                color="#00a854"
              ><span style={{color: "#00a854"}}>流程已经通过！</span></Timeline.Item>
            )
        }
      </Timeline>
    );
  }
}

export default WorkflowTimeline;
