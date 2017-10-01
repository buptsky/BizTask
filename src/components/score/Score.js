import { connect } from 'react-redux';
import {bindActionCreators} from 'redux';
import * as CommonActions from '../../actions/common';
function mapStateToProps(state) {
    return {};
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(CommonActions, dispatch);
}
@connect(mapStateToProps,mapDispatchToProps)
class Score extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.activeHeaderMenu('score');
    }
    render() {
        return (
            <h1>hello score</h1>
        );
    }
}
export default Score;