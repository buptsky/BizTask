/*
 *  测试多功能表格实现 2017/10/17
 *  仅为测试功能板,待优化
 */
import {Table, Input, Popconfirm, Icon, Modal, message, Tooltip} from 'antd';
import ReportTableCell from './ReportTableCell';

class ReportTable extends React.Component {
  constructor(props) {
    super(props);
    // 表格列配置
    this.columns = [
      {
        title: (
          <div>
            分类
            <Icon type="plus-circle-o"
                  style={{marginLeft: 5, cursor: 'pointer'}}
                  onClick={this.addType}
            />
          </div>
        ),
        dataIndex: 'type',
        width: '8%',
        render: (text, record, index) => this.renderColumns(record, index, 'type', text),
      },
      {
        title: '项目名称',
        dataIndex: 'name',
        width: '15%',
        render: (text, record, index) => this.renderColumns(record, index, 'name', text),
      },
      {
        title: '预期产出',
        dataIndex: 'output',
        width: '25%',
        render: (text, record, index) => this.renderColumns(record, index, 'output', text),
      },
      {
        title: '投入人日',
        dataIndex: 'duration',
        width: '6%',
        render: (text, record, index) => this.renderColumns(record, index, 'duration', text),
      },
      {
        title: '负责人',
        width: '10%',
        dataIndex: 'principal',
        render: (text, record, index) => this.renderColumns(record, index, 'principal', text),
      },
      {
        title: '本周进展',
        dataIndex: 'process',
        width: '20%',
        render: (text, record, index) => this.renderColumns(record, index, 'process', text),
      },
      {
        title: '下周计划',
        dataIndex: 'plan',
        width: '10%',
        render: (text, record, index) => this.renderColumns(record, index, 'plan', text),
      },
      {
        title: '操作项',
        dataIndex: 'operation',
        width: '6%',
        render: (text, record, index) => {
          if (!this.state.dataSource.length) return;
          const editable = record.editable;
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <Icon type="save"
                          title="保存"
                          onClick={() => this.editDone(index, 'save')}
                          style={{marginRight: 15, cursor: 'pointer'}}
                    />
                    <Popconfirm title="确定要取消更改么？"
                                onConfirm={() => this.editDone(index, 'cancel')}>
                      <Icon type="rollback" style={{cursor: 'pointer'}} title="取消"/>
                    </Popconfirm>
                  </span>
                  :
                  <span>
                    <Icon type="edit"
                          title="编辑"
                          onClick={() => this.editCell(index)}
                          style={{marginRight: 10, cursor: 'pointer'}}
                    />
                    {
                      !this.state.dataTypeMap.some((item) => {
                        return (item.index + item.length - 1 === index) && (item.length !== 1);
                      }) ? (
                        <Popconfirm title="确定要删除该条目么？"
                                    onConfirm={() => this.deleteCell(index)}>
                          <Icon type="delete" style={{marginRight: 10,cursor: 'pointer'}} title="删除"/>
                        </Popconfirm>
                      ) : ''
                    }
                    {
                      this.state.dataTypeMap.some((item) => { // 不是第一条或者最后一条，则可上移
                        return (item.index === index) || (item.index + item.length  - 1 === index)
                      })? ''
                        : (<Icon title="上移"
                                 type="up-square-o"
                                 style={{cursor: 'pointer'}}
                                 onClick={() => {this.moveUpItem(index)}}
                        />)
                    }
                  </span>
              }
            </div>
          );
        },
      }
    ];
    this.state = {
      dataSource: [],
      dataTypeMap: [], // 数据类目位置集合,该集合维护了表格分类信息
      modalVisible: false,
      newType: '' // 新添加的类名
    };
  }

  componentWillReceiveProps(nextProps) {
    const dataList = this.formatData(nextProps.data);
    console.log(dataList);
    this.setState({
      dataTypeMap: dataList.map,
      dataSource: dataList.data
    });
  }
  // 格式化表格数据，创建映射表
  formatData = (data) => {
    if (!data.length) return [];
    let ret = [];
    data.forEach((typeList) => {
      // 将分类放入每条数据中,分类下最后一条数据应为空
      typeList.projects.forEach((item, index) => {
        item.type = typeList.name;
        item.key = item.id;
        ret.push(item);
        // 如果当前分类存在分类名，则在该分类下最后一条数据后推入一条新数据
        if (typeList.name && index === typeList.projects.length - 1) {
          ret.push({
            key: `${typeList.name}${Date.now()}`,
            name: "",
            type: typeList.name,
            output: "",
            duration: "",
            principal: [],
            endTime: "",
            process: "",
            plan: ""
          });
        }
      });
    });
    // 生成周报渲染数据及数据映射表
    return {data: ret, map: this.createSourceMap(ret)};
  }
  // 渲染表格各个列，没有数据时不会调用此方法，不用额外判断
  // data->行数据, index->当前数据行索引，key->当前数据的key，text->当前数据的值
  renderColumns(data, index, key, text) {
    const map = this.state.dataTypeMap;
    if (Array.isArray(text)) { // 如果值为数组，转化为字符串（负责人列是数组格式）
      text = text.join(',');
    }
    // 表各项分组，同组单元合并
    let rowSpan = 1;
    if (key === 'type') { // 如果是分类列，则要进行相同分类的行合并
      for (let i = 0; i < map.length; i++) {
        if (index === map[i].index) {
          rowSpan = map[i].length;
          break;
        }
        rowSpan = 0;
      }
    }
    const content = (
      <ReportTableCell
        value={text}
        editable={data.editable}
        isTypeCell={key === 'type' ? true : false}
        checkTypeCell={value => this.checkReportType(key, index, value)}
        onChange={value => this.handleChange(key, index, value)}
        status={data.status}
        tip={key === 'principal' ? '姓名请用逗号分隔' : ''}
      />
    )
    return {
      children: content,
      props: {rowSpan}
    };
  }
  // 生成数据索引映射
  createSourceMap = (data) => {
    let ret = [];
    let dataIndex = 0;
    data.forEach((item) => {
      if (!item.type) {
        // 如果还没有分好类,则构建一个未定义类，未定义类可重复且只包含一条数据，该类不会存在空数据
        ret.push({type: '未定义bizreport', index: dataIndex, length: 1});
        dataIndex++;
      } else {
        if (!ret.length) {
          ret.push({type: item.type, index: 0, length: 1});
          dataIndex++;
        } else {
          // console.log(item);
          for (let i = 0; i < ret.length; i++) {
            if (ret[i].type === item.type) {
              ret[i].length++;
              dataIndex++;
              break;
            }
            if (i === ret.length - 1) {
              ret.push({type: item.type, index: dataIndex, length: 1});
              dataIndex++;
              break;
            }
          }
        }
      }
    });
    return ret;
  }
  // 检测新增类名是否重复
  checkReportType(key, index, value) {
    let map = this.state.dataTypeMap;
    return map.some((item) => item.type === value && item.index !== index);
  }
  // 表格行成功保存
  handleChange(key, index, value) {
    let data = [...this.state.dataSource];
    let map = [...this.state.dataTypeMap];
    if (key === 'principal') { // 将填写的负责人数据转为数组格式
      value = value.split(/[,，]/);
    }
    if (key === 'type') { // 修改了表格分类
      // 判断分类是否和已有分类重复
      const sameFlag = map.some((item) => item.type === value && item.index !== index);
      // 如果从未分类变为分类,且新分类不存在
      if (!data[index].type && !sameFlag) {
        data[index].type = value;
        // 添加一条空数据
        data.splice(index + 1, 0, {
          key: `${value}${Date.now()}`,
          name: "",
          type: value,
          output: "",
          duration: "",
          principal: [],
          endTime: "",
          process: "",
          plan: ""
        });
        map = this.createSourceMap(data);
        console.log(data);
        console.log(map);
      } else if (sameFlag) { // 如果修改后的类和已有的重复
        console.log('重复');
        let removeIndex = 0;
        let needDetele = false; // 是否要清除空数据
        // 进行合并操作,首先在map中找到同名分类
        let sourceDataLength = 0;
        let targetDataIndex = 0;
        // 第一次遍历，需要获取：1.被移除map项内部数据的长度 2.要被合并的map项的初始数据索引
        map.forEach((typeItem, typeItemIndex) => {
          if (typeItem.index === index) { // 要移动的项
            sourceDataLength = typeItem.length;
            removeIndex = typeItemIndex; // 标记最后要被清除的索引条目位置
            console.log(typeItem);
            if (typeItem.type !== '未定义bizreport') { // 如果是现有分类，去掉空行
              needDetele = true;
            }
          }
          if (typeItem.type === value) { // 目标项
            targetDataIndex = typeItem.index;
          }
        });
        let removeData = data.splice(index, sourceDataLength); // 移除数据
        removeData.forEach((item) => item.type = value); // 更改数据项所属分组
        console.log(needDetele);
        needDetele && removeData.pop(); // 删除空数据
        if (index < targetDataIndex) {
          data.splice(targetDataIndex - sourceDataLength, 0, ...removeData);
        } else {
          data.splice(targetDataIndex, 0, ...removeData);
        }
        map = this.createSourceMap(data);
      } else { // 普通修改
        let length = 0;
        console.log(index);
        map.forEach((item) => { // 重写map映射
          if (item.index === index) {
            item.type = value;
            length = item.length;
            console.log(item.length);
          }
        });
        // 因为类型单元格本质上属于分类下所有数据的第一条，所以其他条目的分类也要变化
        for (let i = 0; i < length; i++) {
          data[index + i][key] = value;
        }
      }
    } else { // 更改其他数据
      data[index][key] = value;
    }
    console.log(map);
    console.log(data);
    this.setState({
      dataTypeMap: map,
      dataSource: data
    });
  }
  // 编辑表格行
  editCell = (index) => {
    // 将本行的数据切换为编辑状态
    const data = this.state.dataSource.slice(); // 获取副本
    data[index].editable = true; // 数据可编辑
    this.setState({dataSource: data});
  }
  // 删除表格行
  deleteCell = (index) => {
    const data = this.state.dataSource.slice();
    const map = this.state.dataTypeMap.slice();
    let changed = false;
    data.splice(index, 1);
    console.log(data);
    // 删除后需要调整map结构
    map.forEach((item) => {
      // 后面的类型index需要减少
      if (changed) {
        item.index--;
      }
      // 如果index命中了对应类型
      if ((index >= item.index) && (index < item.index + item.length)) {
        // 如果删除了分类中唯一一个条目，会造成下一个分类再次落在此区间，需要额外判断(删除操作仅进行一次)
        if (!changed) { // 保证只缩减一次长度
          item.length--;
        }
        changed = true;
      }
    });
    // 如果分类已空，删除整个分类  
    this.setState({
        dataTypeMap: map.filter((item) => item.length !== 0),
        dataSource: data
      }, () => {
        console.log(this.state.dataSource);
        console.log(this.state.dataTypeMap);
      }
    );
  }
  // 完成表格行的编辑(保存或者撤销)
  editDone = (index, type) => {
    const data = this.state.dataSource.slice();
    const map = this.state.dataTypeMap.slice();
    data[index].editable = false; // 数据禁止编辑
    data[index].status = type; // 写入数据操作类型
    // 保存单元格状态
    // 如果保存了分类最后一个空行则要多加一条空数据
    // 如果该条数据没有定义分类，则不加入空数据
    const flag = map.some((item) => item.type === '未定义bizreport' && item.index === index);
    if (type === 'save' && !flag) { // 如果保存了数据需要判断是否要添加一条空数据
      let changed = false;
      map.forEach((item) => { // 更新map
        if (changed) {
          item.index++;
        }
        if ((item.index + item.length - 1) === index) { // 该项已经当前分类的最后一项
          item.length++;
          changed = true;
          // 传入一行空数据
          data.splice(index + 1, 0, {
            key: `${item.type}${Date.now()}`,
            name: "",
            type: item.type,
            output: "",
            duration: "",
            principal: [],
            endTime: "",
            process: "",
            plan: ""
          });
        }
      });
    }
    console.log(map);
    console.log(data);
    this.setState({
      dataTypeMap: map,
      dataSource: data
    }, () => {
      // 数据保存到服务器
      this.saveReportData();
    });
  }
  // 上移表格数据（只能同分类上移）
  moveUpItem = (index) => {
    console.log(index);
    const data = [...this.state.dataSource];
    const removeData = data.splice(index, 1)
    data.splice(index - 1, 0, ...removeData);
    this.setState({
      dataSource: data
    });
  }
  // 保存表格数据到服务器,待完成
  saveReportData = () => {
    const data = this.state.dataSource;
    console.log(data);
    // 数据格式化
  }
  // 增加分类
  addType = () => {
    this.setState({modalVisible: true});
  }
  // 确认添加分类，分类追加到最后
  confirmAddType = () => {
    const {dataSource: data, dataTypeMap: map, newType} = this.state;
    // 检查重复
    if (map.some((item) => item.type === newType)) {
      message.warning("当前分类已经存在！");
      return;
    }
    // 首先更新map
    let newMap = [...map, {
      type: newType,
      index: map.length ? map[map.length - 1].index + map[map.length - 1].length : 0,
      length: 1
    }];
    let newData = [...data, {
      key: `${newType}${Date.now()}`,
      name: "",
      type: newType,
      output: "",
      duration: "",
      principal: [],
      endTime: "",
      process: "",
      plan: ""
    }];
    this.setState({
      dataTypeMap: newMap,
      dataSource: newData,
      newType: ''
    },() => {
      console.log(this.state.dataSource);
      console.log(this.state.dataTypeMap);
    });
    this.cancelAddType();
  }
  // 关闭添加分类modal
  cancelAddType = () => {
    this.setState({modalVisible: false});
  }
  // 新分类输入变动
  onchangeNewType = (e) => {
    this.setState({newType: e.target.value});
  }

  render() {
    const dataSource = this.state.dataSource;
    // console.log(dataSource);
    const columns = this.columns;
    return (
      <div>
        <Table bordered
               dataSource={dataSource}
               columns={columns}
               size="middle"
               pagination={false}
        />
        <Modal
          title="添加分类"
          visible={this.state.modalVisible}
          onOk={this.confirmAddType}
          onCancel={this.cancelAddType}
        >
          <Input onChange={this.onchangeNewType} value={this.state.newType}/>
        </Modal>
      </div>
    );
  }
}

export default ReportTable;