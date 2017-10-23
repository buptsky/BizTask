/*
 * 周报整体预览
 */

import {Row, Col, Input, Icon, Upload, message, Button} from 'antd';

const titleStyle = {
  textAlign: 'center',
  fontSize: '18px',
  border: '1px solid #108ee9',
  color: '#108ee9',
  borderRadius: '5px',
  lineHeight: '40px'
}
const tableStyle = {
  table: {
    fontSize: '14px',
    border: '1px solid #444',
    marginTop: '20px',
    borderCollapse: 'collapse'
  },
  td: {
    borderRight: '1px solid #444',
    borderBottom: '1px solid #444',
    padding: '5px',
    whiteSpace: 'pre-line'
  }
}

const {TextArea} = Input;
// 附件上传参数配置（暂时不做）
const props = {
  name: 'file',
  action: '//jsonplaceholder.typicode.com/posts/',
  headers: {
    authorization: 'authorization-text',
  },
  onChange(info) {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

class ReportPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getTableHtml = () => {
    console.log(this.importantTable.outerHTML);
  }

  render() {
    const {data, map} = this.props.importantData;
    const reportData = data.filter((item) => item.id);
    return (
      <div className="report-preview">
        <div className="report-title" style={titleStyle}>
          biz-fe 项目周报
        </div>
        <table className="overall-table" width="100%" style={tableStyle.table}>
          <thead>
            <tr style={{textAlign: 'left'}}>
              <th colSpan="2" style={tableStyle.td}>一、总体情况</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td width="20%" style={tableStyle.td}>主要工作</td>
            <td width="80%"
                style={tableStyle.td}
                dangerouslySetInnerHTML={{__html: '本周主要工作\r\n本周主要工作\r\n本周主要工作'}}>
            </td>
          </tr>
          <tr>
            <td style={tableStyle.td}>问题/风险</td>
            <td style={tableStyle.td}>本周存在的问题/风险</td>
          </tr>
          </tbody>
        </table>
        <table className="imporant-table"
               style={tableStyle.table}
               width="100%"
               ref={(value) => {
                 this.importantTable = value
               }}
        >
          <thead>
          <tr style={{textAlign: 'left'}}>
            <th colSpan="7" style={tableStyle.td}>二、重点项目进展</th>
          </tr>
          <tr>
            <th width="10%" style={tableStyle.td}>分类</th>
            <th width="15%" style={tableStyle.td}>项目名称</th>
            <th width="25%" style={tableStyle.td}>预期产出</th>
            <th width="10%" style={tableStyle.td}>投入人日</th>
            <th width="10%" style={tableStyle.td}>负责人</th>
            <th width="20%" style={tableStyle.td}>本周进展</th>
            <th width="10%" style={tableStyle.td}>下周计划</th>
          </tr>
          </thead>
          <tbody>
          {
            reportData.map((item, index) => {
              return (
                <tr key={index}>
                  {
                    map.map((mapItem) => {
                      if (index === mapItem.index) {
                        return (
                          <td
                            key={index} width="10%"
                            rowSpan={mapItem.length}
                            style={tableStyle.td}
                          >{item.type}</td>)
                      }
                    })
                  }
                  <td width="15%" style={tableStyle.td}>{item.name}</td>
                  <td width="25%" style={tableStyle.td}>{item.output}</td>
                  <td width="10%" style={tableStyle.td}>{item.duration}</td>
                  <td width="10%" style={tableStyle.td}>{item.principal.length ? item.principal.join(',') : ''}</td>
                  <td width="20%" style={tableStyle.td}>{item.process}</td>
                  <td width="10%" style={tableStyle.td}>{item.plan}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
        <Row style={{marginTop: 30}}>
          <Col span={12} style={{paddingLeft: 10}}>
            <span style={{display: 'inline-block', width: '20%'}}>邮件发送至：</span>
            <Input style={{width: '60%'}}/></Col>
          <Col span={12} style={{paddingLeft: 10}}>
            <span style={{display: 'inline-block', width: '10%'}}>附件：</span>
            <Upload {...props}>
              <Button>
                <Icon type="upload"/> 点击上传
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row style={{marginTop: 10}}>
          <Col span={12} style={{paddingLeft: 10}}>
            <span style={{display: 'inline-block', width: '20%'}}>抄送至：</span>
            <Input style={{width: '60%'}}/>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ReportPreview;