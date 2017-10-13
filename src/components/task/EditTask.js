import {
  Form, Input, Button, DatePicker, Select,
  Row, Col, Timeline, Spin, Upload, Icon, message
} from 'antd';
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
    this.message = '';  //留言消息
    this.state = {
      taskDetail: {},
      fileList: [],
      isLoading: true,
      isSubmitting: false
    };
  }

  componentDidMount() {
    fetchData({
      url: '/task/getTaskDetail.do',
      data: {
        taskId: this.props.taskId
      }
    }).then(data => {
      const stateFileList = data.fileList.map((file) => {
        return {
          uid: file.fid,
          name: file.fileName,
          url: file.filePath,
          status: 'done'
        };
      });
      this.setState({
        taskDetail: data,
        fileList: stateFileList,
        isLoading: false
      });
    });
  }

  /*渲染TimeLine部分*/
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

  changeMessage = (e) => {
    this.message = e.target.value;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          isSubmitting: true
        });
        if (values.rangeTime) {
          values.startTime = moment(values.rangeTime[0]).format('YYYY-MM-DD');
          values.endTime = moment(values.rangeTime[1]).format('YYYY-MM-DD');
          values.rangeTime = undefined;
          /*values.rangeTime = values.rangeTime.map((time) => {
            return moment(time).format('YYYY-MM-DD');
          });*/
        }
        values.taskId = this.props.taskId;
        values.messageContent = this.message;
        /*附件列表*/
        values.attachment = this.state.fileList.map((file) => {
          return `${file.uid}*${file.name}`   //接口格式需要
        });
        fetchData({
          url: '/task/updateTask.do',
          data: values
        }).then(() => {
          this.setState({
            isSubmitting: false
          });
          this.props.closeEditTask();
          this.props.getTasks(this.props.queryArgs);
        });
      }
    });
  };

  renderForm = () => {
    const {
      onCancel,
      persons,
      personsAndGroups
    } = this.props;
    const {getFieldDecorator} = this.props.form;

    const {taskDetail, fileList, isSubmitting} = this.state;
    const chargeSelectOptions = persons.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    const attentionSelectOptions = personsAndGroups.map((person) => {
      return <SelectOption key={person.name}>{person.label}</SelectOption>;
    });
    const defaultRangeTime = taskDetail.rangeTime;
    const me = this;
    const uploadProps = {
      name: 'file',
      //action: 'api/task/upload_attachment',
      action: '/upload/upload.do',
      onChange(info) {
        let fileList = info.fileList;
        const file = info.file;
        if (file.status === 'uploading') {
          me.setState({fileList});
        }
        if (file.status === 'done') {
          /*根据服务器的响应生成新的fileList*/
          const fileData = file.response.data;
          fileList.splice(-1, 1, {
            uid: fileData.fid,
            name: fileData.fileName,
            url: fileData.filePath,
            status: 'done'
          });
        } else if (file.status === 'error') {
          message.error(`${file.name}文件上传失败`);
        }
        me.setState({fileList});
      },
      fileList: fileList
    };
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
              label=""
              {...formItemLayout}
            >
              <Upload {...uploadProps}>
                <Button>
                  <Icon type="upload"/> 上传附件
                </Button>
              </Upload>
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
          <TextArea rows={4}
                    className="note"
                    placeholder="你可以在这里留言"
                    onChange={this.changeMessage}
          />
        </Col>
      </Row>
    );
  };

  render() {
    const {isLoading} = this.state;
    return (
      <div>
        {isLoading ? <Spin/> : this.renderForm()}
      </div>
    );
  }
}

export default Form.create()(EditTask);