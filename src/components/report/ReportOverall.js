/*
 * 周报总体概况组件
 * 命名方式 ：
 * ①禁用条目输入：disable + 条目名 ②条目input对应value: 条目名 + value ③条目缓存名：条目名 + cacheValue
 * ④ref引用: 条目名 + input
 */

import {Row, Col, Input, Icon, Popconfirm, Button, Card, Modal} from 'antd';

const {TextArea} = Input;

class ReportOverall extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overAllItems: [
        {name: 'work', value: '主要工作'},
        {name: 'risk', value: '问题/风险'}
      ],
      newItem: '',
      newItemIndex: 0
    }
  }
  // 编辑输入
  editInput = (type) => {
    // 将当前值缓存
    this[`${type}cacheValue`] = this.state[`${type}value`];
    this.setState({
      [`disable${type}`]: false
    }, () => {
      this[`${type}value`].focus();  // 文本框获取焦点
    });
  }
  // 输入框变动
  changeInput = (value, type) => {
    this.setState({
      [`${type}value`]: value
    });
  }
  // 取消输入
  cancelInput = (type) => {
    // 缓存回之前的值
    console.log(this.input);
    this.setState({
      [`${type}value`]: this[`${type}cacheValue`],
      [`disable${type}`]: true
    });
  }
  // 保存输入
  saveInput = (type) => {
    this.setState({
      [`disable${type}`]: true
    });
  }
  // 增加分类
  addItem = () => {
    this.setState({modalVisible: true});
  }
  // 确认添加分类，分类追加到最后
  confirmAddItem = () => {
    const items = this.state.overAllItems;
    const index = this.state.newItemIndex;
    this.setState({
      overAllItems: [...items, {name: `item${index}`, value: this.state.newItem}],
      newItemIndex: index + 1
    }, () => {
      this[`item${index}value`].focus();  // 文本框获取焦点
    });
    this.cancelAddItem();
  }
  // 关闭添加分类modal
  cancelAddItem = () => {
    this.setState({modalVisible: false});
  }
  // 新分类输入变动
  onchangeNewItem = (e) => {
    this.setState({newItem: e.target.value});
  }
  // 删除分类
  deleteItem = (type) => {
    const map = this.state.overAllItems;
    this.setState({
      overAllItems: map.filter((item) => item.name !== type)
    })
  }
  // 收集数据
  collectData = () => {
    let ret = [];
    this.state.overAllItems.forEach((item) => {
      ret.push({
        name: item.name,
        value: item.value,
        desc: this.state[`${item.name}value`]
      });
    });
    return ret;
  }

  componentWillMount() {
    const ret = {};
    this.state.overAllItems.forEach((item) => {
      ret[`disable${item.name}`] = true;
      ret[`${item.name}value`] = '';
    });
    this.setState(ret);
  }

  render() {
    const {overAllItems} = this.state;
    return (
      <div className="report-overall" style={{marginTop: 30}}>
        <Card title="本周总结"
              extra={<Button icon="plus" type="primary" onClick={this.addItem}>增加选项</Button>}
              style={{width: '80%'}}
        >
          {
            overAllItems.map((item, index) => {
              return (
                <div key={item.name}
                     style={{
                       display: 'inline-block',
                       width: '50%',
                       paddingRight: index % 2 ? 0 : 20,
                       paddingBottom: 20
                     }}
                >
                  <div style={{display: 'inline-block', width: '20%', verticalAlign: 'middle'}}>
                    <span style={{paddingRight: 10}}>
                      {item.value}
                    </span>
                    {
                      this.state[`disable${item.name}`] ?
                        (
                          <div style={{display: 'inline-block'}}>
                            <Icon type="edit"
                                  title="编辑"
                                  style={{cursor: 'pointer', color: '#007b43', paddingRight: 5}}
                                  onClick={() => {this.editInput(item.name)}}
                            />
                            {
                              index > 1 && (
                                <Popconfirm title="确定要删除该项"
                                            onConfirm={() => {this.deleteItem(item.name)}}
                                >
                                  <Icon type="delete"
                                        title="删除"
                                        style={{cursor: 'pointer', color: '#bd2636'}}
                                  />
                                </Popconfirm>
                              )
                            }
                          </div>
                        ) :
                        (
                          <div style={{display: 'inline-block'}}>
                            <Icon type="save"
                                  title="保存"
                                  style={{paddingRight: 5, cursor: 'pointer', color: '#007b43'}}
                                  onClick={() => {this.saveInput(item.name)}}
                            />
                            <Popconfirm title="确定要取消更改么？"
                                        onConfirm={() => {this.cancelInput(item.name)}}>
                              <Icon type="rollback"
                                    style={{cursor: 'pointer', color: '#bd2636'}}
                                    title="取消"
                              />
                            </Popconfirm>
                          </div>
                        )
                    }
                  </div>
                  <TextArea rows={3}
                            style={{resize: 'vertical', width: '80%', verticalAlign: 'middle'}}
                            ref={(input) => {this[`${item.name}value`] = input}}
                            value={this.state[`${item.name}value`]}
                            onChange={(e) => {this.changeInput(e.target.value, item.name)}}
                            disabled={this.state[`disable${item.name}`]}
                  />
                </div>
              );
            })
          }
        </Card>
        <Modal
          title="添加选项"
          visible={this.state.modalVisible}
          onOk={this.confirmAddItem}
          onCancel={this.cancelAddItem}
        >
          <Input onChange={this.onchangeNewItem} value={this.state.newItem}/>
        </Modal>
      </div>
    );
  }
}

export default ReportOverall;