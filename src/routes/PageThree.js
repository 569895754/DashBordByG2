import React, { Component } from 'react';
import G2 from '@antv/g2';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import ItemTypes from '../types';
import {Rnd} from "react-rnd";
import Stack from '../utils/Stack';
import {Icon} from "antd";

import RightContextMenu from '../components/RightContextMenu/RightContextMenu';

const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "solid 1px #ddd",
    background: "#f0f0f0"
};

const boxTarget = {
    // 当有对应的 drag source 放在当前组件区域时，会返回一个对象，可以在 monitor.getDropResult() 中获取到
    drop: (props, monitor, component) => ({ ...monitor.getClientOffset()}),
};

@DropTarget(
    // type 标识，这里是字符串 'box'
    ItemTypes.BOX,
    // 接收拖拽的事件对象
    boxTarget,
    // 收集功能函数，包含 connect 和 monitor 参数
    // connect 里面的函数用来将 DOM 节点与 react-dnd 的 backend 建立联系
    (connect, monitor) => ({
        // 包裹住 DOM 节点，使其可以接收对应的拖拽组件
        connectDropTarget: connect.dropTarget(),
        // drag source是否在 drop target 区域
        isOver: monitor.isOver(),
        // 是否可以被放置
        canDrop: monitor.canDrop()
    })
)

class PageThree extends Component {

    static propTypes = {
        canDrop: PropTypes.bool.isRequired,
        isOver: PropTypes.bool.isRequired,
        connectDropTarget: PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            charts: [],
            chartStacks: [],
        }
    }

    componentDidMount() {
        this.renderG2();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.renderG2();
    }

    renderG2 = () => {
        const { charts } = this.state;
        const { chartArray } = this.props;
        chartArray.forEach(item => {
            if (charts.every(temp => temp.id !== item.id)) {
                let chart = new G2.Chart({
                    container: item.id,
                    width: item.width,
                    height: item.height,
                });
                chart.source(item.data);
                chart.interval().position('genre*sold').color('genre');
                chart.on('interval:click', ev => {
                    this.onChartClick(ev, item.id, chart, 'first');
                });
                chart.render();
                charts.push({id: item.id, chart});
            }
        });
    };

    onChartClick = (ev, id, chart, type, stackObj) => {
        const { chartArray } = this.props;
        const { charts, chartStacks } = this.state;
        // 1. 筛选被选中的图表数据对象
        const chartObj = chartArray.filter(item => item.id === id)[0];

        // 2. 当前图表入栈
        let chartStack = null;
        if (type === 'first') {
            chartStack = new Stack();
        } else if (type === 'back') {
            chartStack = stackObj.chartStack;
        }
        chartStack.push({ chart: chart, chartObj });

        // 3. 当前图表销毁
        chart.destroy();

        // 4. 创建新图表
        let width = null;
        let height = null;
        if (typeof chartObj.width === 'string') {
            width = chartObj.width.substring(0, chartObj.width.length - 2);
            height = chartObj.height.substring(0, chartObj.height.length - 2);
        } else {
            width = chartObj.width;
            height = chartObj.height;
        }
        let newChart = new G2.Chart({
            container: id,
            width,
            height,
        });
        newChart.source([{...ev.data._origin}]);
        newChart.interval().position('genre*sold').color('genre');
        newChart.render();

        // 5. 更新图表数组， 图表栈
        const index = charts.findIndex(item => item.id === id);
        charts.fill({ id: id, chart: newChart }, index, index + 1);
        if (type === 'first') {
            chartStacks.push({ id: id, chartStack });
        } else if (type === 'back') {
            chartStacks.forEach(item => {
               if (item.id === id) {
                   item.chartStack = chartStack;
               }
            });
        }
    };

    onDivDragStop = (e, d) => {
        const { chartArray } = this.props;
        chartArray.forEach(item => {
            if (item.id === d.node.id) {
                item.x = d.x;
                item.y = d.y;
            }
        });
        this.props.replaceChartArray(chartArray);
    };

    onDivResizeStop = (e, direction, ref, delta, position) => {
        const { charts } = this.state;
        const { chartArray } = this.props;
        const chartObj = charts.filter(item => item.id === ref.id)[0];
        chartArray.forEach(item => {
            if (item.id === ref.id) {
                item.width = ref.style.width;
                item.height = ref.style.height;
                item.x = position.x;
                item.y = position.y;
            }
        });
        const width = ref.style.width.substring(0, ref.style.width.length - 2);
        const height = ref.style.height.substring(0, ref.style.height.length - 2);
        chartObj.chart.changeSize(width, height);
        this.props.replaceChartArray(chartArray);
    };

    onDivResize = (e, direction, ref, delta, position) => {
        const { charts } = this.state;
        const { chartArray } = this.props;
        const chartObj = charts.filter(item => item.id === ref.id)[0];
        chartArray.forEach(item => {
            if (item.id === ref.id) {
                item.width = ref.style.width;
                item.height = ref.style.height;
                item.x = position.x;
                item.y = position.y;
            }
        });
        const width = ref.style.width.substring(0, ref.style.width.length - 2);
        const height = ref.style.height.substring(0, ref.style.height.length - 2);
        chartObj.chart.changeSize(width, height);
    };

    onChartBack = (id) => {
        const { charts, chartStacks } = this.state;
        // 1. 筛选当前选中的图表对象
        const oldChart = charts.filter(item => item.id === id)[0];
        // 2. 筛选当前图表栈
        const chartStack = chartStacks.filter(item => item.id === id)[0];
        if (chartStack === undefined || chartStack === null || chartStack.chartStack.top <= 0) {
            return;
        }
        // 3. 删除当前图表
        oldChart.chart.destroy();
        // 4. 弹出栈顶元素
        const newChartObj = chartStack.chartStack.pop();
        // 5. 根据栈顶元素创建新图表
        let width = null;
        let height = null;
        if (typeof newChartObj.chartObj.width === 'string') {
            width = newChartObj.chartObj.width.substring(0, newChartObj.chartObj.width.length - 2);
            height = newChartObj.chartObj.height.substring(0, newChartObj.chartObj.height.length - 2);
        } else {
            width = newChartObj.chartObj.width;
            height = newChartObj.chartObj.height;
        }
        let newChart = new G2.Chart({
            container: id,
            width,
            height,
        });
        newChart.source([...newChartObj.chartObj.data]);
        newChart.interval().position('genre*sold').color('genre');
        newChart.on('interval:click', ev => {
            this.onChartClick(ev, id, newChart, 'back', chartStack);
        });
        newChart.render();
        // 6. 更新图表数组
        const index = charts.findIndex(item => item.id === id);
        charts.fill({ id: id, chart: newChart }, index, index + 1);

    };

    render() {
        const { connectDropTarget } = this.props;
        console.log(this.props.chartArray);
        return (connectDropTarget && connectDropTarget(
            <div style={{ display: 'flex', height: '100%' }}>
                {
                    this.props.chartArray.map(item => {
                        return <Rnd
                            style={style}
                            size={{ width: item.width + 20, height: item.height + 20 }}
                            position={{ x: item.x, y: item.y }}
                            onDragStop={(e, d) => this.onDivDragStop(e, d)}
                            onResizeStop={(e, direction, ref, delta, position) => this.onDivResizeStop(e, direction, ref, delta, position)}
                            onResize={(e, direction, ref, delta, position) => this.onDivResize(e, direction, ref, delta, position)}
                            minWidth={400}
                            minHeight={300}
                            id={item.id}
                        >
                            <div>
                                <div style={{ position: 'absolute', top: '10px', marginRight: 10, zIndex: 1000 }}>
                                    <Icon type='arrow-left' onClick={() => this.onChartBack(item.id)} />
                                </div>
                                <div id={item.id}>
                                </div>
                            </div>
                        </Rnd>
                    })
                }
                <RightContextMenu chartBack={this.onChartBack} />
            </div>)
        );
    }
}

export default PageThree;