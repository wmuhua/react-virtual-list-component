import React from 'react';

function createListComponent({
  getEstimatedTotalSize,
  getItemSize,
  getItemOffset,
  getStartIndexForOffset,//根据向上卷去的高度计算开始索引
  getStopIndexForStartIndex,//根据开始索引和容器的高度计算结束索引
  initInstanceProps
}) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      //这个是类的实例的属性，用来存放内部的些状态变量
      this.instanceProps = initInstanceProps && initInstanceProps(this.props)
      this.state = { scrollOffset: 0 }
    }
    //instanceProps = initInstanceProps && initInstanceProps(this.props)
    //state = { scrollOffset: 0 }//状态值为向上卷去的高度
    static defaultProps = {
      overscanCount: 2
    }

    render() {
      const { width, height, itemCount, children: Row } = this.props;
      const containerStyle = { position: 'relative', width, height, overflow: 'auto', willChange: 'transform' };
      const contentStyle = { width: '100%', height: getEstimatedTotalSize(this.props, this.instanceProps) };
      const items = [];
      if (itemCount > 0) {
        const [startIndex, stopIndex] = this.getRangeToRender();
        for (let index = startIndex; index <= stopIndex; index++) {
          items.push(
            <Row key={index} index={index} style={this.getItemStyle(index)} />
          );
        }
      }
      return (
        <div style={containerStyle} onScroll={this.onScroll}>
          <div style={contentStyle}>
            {items}
          </div>
        </div>
      )
    }
    onScroll = (event) => {
      const { scrollTop } = event.currentTarget;
      this.setState({ scrollOffset: scrollTop })
    }
    getRangeToRender = () => {
      const { scrollOffset } = this.state;
      const { itemCount, overscanCount } = this.props;
      const startIndex = getStartIndexForOffset(this.props, scrollOffset, this.instanceProps);
      const stopIndex = getStopIndexForStartIndex(this.props, startIndex, scrollOffset, this.instanceProps);
      return [
        Math.max(0, startIndex - overscanCount),
        Math.min(itemCount - 1, stopIndex + overscanCount),
        startIndex, stopIndex];
    }
    getItemStyle = (index) => {
      const style = {
        position: 'absolute',
        width: '100%',
        height: getItemSize(this.props, index, this.instanceProps),
        top: getItemOffset(this.props, index, this.instanceProps)
      }
      return style;
    }
  }
}

export default createListComponent;