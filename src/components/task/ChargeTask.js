import { connect } from 'react-redux';
import {actionCreator, actionTypes} from '../../actions/action-creator';
import TaskMenu from './TaskMenu';
@connect(
    state => ({}),
    dispatch => ({
        activeHeaderMenu: ()=>{
            dispatch( actionCreator('change_header_menu', 'task') );
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
            <TaskMenu activeKey="chargeTask">
            <h1>chargeTask</h1>
        );
    }
}
export default Task;
