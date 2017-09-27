import { connect } from 'react-redux';
import {actionCreator, actionTypes} from '../../actions/action-creator';
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