import {Icon, Button, Form, Select, Input} from 'antd';
import Panel from '../common/panel/panel';
import config from './WorkflowConfig';
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16, offset: 1 }
}

class WorkflowCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flownamePrefix: `请选择流程-`,
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/',
      disableInput: false
    }
  }

  handleSubmit = (e) => {
    this.textInput.focus();
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  // 切换流程类型,流程名称前缀联动
  changeType = (value) => {
    let newName = '';
    let disableInput = false;
    if (value !== 'option') {
      config.createType.forEach((item) => {
        if (item.value === value) {
          newName = item.title;
        }
      });
    } else {
      newName = '请选择流程'
    }
    if (value !== 'svn-allot') {
      disableInput = true;
    }
    this.setState({
      flownamePrefix: `${newName}-`,
      disableInput: disableInput
    })
    console.log(value);
  }
  // 隐藏仓库名input前缀
  hidePrefix = () => {
    // 由于改变input组件的前缀会使其失去焦点，所以这里需要再次触发focus使其重获焦点
    // 而setState的更新是异步更新，所以需要在更新成功后的回调中进行焦点的再次获取
    this.setState({storenamePrefix: ''}, () => {
      this.textInput.focus();
    });
  }
  // 显示仓库名input前缀
  showPrefix = () => {
    console.log('show');
    this.setState({
      storenamePrefix: 'http://bizsvn.sogou-inc.com/svn/'
    });
  }
  // 同步输入 （可能影响性能，可优化）
  syncInput = (e) => {
    this.props.form.setFieldsValue({
      'create-name': e.target.value
    })
  }

  // 取消创建
  createCancel = () => {
    this.props.close();
    console.log('panel cancel');
  }

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
     <Panel cancel={this.createCancel}
            disableBtn={true}
            panelTitle="创建流程"
     >
       <Form
         onSubmit={this.handleSubmit}
         style={{width: '50%', marginRight: '20px'}}
       >
         <FormItem label="工作流程" {...formItemLayout}>
           {getFieldDecorator('create-type', {initialValue: 'option'})(
             <Select onChange={this.changeType}>
               <Option style={{width: '100%'}} key="option" value="option">请选择</Option>
               {
                 config.createType.map((type)=> {
                   return (<Option key={type.value} value={type.value}>{type.title}</Option>);
                 })
               }
             </Select>
           )}
         </FormItem>
         <FormItem label="流程名称" {...formItemLayout}>
           {getFieldDecorator('create-name', {initialValue: ''})(
             <Input
               addonBefore={this.state.flownamePrefix}
               disabled={this.state.disableInput}
             />
           )}
         </FormItem>
         <FormItem label="仓库名称" {...formItemLayout}>
           {getFieldDecorator('storage-name', {initialValue: ''})(
             <Input addonBefore={this.state.storenamePrefix}
                    onFocus={this.hidePrefix}
                    onBlur={this.showPrefix}
                    onChange={this.syncInput}
                    ref={(input) => { this.textInput = input; }}
             />
           )}
         </FormItem>
         <FormItem label="仓库管理员" {...formItemLayout}>
           {getFieldDecorator('storage-manager', {initialValue: ''})(
             <Input/>
           )}
         </FormItem>
         <FormItem>
           <Button type="primary" htmlType="submit">
             确认
           </Button>
         </FormItem>
       </Form>
     </Panel>
    );
  }
}
export default Form.create()(WorkflowCreate);
