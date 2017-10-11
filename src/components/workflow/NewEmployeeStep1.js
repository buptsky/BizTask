import {Icon, Button, Form, Select, Input, Tag, Checkbox, Radio, AutoComplete, Row, Col} from 'antd';
// antd 组件配置
const FormItem = Form.Item;
const Option = Select.Option;
const {TextArea} = Input;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
// 表单样式结构配置
const formItemLayout = { // 标签 + 输入
  labelCol: {span: 6},
  wrapperCol: {span: 16, offset: 1}
}
const formItemLayout2 = { // 仅输入
  wrapperCol: {span: 16, offset: 7}
}
class NewEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {}

  // 表单提交
  handleSubmit = (e) => {
    // 还没有进行表单检测处理
    e.preventDefault();
    let commonArgs = {}; // 表单通用数据
    let formData = {};
    this.props.form.validateFields((err, values) => {
      if (err) { // 表单提交错误
        console.log(err);
        return;
      }
      // 获取流程类型ID
      commonArgs['flowTypeId'] = '101';
      // 获取流程名称（流程前缀 + 仓库名） (后续需要对名称进行处理，如去掉空格)
      commonArgs['flowName'] = this.state.flownamePrefix + values['create-name'];
      // 本次操作的留言,从父组件获取
      commonArgs['message'] = this.props.message;
      console.log({...commonArgs, formData}); // 最后提交的参数集
    });
  }

  render() {
    const {getFieldDecorator} = this.props.form;

    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
        >
          <div>这里是新员工入职表单第一步</div>
        </Form>
      </div>
    );
  }
}

export default Form.create()(NewEmployeeForm);
