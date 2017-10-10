import {Form, Input, Button, DatePicker, Select} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as TaskActions from '../../actions/task';

const {RangePicker} = DatePicker;
const SelectOption = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;
const formItemLayout = { // 标签 + 输入
  labelCol: {span: 6},
  wrapperCol: {span: 16, offset: 1}
};

function mapStateToProps(state) {
  return {
    taskId: state.task.taskModal.taskId,
    persons: state.common.commonData.persons,
    personsAndGroups: state.common.commonData.personsAndGroups,
    isSubmitting: state.task.taskModal.isSubmitting,
    queryArgs: state.task.queryArgs   //添加、修改完根据此参数重新查询task列表
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TaskActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskInfo: {}
    };
  }

  componentDidMount() {
    const {taskId} = this.props;
    if (taskId) {
      fetchData({
        url: '/task/getTaskDetail.do',
        data: {taskId}
      }).then((data) => {
        this.setState({
          taskInfo: data
        });
      });
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.rangeTime) {
          /*values.startTime = moment(values.rangeTime[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.rangeTime[1]).format('YYYY-MM-DD');*/
          values.rangeTime = values.rangeTime.map((time)=>{
            return moment(time).format('YYYY-MM-DD');
          });
        }
        this.props.addTask(values, this.props.queryArgs);
      }
    });
  };

  render() {
    const {onCancel, persons, personsAndGroups, isSubmitting} = this.props;
    const {taskInfo} = this.state;
    const defaultRangeTime = taskInfo.rangeTime;
    const {getFieldDecorator} = this.props.form;
    const chargeSelectOptions = persons.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    const attentionSelectOptions = personsAndGroups.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem
          label="任务名称"
          {...formItemLayout}
        >
          {getFieldDecorator('taskName', {
            initialValue: taskInfo.taskName || '',
            rules: [{required: true, message: '请输入任务名'}],
          })(
            <Input/>
          )}
        </FormItem>
        <FormItem
          label="负责人"
          {...formItemLayout}
        >
          {getFieldDecorator('chargeUser', {
            initialValue: taskInfo.chargeUser || '',
            rules: [{required: true, message: '请选择负责人'}],
          })(
            <Select showSearch>
              {chargeSelectOptions}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="关注人"
          {...formItemLayout}
        >
          {getFieldDecorator('followUsers', {
            initialValue: taskInfo.followUsers || [],
          })(
            <Select mode="multiple">
              {attentionSelectOptions}
            </Select>
          )}
        </FormItem>
        <FormItem
          label="任务时限"
          {...formItemLayout}
        >
          {getFieldDecorator('rangeTime', {
            initialValue: defaultRangeTime? [moment(defaultRangeTime[0]),moment(defaultRangeTime[1])] : [],
          })(
            <RangePicker/>
          )}
        </FormItem>
        <FormItem
          label="任务描述"
          {...formItemLayout}
        >
          {getFieldDecorator('description',{
            initialValue: taskInfo.description || [],
          })(
            <TextArea rows={4}/>
          )}
        </FormItem>
        <FormItem
          wrapperCol={{span: 8, offset: 8}}>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            确定
          </Button>
          <Button style={{marginLeft: '20px'}} onClick={onCancel}>
            取消
          </Button>
        </FormItem>
      </Form>
    );
  }
}

export default Form.create()(TaskModal);
