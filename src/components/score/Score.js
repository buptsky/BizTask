import { connect } from 'react-redux';
import {actionCreator, actionTypes} from '../../action-creator';
import {Select} from 'antd';
const Option = Select.Option;
@connect(
    state => ({}),
    dispatch => ({
        activeHeaderMenu: ()=>{
            dispatch( actionCreator('change_header_menu', 'score') );
        }
    })
)
class Score extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.activeHeaderMenu();
    }
    render() {
        return (
         <h1>hello score</h1>
        );
    }
}
export default Score;