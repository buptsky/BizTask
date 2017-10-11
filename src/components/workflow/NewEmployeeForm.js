import NewEmployeeStep1 from './NewEmployeeStep1';
import NewEmployeeStep2 from './NewEmployeeStep2';
import NewEmployeeStep3 from './NewEmployeeStep3';
// antd 组件配置

class NewEmployeeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentWillMount() {
    console.log(this.props.data);
  }

  render() {
    let data = this.props.data;
    let employeeForm = '';
    if (data.formData) {
      switch (data.formData.step) {
        case 1:
          employeeForm = (<NewEmployeeStep1 data={this.props.data}/>);
          break;
        case 2:
          employeeForm = (<NewEmployeeStep2 data={this.props.data}/>);
          break;
        case 3:
          employeeForm = (<NewEmployeeStep3 data={this.props.data}/>);
          break;
        default:
      }
    }

    return (
      <div>
        {employeeForm}
      </div>
    );
  }
}

export default NewEmployeeForm;
