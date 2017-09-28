/*
 * panel 面板通用组件
 * 组件依赖react-transition-group动画库和antd组件库
 * 面板本身不具备关闭开启功能，该功能由父组件控制
 * props参数（可选）
 * panelTitle[string]面板类型/ cancel[Function]面板取消回调/ confirm[Function]面板确认回调
 */
import React from 'react';
import './panel.css';
import {CSSTransitionGroup} from 'react-transition-group';
import {Icon, Button} from 'antd';
// 控制antd icon,button组件的样式
const commonStyle = {
  icon: {
    position: 'absolute',
    top: '25px',
    right: '28px',
    fontSize: '30px',
    cursor: 'pointer',
    transition: 'all 0.6s ease-in-out'
  },
  button: {
    marginRight: '20px'
  }
}

class Panel extends React.Component {

  constructor() {
    super();
    this.state = {
      title: (this.props && this.props.panelTitle) || '创建流程',
      hover: false // 记录右上角按钮是否hover
    };
  }

  // 关闭回调
  close = () => {
    (this.props && this.props.cancel) ? this.props.cancel() : '';
  }
  // 确认回调
  confirm = () => {
    (this.props && this.props.confirm) ? this.props.confirm() : '';
  }
  // 关闭按钮动态效果
  toggleHover = () => {
    this.setState({hover: !this.state.hover})
  }

  render() {
    // 关闭按钮的动态改变style
    var iconStyle;
    if (this.state.hover) {
      iconStyle = {
        ...commonStyle.icon,
        transform: 'rotateZ(180deg)'
      }
    } else {
      iconStyle = {
        ...commonStyle.icon,
        transform: 'rotateZ(0)'
      }
    }

    return (
      <div className="panel">
        <CSSTransitionGroup
          component="div"
          transitionName="panel-action"
          transitionEnter={false}
          transitionLeave={false}
          transitionAppear={true}
          transitionAppearTimeout={500}
        >
          <div className="wrapper" key="panel">
            <div className="panel-header">
              <div className="title">{this.state.title}</div>
              <Icon type="close" style={iconStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}
                    onClick={this.close}/>
            </div>
            {/*Panel内容区由用户提供*/}
            <div className="panel-content">
              {/*暂时只支持传入一个react元素*/}
              {this.props.children}
            </div>
            <div className="panel-footer">
              <Button type="primary" style={commonStyle.button} onClick={this.confirm}>确认</Button>
              <Button type="primary" onClick={this.close}>取消</Button>
            </div>
          </div>
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Panel;