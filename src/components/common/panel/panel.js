/*
 * panel 面板通用组件
 * 面板控制自身的显示隐藏
 * 面板过渡效果由react-transition-group插件提供
 * props参数（可选）
 * visible[Boolean] 面板是否可见 / loading[Boolean] 是否需要异步加载数据
 * title[string] 面板标题 / footer[Boolean] 是否展示操作按钮
 * onOk[Function] 点击确认回调 / onCancel[Function] 点击右上角叉或取消按钮的回调
 */
import React from 'react';
import './panel.css';
import {Icon, Button, Spin} from 'antd';
import {CSSTransitionGroup} from 'react-transition-group';
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
};

class Panel extends React.Component {

  constructor() {
    super();
    this.state = {
      hover: false // 记录右上角按钮是否hover
    };
  }

  // 关闭回调
  close = () => {
    (this.props && this.props.onCancel) ? this.props.onCancel() : '';
  };
  // 确认回调
  confirm = () => {
    (this.props && this.props.onOk) ? this.props.onOk() : '';
  };
  // 关闭按钮动态效果
  toggleHover = () => {
    console.log('toggle');
    this.setState({hover: !this.state.hover})
  };

  render() {
    // 关闭按钮的动态改变style
    let iconStyle = {};
    let maskStyle = {
      position: 'fixed',
      zIndex: -1,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0, 0, 0, .3)'
    };
    if (this.state.hover) {
      iconStyle = {
        ...commonStyle.icon,
        transform: 'rotateZ(90deg)'
      }
    } else {
      iconStyle = {
        ...commonStyle.icon,
        transform: 'rotateZ(0)'
      }
    }
    // 控制外层遮罩
    if (this.props.visible) {
      maskStyle.zIndex = 1001;
    }

    return (
      <div className="bizwork-panel" style={maskStyle}>
        <CSSTransitionGroup
          component="div"
          transitionName="panel-action"
          transitionEnterTimeout={300}
          transitionLeave={false}
        >
          {
            this.props.visible && (
              <div className="panel-wrapper" key="wrapper">
                <div className="panel-header">
                  <div className="title">{(this.props && this.props.title) || 'title'}</div>
                  <Icon type="close"
                        style={iconStyle}
                        onMouseEnter={this.toggleHover}
                        onMouseLeave={this.toggleHover}
                        onClick={this.close}/>
                </div>
                {/*Panel内容区由用户提供*/}
                {
                  this.props.loading ?
                    (
                      <Spin size="large" style={{position: 'absolute', left: '50%', top: '50%'}}/>
                    )
                    : (
                      <div className="panel-content">
                        {/*暂时只支持传入一个react元素*/}
                        {this.props.children}
                      </div>
                    )
                }
                {/*某些情况下不应该使用panel提供的确认取消按钮，如表单提交*/}
                {
                  (this.props.footer === false) ? '' :
                    (
                      <div className="panel-footer">
                        <Button type="primary" style={commonStyle.button} onClick={this.confirm}>确认</Button>
                        <Button type="primary" onClick={this.close}>取消</Button>
                      </div>
                    )
                }
              </div>
            )
          }
        </CSSTransitionGroup>
      </div>
    );
  }
}

export default Panel;