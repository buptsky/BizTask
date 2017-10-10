/*
 * panel 面板通用组件
 * 面板控制自身的显示隐藏
 * props参数（可选）
 * visible[Boolean] 面板是否可见
 * title[string] 面板标题 / footer[Boolean] 是否展示操作按钮
 * onOk[Function] 点击确认回调 / onCancel[Function] 点击右上角叉或取消按钮的回调
 */
import React from 'react';
import './panel.css';
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
};

class Panel extends React.Component {

  constructor() {
    super();
    this.state = {
      hover: false, // 记录右上角按钮是否hover
      showFlag: false, // 控制面板内容显示隐藏
      wrapperClass: 'panel-wrapper', // 面板容器类名
      open: false // 当前是否是开启状态
    };
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.visible) {
      this.setState({
        showFlag: true,
        open: true
      });
    } else if (nextProps.visible === false && this.state.open){
      this.setState({
        wrapperClass: 'panel-wrapper close'
      }, () => { // 延时关闭
        setTimeout(() => {
          this.setState({
            showFlag: false,
            wrapperClass: 'panel-wrapper',
            open: false
          });
        }, 200);
      });
    }
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
    this.setState({hover: !this.state.hover})
  };

  render() {
    // 关闭按钮的动态改变style
    let iconStyle = {};
    let maskStyle = {};
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
    if (this.state.showFlag) {
      maskStyle = {
        position: 'fixed',
        zIndex: 1001,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, .3)'
      };
    } else {
      maskStyle = {};
    }

    return (
      <div className="bizwork-panel" style={maskStyle}>
        {this.state.showFlag &&
          (
            <div className={this.state.wrapperClass}>
              <div className="panel-header">
                <div className="title">{(this.props && this.props.title) || 'title'}</div>
                <Icon type="close"
                      style={iconStyle}
                      onMouseEnter={this.toggleHover}
                      onMouseLeave={this.toggleHover}
                      onClick={this.close}/>
              </div>
              {/*Panel内容区由用户提供*/}
              <div className="panel-content">
                {/*暂时只支持传入一个react元素*/}
                {this.props.children}
              </div>
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
      </div>

    );
  }
}

export default Panel;