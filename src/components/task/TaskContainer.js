import TaskCard from './TaskCard';
import {ItemTypes, OFFSET_HEIGHT, CARD_HEIGHT, CARD_MARGIN} from './Constants';
import {DropTarget} from 'react-dnd';

//在DropTarget的hover中实时获取placeholder的index
function getPlaceholderIndex(y) {
  // shift placeholder if y position more than card height / 2
  const yPos = y - OFFSET_HEIGHT;
  let placeholderIndex;
  if (yPos < CARD_HEIGHT / 2) {
    placeholderIndex = -1; // place at the start
  } else {
    placeholderIndex = Math.floor((yPos - CARD_HEIGHT / 2) / (CARD_HEIGHT + CARD_MARGIN));
  }
  return placeholderIndex;
}

const spec = {
  drop(props) {

  },
  hover(props, monitor, component) {
    // defines where placeholder is rendered
    const placeholderIndex = getPlaceholderIndex(monitor.getClientOffset().y);
    component.setState({placeholderIndex});
    // when drag begins, we hide the card and only display cardDragPreview
    const item = monitor.getItem();
    document.getElementById(item.taskId).style.display = 'none';
  }
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
    item: monitor.getItem()
  };
}

@DropTarget(ItemTypes.TASK_CARD, spec, collect)
class TaskContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      placeholderIndex: undefined
    }
  }

  render() {
    const {connectDropTarget, isOver, canDrop, dataSource} = this.props;
    const {placeholderIndex} = this.state;
    let isPlaceHold = false;
    let cardList = [];
    dataSource.forEach((task, i) => {
      if (isOver && canDrop) {
        isPlaceHold = false;
        if (i === 0 && placeholderIndex === -1) {
          cardList.push(<div key="placeholder" className="task-card-placeholder"/>);
        } else if (placeholderIndex > i) {
          isPlaceHold = true;
        }
      }
      if (task !== undefined) {
        cardList.push(
          <TaskCard key={task.taskId} taskInfo={task}/>
        );
      }
      if (isOver && canDrop && placeholderIndex === i) {
        cardList.push(<div key="placeholder" className="task-card-placeholder"/>);
      }
    });
    // if placeholder index is greater than array.length, display placeholder as last
    if (isPlaceHold) {
      cardList.push(<div key="placeholder" className="task-card-placeholder"/>);
    }
    return connectDropTarget(
      <div className="task-list-container">
        {cardList}
      </div>
    );
  }
}

export default TaskContainer;
