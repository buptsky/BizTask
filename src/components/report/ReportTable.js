/*
 *  测试多功能表格实现 2017/10/17
 */
import {Table, Input, Popconfirm, Icon} from 'antd';
import ReportTableCell from './ReportTableCell';

class ReportTable extends React.Component {
  constructor(props) {
    super(props);
    // 表格列配置
    this.columns = [
      {
        title: '分类',
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
          // console.log(record['key']);
          return (
            <div className="editable-row-operations">
              {
                editable ?
                  <span>
                    <Icon type="save"
                          onClick={() => this.editDone(index, 'save')}
                          style={{marginRight: 15, cursor: 'pointer'}}
                    />
                    <Icon type="reload"
                          onClick={() => this.editDone(index, 'cancel')}
                          style={{cursor: 'pointer'}}
                    />
                  </span>
                  :
                  <span>
                    <Icon type="edit"
                          onClick={() => this.editCell(index)}
                          style={{marginRight: 15, cursor: 'pointer'}}
                    />
                    {
                      !this.state.dataTypeMap.some((item) => {
                        return item.index + item.length - 1 === index;
                      }) ? (<Icon type="delete" style={{cursor: 'pointer'}}/>) : ''
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
      dataTypeMap: [] // 数据类目位置集合,该集合维护了表格分类信息
    };
  }
  // 渲染表格各个列，没有数据时不会调用此方法，可不用额外判断
  renderColumns(data, index, key, text) {
    if (key === 'plan') {
      console.log(text);
    }
    if (Array.isArray(text)) { // 负责人是数组格式
      text = text.join(',');
    }
    // 表各项分组，同组单元合并
    const map = this.state.dataTypeMap;
    // console.log(map);
    let rowSpan = 1;
    // 如果是分类列，则要进行相同分类的行合并
    if (key === 'type') {
      for (let i = 0; i < map.length; i++) {
        if (index === map[i].index) {
          rowSpan = map[i].length;
          break;
        }
        rowSpan = 0;
      }
    }
    const editable = data.editable;
    const status = data.status;
    return {
      children: (
        <ReportTableCell
          editable={editable}
          value={text}
          onChange={value => this.handleChange(key, index, value)}
          status={status}
        />
      ),
      props: {rowSpan}
    };
  }
  // 表格行成功保存
  handleChange(key, index, value) {
    const data = this.state.dataSource;
    data[index][key] = value;
    this.setState({dataSource: data});
  }
  // 编辑表格行
  editCell = (index) => {
    // 将本行的数据切换为编辑状态
    const data = this.state.dataSource;
    // console.log(data);
    data[index].editable = true; // 数据可编辑
    data[index].status = 'edit'; // 数据状态为编辑中
    this.setState({data});
  }
  // 完成表格行的编辑(保存或者撤销)
  editDone = (index, type) => {
    const data = this.state.dataSource;
    const map = this.state.dataTypeMap
    data[index].editable = false; // 数据禁止编辑
    data[index].status = type; // 数据状态为已保存
    // 保存单元格状态
    this.setState({dataSource: data}, () => {
      // 如果保存了最后一个空行要多加一个空行
      if (type === 'cancel') return; // 撤销不做修改
      let changed = false;
      map.forEach((item) => {
        if (changed) { // 更新map
          item.index ++;
        }
        if ((item.index + item.length - 1) === index) { // 该项已经当前分类的最后一项
          item.length ++;
          changed = true;
          // 更新map
          data.splice(index + 1, 0, {
            key: `${item.type}${index + 1}`,
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
      console.log(data);
      this.setState({
        dataTypeMap: map,
        dataSource: data
      });
    });

  }

  componentWillReceiveProps(nextProps) {
    const dataSource = this.formatData(nextProps.data); // 此时的dataSource是数据的副本,潜复制
    console.log(dataSource);
    this.setState({dataSource});
  }

  formatData = (data) => {
    if (!data.length) return [];
    let ret = [];
    let map = [];
    let index = 0;
    console.log(data);
    data.forEach((typeList) => {
      // 构建每个分类在表格中的初始索引,length多加了1是因为空数据
      // map[typeList.type] = {index: index, length: typeList.projects.length + 1};
      map.push({
        type: typeList.type,
        index: index,
        length: typeList.projects.length + 1
      })
      index += typeList.projects.length + 1;
      // 将分类放入每条数据中,分类下最后一条数据应为空
      typeList.projects.forEach((item, index) => {
        item.type = typeList.type;
        item.key = item.id;
        ret.push(item);
        if (index === typeList.projects.length - 1) { // 推入一个空任务
          ret.push({
            key: `${typeList.type}${index}`,
            name: "",
            type: typeList.type,
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
    this.setState({
      dataTypeMap: map
    });
    return ret;
  }

  render() {
    const dataSource = this.state.dataSource;
    console.log(dataSource);
    const columns = this.columns;
    return (
      <div>
        <Table bordered
               dataSource={dataSource}
               columns={columns}
               size="middle"
               pagination={false}
        />
      </div>
    );
  }
}

export default ReportTable;