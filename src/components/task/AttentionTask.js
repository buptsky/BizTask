import ChargeTask from './ChargeTask';
import {TaskListTypes} from './Constants';
class AttentionTask extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ChargeTask type={TaskListTypes.ATTENTION}/>
        );
    }
}
export default AttentionTask;
