/*
 * 组件用于对任务列表进行筛选
 * 组件维护自身的显示隐藏
 * 接受一个可选参数
 * ①type 筛选申请种类
 * = pending-apply 待处理请求，隐藏所有筛选；= my-apply 个人申请，隐藏发起人; = all-apply 所有申请，全部展示
 */


import {Form, Button, Select, DatePicker, Input} from 'antd';
import config from './WorkflowConfig';
import moment from 'moment';

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
    if (args['end-rangeTime']) {
      args.beginDate = moment(args['end-rangeTime'][0]).format('YYYY-MM-DD');
      args.endDate = moment(args['end-rangeTime'][1]).format('YYYY-MM-DD');
    }
    console.log(args);
    // if (args.rangeTime) {
    //   args.beginDate = moment(args.rangeTime[0]).format('YYYY-MM-DD');
    //   args.endDate = moment(args.rangeTime[1]).format('YYYY-MM-DD');
    // }
    // delete args.rangeTime;
    // const selectedNodeId = this.props.selectedNodeId;
    // args.planId = selectedNodeId.split('-')[0] || '';
    // args.groupId = selectedNodeId.split('-')[1] || '';
    // args.pageNo = 1;
    // this.props.searchIdeaList(args);
  };

  render() {
    const {getFieldDecorator} = this.props.form;
    // const yesterday = moment().subtract(1, 'day');
    return (
      this.props.type !== 'pending-apply' ?
        (
          <Form layout="inline" onSubmit={this.handleSubmit} style={{padding: '20px 10px', width: '80%'}}>
            <FormItem label="工作流程">
              {getFieldDecorator('workflow-type', {initialValue: 'search-all'})(
                <Select style={{width: 120}}>
                  <Option style={{width: 120}} key="search-all" value="search-all">全部</Option>
                  {
                    config.workflowType.map((type) => {
                      return (<Option key={type.value} value={type.value}>{type.title}</Option>);
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem label="流程名称">
              {getFieldDecorator('workflow-name', {initialValue: ''})(
                <Input/>
              )}
            </FormItem>
            {
              this.props.type === 'all-apply' ?
                (
                  <FormItem label="发起人">
                    {getFieldDecorator('workflow-initiator', {initialValue: ''})(
                      <Input/>
                    )}
                  </FormItem>
                ) : null
            }
            <FormItem label="状态">
              {getFieldDecorator('workflow-status', {initialValue: 'all'})(
                <Select style={{width: 120}}>
                  <Option style={{width: 120}} key="all" value="all">无限制</Option>
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

