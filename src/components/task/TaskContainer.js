import TaskCard from './TaskCard';
import {ItemTypes, OFFSET_HEIGHT, CARD_HEIGHT, CARD_MARGIN} from './Constants';
import {DropTarget} from 'react-dnd';

//在DropTarget的hover中实时获取placeholder的index
function getPlaceholderIndex(y) {
  // 超过card的一半高度，则返回当前card的index，方便在其后面插入placeholder
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
  drop(props, monitor, component) {
    document.getElementById(monitor.getItem().taskId).style.display = 'block';
    const { placeholderIndex } = component.state;
    const lastX = monitor.getItem().x;
    const lastY = monitor.getItem().y;
    const nextX = props.x;
    let nextY = placeholderIndex;

    if (lastY > nextY) { // move top
      nextY += 1;
    } else if (lastX !== nextX) { // insert into another list
      nextY += 1;
    }

    if (lastX === nextX && lastY === nextY) { // if position equel
      return;
    }

    props.moveCard({lastX, lastY, nextX, nextY});
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
    const {connectDropTarget, isOver, canDrop, dataSource,x} = this.props;
    const {placeholderIndex} = this.state;
    const placeHolder = <div key="placeholder" className="task-card-placeholder"/>;
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
        //x是所在分类，y是当前card在当前分类中的index
        cardList.push(
          <TaskCard x={x} y={i} key={task.taskId} taskInfo={task}/>
        );
      }
      if (isOver && canDrop && placeholderIndex === i) {
        cardList.push(placeHolder);
      }
    });
    // placeholder的index大于数组长度，则在最后追加placeholder
    if (isPlaceHold) {
      cardList.push(placeHolder);
    }
    // 拖拽时当前分类中列表为空
    if (isOver && canDrop && dataSource.length === 0) {
      cardList.push(placeHolder);
    }
    return connectDropTarget(
      <div className="task-list-container">
        {cardList}
      </div>
    );
  }
}

export default TaskContainer;
