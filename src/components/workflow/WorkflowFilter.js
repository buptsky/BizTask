/*
 * 组件用于对申请列表进行筛选
 * 组件维护自身的显示隐藏
 * 接受一个可选参数
 * ①type 筛选申请种类
 * = pending-apply 待处理请求，隐藏所有筛选；= my-apply 个人申请，隐藏发起人; = all-apply 所有申请，全部展示
 */


import {Form, Button, Select, DatePicker, Input} from 'antd';
import config from './WorkflowConfig';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

class ApplyFilter extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e && e.preventDefault();
    const args = this.props.form.getFieldsValue();
    let flowTypeId = '0'; // 工作流程id
    console.log(args);
    // 分配工作流程id
    // 新员工入职选项存在一些问题情况，之后复核
    if (args['workflow-type'] === 'search-all') {
      flowTypeId = '0';
    } else {
      flowTypeId = args['workflow-type'];
    }
    // 获取发起时间段
    args.startTime = [moment(args['start-rangeTime'][0]).format('YYYY-MM-DD'), moment(args['start-rangeTime'][1]).format('YYYY-MM-DD')].join(',');
    args.endTime = [moment(args['end-rangeTime'][0]).format('YYYY-MM-DD'), moment(args['end-rangeTime'][1]).format('YYYY-MM-DD')].join(',');
    const submitArgs = {
      flowTypeId: flowTypeId,
      flowName: args['workflow-name'],
      status: args['workflow-status'].toString(),
      startTime: args['startTime'],
      endTime: args['endTime'],
      pageSize: config.tablePagination.defaultPageSize.toString(),
      pageNo: 1,
      isDone: true, // 这个字段不知道什么用
      employee: args['workflow-employee'] ? args['workflow-employee'] : ''
    };
    this.props.filterChange(submitArgs);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    // const yesterday = moment().subtract(1, 'day');
    return (
      this.props.type !== 'pending-apply' ?
        (
          <Form layout="inline" onSubmit={this.handleSubmit} style={{padding: '10px 10px', width: '80%'}}>
            <FormItem label="工作流程" style={{marginTop: '10px'}}>
              {getFieldDecorator('workflow-type', {initialValue: 'search-all'})(
                <Select style={{width: 120}}>
                  <Option style={{width: 120}} key="search-all" value="search-all">全部</Option>
                  {
                    this.props.flowTypes.map((type) => {
                      return (<Option key={type.flowTypeId} value={type.flowTypeId.toString()}>{type.flowTypeName}</Option>);
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label="流程名称" style={{marginTop: '10px'}}>
              {getFieldDecorator('workflow-name', {initialValue: ''})(
                <Input/>
              )}
            </FormItem>
            {
              this.props.type === 'all-apply' ?
                (
                  <FormItem label="发起人" style={{marginTop: '10px'}}>
                    {getFieldDecorator('workflow-employee', {initialValue: ''})(
                      <Input/>
                    )}
                  </FormItem>
                ) : null
            }
            <FormItem label="状态" style={{marginTop: '10px'}}>
              {getFieldDecorator('workflow-status', {initialValue: '0'})(
                <Select style={{width: 120}}>
                  <Option style={{width: 120}} key="all" value="0">无限制</Option>
                  {
                    config.workflowStatus.map((type) => {
                      return (<Option key={type.value}>{type.title}</Option>);
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label="发起时间" style={{marginTop: '10px'}}>
              {getFieldDecorator('start-rangeTime',
                {initialValue: config.startDateRange.initialRange})(
                <RangePicker ranges={config.startDateRange.quickPiker}/>
              )}
            </FormItem>
            <FormItem label="完结时间" style={{marginTop: '10px'}}>
              {getFieldDecorator('end-rangeTime',
                {initialValue: config.endDateRange.initialRange})(
                <RangePicker ranges={config.endDateRange.quickPiker}/>
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" htmlType="submit" style={{marginTop: '10px'}}>查询</Button>
            </FormItem>
          </Form>
        )
        : null
    )
  }
}

export default Form.create()(ApplyFilter);

