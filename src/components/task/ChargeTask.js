import {Layout} from 'antd';
const {Sider, Content} = Layout;
import {connect} from 'react-redux';
import {actionCreator, actionTypes} from '../../actions/action-creator';
import TaskMenu from './TaskMenu';
@connect(
    state => ({}),
    dispatch => ({
        activeHeaderMenu: ()=> {
            dispatch(actionCreator('change_header_menu', 'task'));
        }
    })
)
class Task extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.activeHeaderMenu();
    }

    render() {
        return (
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                    <TaskMenu activeKey="chargeTask"/>
                </Sider>
                <Content>
                    <h1>chargeTask</h1>
                </Content>
            </Layout>
        );
    }
}
export default Task;
