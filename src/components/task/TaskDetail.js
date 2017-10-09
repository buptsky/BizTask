import {Form, Input, Button, DatePicker,Select } from 'antd';
import {connect} from 'react-redux';

const { RangePicker } = DatePicker;
const Option = Select.Option;
const { TextArea } = Input;
const FormItem = Form.Item;
const formItemLayout = { // 标签 + 输入
  labelCol: {span: 6},
  wrapperCol: {span: 16, offset: 1}
};
function mapStateToProps(state) {
  return {
    persons: state.common.commonData.persons,
    personsAndGroups: state.common.commonData.personsAndGroups
  };
}

function mapDispatchToProps(dispatch) {
  /*return bindActionCreators({
    activeHeaderMenu: CommonActions.activeHeaderMenu,
    openTaskDetail: TaskActions.openTaskDetail,
    closeTaskDetail: TaskActions.closeTaskDetail
  }, dispatch);*/
  //return bindActionCreators(,dispatch);
}

@connect(mapStateToProps, mapDispatchToProps)
class TaskPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount() {
    const {taskId} = this.props;
    if (taskId) {
      console.log('edit');
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.rangeTime) {
          values.startTime = moment(values.rangeTime[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.rangeTime[1]).format('YYYY-MM-DD');
        }
        this.props.new
      }
    });
  };

  render() {
    const {closeDetail,persons,personsAndGroups} = this.props;
    const {getFieldDecorator} = this.props.form;
    const chargeSelectOptions = persons.map((person)=>{
      return <Option key={person.name}>{person.label}</Option>;
    });
    const attentionSelectOptions = personsAndGroups.map((person)=>{
      return <Option key={person.name}>{person.label}</Option>;
    });
    return (
        <Form onSubmit={this.handleSubmit}>
          <FormItem
            label="任务名称"
            {...formItemLayout}
          >
            {getFieldDecorator('taskName', {
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
            {getFieldDecorator('followUsers')(
              <Select mode="multiple">
                {attentionSelectOptions}
              </Select>
            )}
          </FormItem>
          <FormItem
            label="任务时限"
            {...formItemLayout}
          >
            {getFieldDecorator('rangeTime')(
              <RangePicker/>
            )}
          </FormItem>
          <FormItem
            label="任务描述"
            {...formItemLayout}
          >
            {getFieldDecorator('description')(
              <TextArea rows={4} />
            )}
          </FormItem>
          <FormItem
            wrapperCol={{ span: 8, offset: 8 }}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
            <Button style={{marginLeft: '20px'}} onClick={closeDetail}>
              取消
            </Button>
          </FormItem>
        </Form>
    );
  }
}
export default Form.create()(TaskPanel);
