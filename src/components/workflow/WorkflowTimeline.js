/*
 * 时间轴组件，用于展示流程进度
 */
import {Timeline, Icon} from 'antd';

class WorkflowTimeline extends React.Component {

  constructor(props) {
    super(props);
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
          <span>{item.status ? item.employee : `等候 ${item.employee} 处理...`}</span>
          <span>{item.status ? item.status : ''}</span>
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
    const {data} = this.props;
    return (
      <Timeline className="timeline">
        {
          data.map((item, index) => {
            let flag = index === data.length - 1;
            let ret = this.renderItem(item);
            return (
              <Timeline.Item
              key={item.name}
              dot={flag ? <Icon type="clock-circle-o" style={{color: ret.color}}></Icon> : ''}
              color={ret.color}
              >{ret.content}</Timeline.Item>)
          })
        }
      </Timeline>
    );
  }
}
export default WorkflowTimeline;
