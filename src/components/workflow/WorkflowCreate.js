import {Icon, Button, Form, Select, Input} from 'antd';
import Panel from '../common/panel/panel';

const FormItem = Form.Item;
const Option = Select.Option;

class WorkflowCreate extends React.Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  createConfirm = () => {
    this.props.close();
    this.handleSubmit();
    console.log('panel confirm');
  }

  createCancel = () => {
    this.props.close();
    console.log('panel cancel');
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
     <Panel cancel={this.createCancel}
            confirm={this.createConfirm}
            disableBtn={true}
            panelTitle="创建流程"
     >
       <Form onSubmit={this.handleSubmit} className="login-form">
         <FormItem>
           {getFieldDecorator('userName', {})(
             <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
           )}
         </FormItem>
         <FormItem>
           {getFieldDecorator('password', {})(
             <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
           )}
         </FormItem>
         <FormItem>
           <Button type="primary" htmlType="submit">
             Log in
           </Button>
         </FormItem>
       </Form>
     </Panel>
    );
  }
}
export default Form.create()(WorkflowCreate);
