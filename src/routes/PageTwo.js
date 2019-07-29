import React, { Component } from 'react';
import '../components/PivotTable/pivottable.css';
import tips from './tips';
import {sortAs} from '../components/PivotTable/Utilities';
import TableRenderers from '../components/PivotTable/TableRenderers';
import createPlotlyComponent from 'react-plotly.js/factory';
import createPlotlyRenderers from '../components/PivotTable/PlotlyRenderers';
import PivotTableUI from '../components/PivotTable/PivotTableUI';
import '../components/PivotTable/pivottable.css';
import RightContextMenu from "../components/RightContextMenu/RightContextMenu";
import { Scrollbars } from 'react-custom-scrollbars';
import {Rnd} from "react-rnd";

const Plot = createPlotlyComponent(window.Plotly);


class PivotTableUISmartWrapper extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {pivotState: props};
    }

    componentWillReceiveProps(nextProps) {
        this.setState({pivotState: nextProps});
    }

    render() {
        return (
            <PivotTableUI
                renderers={Object.assign(
                    {},
                    TableRenderers,
                    createPlotlyRenderers(Plot)
                )}
                {...this.state.pivotState}
                onChange={s => this.setState({pivotState: s})}
                unusedOrientationCutoff={Infinity}
            />
        );
    }
}


class PageTow extends Component {

    constructor(props) {
        super(props);
        this.state = {
            width: 700,
            height: 400,
        };
    }

    componentWillMount() {
        this.setState({
            mode: 'demo',
            filename: 'Sample Dataset: Tips',
            pivotState: {
                data: tips,
                rows: ['Payer Gender'],
                cols: ['Party Size', 'Tip'],
                aggregatorName: '计数',
                flag: 24,
                vals: ['Tip', 'Total Bill'],
                sorters: {
                    Meal: sortAs(['Lunch', 'Dinner']),
                    'Day of Week': sortAs([
                        'Thursday',
                        'Friday',
                        'Saturday',
                        'Sunday',
                    ]),
                },
                plotlyOptions: {width: 900, height: 500},
                plotlyConfig: {},
                tableOptions: {
                    clickCallback: (pivotData) => {
                        this.changeColAndRow(pivotData);
                    },
                },
            },
        });
    }

    changeColAndRow(){
        const { pivotState } = this.state;
        const updateObj = Object.assign({}, pivotState,
            {cols: pivotState.rows, rows: pivotState.cols});
        this.setState({pivotState: updateObj});
    };

    generateMenuOption = () => {
        return (
          <div>
              <div className="contextMenu--option" onClick={() => this.changeColAndRow()}>
                  行列互换
              </div>
          </div>
        );
    };

    onDivResize = (e, direction, ref, delta, position) => {
        const width = ref.style.width.substring(0, ref.style.width.length - 2);
        const height = ref.style.height.substring(0, ref.style.height.length - 2);
        this.setState({
            width: Number(width),
            height: Number(height),
        });
    };

    onDivResizeStop = (e, direction, ref, delta, position) => {
        const width = ref.style.width.substring(0, ref.style.width.length - 2);
        const height = ref.style.height.substring(0, ref.style.height.length - 2);
        this.setState({
            width: Number(width),
            height: Number(height),
        });
    };

    render() {
        const style = {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "solid 1px #ddd",
            background: "#f0f0f0"
        };
        return (
            <div>
                <Rnd
                    style={style}
                    onResizeStop={(e, direction, ref, delta, position) => this.onDivResizeStop(e, direction, ref, delta, position)}
                    onResize={(e, direction, ref, delta, position) => this.onDivResize(e, direction, ref, delta, position)}
                >
                    <Scrollbars
                        id='test'
                        autoHeight
                        autoHeightMax={this.state.height}
                        style={{ maxWidth: this.state.width, display: 'inline-block', width: 'auto' }}
                    >
                        <PivotTableUISmartWrapper {...this.state.pivotState} />
                    </Scrollbars>
                </Rnd>
                <RightContextMenu
                    contextMenu={this.generateMenuOption()}
                />
            </div>
        );
    }
}

export default PageTow;