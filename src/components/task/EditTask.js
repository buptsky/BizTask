import {Form, Input, Button, DatePicker, Select, Row, Col, Timeline, Spin} from 'antd';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as TaskActions from '../../actions/task';

const {RangePicker} = DatePicker;
const SelectOption = Select.Option;
const {TextArea} = Input;
const FormItem = Form.Item;
const formItemLayout = { // 标签 + 输入
  labelCol: {span: 5},
  wrapperCol: {span: 16, offset: 1}
};

function mapStateToProps(state) {
  return {
    persons: state.common.commonData.persons,
    personsAndGroups: state.common.commonData.personsAndGroups,
    queryArgs: state.task.queryArgs,   //修改完根据此参数重新查询task列表
    ...state.task.editTask
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TaskActions, dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class EditTask extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTimeLine = (taskDetail) => {
    return (
      <Timeline>
        {
          taskDetail.optionLog.map((optionLog) => {
            const {operator, operation, opetationTime} = optionLog;
            return <Timeline.Item key={opetationTime}>{operator} {operation} {opetationTime}</Timeline.Item>;
          })
        }
      </Timeline>
    );
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.rangeTime) {
          /*values.startTime = moment(values.rangeTime[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.rangeTime[1]).format('YYYY-MM-DD');*/
          values.rangeTime = values.rangeTime.map((time) => {
            return moment(time).format('YYYY-MM-DD');
          });
        }
        values.taskId = this.props.taskDetail.taskId;
        this.props.updateTask(values, this.props.queryArgs);
      }
    });
  };

  renderForm = () => {
    const {
      onCancel,
      taskDetail,
      persons,
      personsAndGroups,
      isSubmitting
    } = this.props;
    const {getFieldDecorator} = this.props.form;
    const chargeSelectOptions = persons.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    const attentionSelectOptions = personsAndGroups.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    const defaultRangeTime = taskDetail.rangeTime;
    return (
      <Row>
        {/*左侧表单*/}
        <Col span={12} className="panel-left">
          <Form onSubmit={this.handleSubmit}>
            <FormItem
              label="任务名称"
              {...formItemLayout}
            >
              {getFieldDecorator('taskName', {
                initialValue: taskDetail.taskName || '',
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
                initialValue: taskDetail.chargeUser || '',
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
                initialValue: taskDetail.followUsers || [],
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
                initialValue: defaultRangeTime ? [moment(defaultRangeTime[0]), moment(defaultRangeTime[1])] : [],
              })(
                <RangePicker/>
              )}
            </FormItem>
            <FormItem
              label="任务描述"
              {...formItemLayout}
            >
              {getFieldDecorator('description', {
                initialValue: taskDetail.description || [],
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
        </Col>
        {/*右侧时间线和留言*/}
        <Col span={10} offset={2} className="panel-right">
          {this.renderTimeLine(taskDetail)}
        </Col>
      </Row>
    );
  };

  render() {
    const {isLoading} = this.props;
    return (
      <div>
        {isLoading ? <Spin/> : this.renderForm()}
      </div>
    );
  }
}

export default Form.create()(EditTask);