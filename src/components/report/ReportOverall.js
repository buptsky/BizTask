/*
 * 周报总体概况组件
 */

import {connect} from 'react-redux';
import {Row, Col, Input, Icon} from 'antd';
import {bindActionCreators} from 'redux';
import {actionCreator} from '../../actions/action-creator';
import ReportTable from './ReportTable';
import * as CommonActions from '../../actions/common';

const { TextArea } = Input;

@connect(
  state => ({}),
  dispatch => ({})
)
class ReportOverall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableWorkInput: true,
      disableRiskInput: true,
    }
  }

  disableInput = (type) => {
    if (type === 'work') {
      this.setState({disableWorkInput: false});
    } else if (type === 'risk') {
      this.setState({disableRiskInput: false});
    }
  }

  componentWillMount() {
  }

  render() {
    const {disableWorkInput, disableRiskInput} = this.state;
    return (
      <div className="report-overall">
        <Row>
          <Col span={2}>
            <span style={{paddingRight: 10}}>主要工作</span>
            {
              disableWorkInput ?
                (<Icon type="edit" onClick={() => {this.disableInput('work')}}/>)
                :
                (
                  <div style={{display: 'inline-block'}}>
                    <Icon type="save" style={{paddingRight: 5}} onClick={() => {this.disableInput('work')}}/>
                    <Icon type="rollback" onClick={() => {this.disableInput('work')}}/>
                  </div>
                )
            }
          </Col>
          <Col span={8}>
            <TextArea rows={2} style={{resize: 'none'}} disabled={disableWorkInput}/>
          </Col>
          <Col span={2} offset={1}>
            问题/风险
            <Icon type="edit" onClick={() => {this.disableInput('work')}}/>
          </Col>
          <Col span={8}>
            <TextArea rows={2} style={{resize: 'none'}} disabled={disableRiskInput}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReportOverall;