import {Button, DatePicker} from 'antd';

class ReportFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentData: moment()
    }
  }

  // 禁用的时间选择项
  disabledDate = (current) => {
    return current.valueOf() > Date.now();
  }
  //　选取时间
  onChange = (date, dateString) => {
    console.log(date);
    console.log(dateString);
  }
  // 查看上一周周报
  previousWeek = () => {
    this.setState({currentData: this.state.currentData.subtract(1, 'week')});
  }
  // 查看下一周周报
  nexkWeek = () => {
    this.setState({currentData: this.state.currentData.add(1, 'week')});
  }
  // 查看本周周报
  currentWeek = () => {
    this.setState({currentData: moment()});
  }

  render() {
    return (
      <div className="report-filter">
        周报时间搜索：
        <DatePicker onChange={this.onChange}
                    disabledDate={this.disabledDate}
                    defaultValue={moment()}
                    value={this.state.currentData}
                    allowClear={false}
                    style={{marginRight: 15}}
        />
        <Button type="primary" onClick={this.previousWeek} style={{marginRight: 10}}>上一周</Button>
        <Button type="primary"
                onClick={this.nexkWeek}
                style={{marginRight: 10}}
                disabled={this.state.currentData.clone().add(1, 'week').valueOf() > moment().valueOf()}
        >下一周</Button>
        <Button type="primary" onClick={this.currentWeek}>本周</Button>
      </div>
    );
  }
}

export default ReportFilter;