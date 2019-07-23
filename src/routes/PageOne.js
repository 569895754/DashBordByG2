import React, { Component } from 'react';

import { DragDropContext } from 'react-dnd';
import HTMLBackend from 'react-dnd-html5-backend';

import PageThree from './PageThree';
import Box from '../components/Box';


@DragDropContext(HTMLBackend)

class PageOne extends Component {

    constructor() {
        super();
        this.state = {
            chartArray: [{
                data: [{ genre: 'Sports', sold: 275 },
                    { genre: 'Strategy', sold: 115 },
                    { genre: 'Action', sold: 120 },
                    { genre: 'Shooter', sold: 350 },
                    { genre: 'Other', sold: 150 }],
                id: "chartOne",
                width: 400,
                height: 300,
                type: '',
                x: 10,
                y: 10,
            },{
                data: [{ genre: 'Sports', sold: 275 },
                    { genre: 'Strategy', sold: 115 },
                    { genre: 'Action', sold: 120 },
                    { genre: 'Shooter', sold: 350 },
                    { genre: 'Other', sold: 150 }],
                id: "chartTwo",
                width: 400,
                height: 300,
                type: '',
                x: 500,
                y: 10,
            }]
        }
    }

    chartArrayPush = (id, x, y) => {
        const chartArray = [...this.state.chartArray];
        chartArray.push({
            data: [{ genre: 'Sports', sold: 275 },
                { genre: 'Strategy', sold: 115 },
                { genre: 'Action', sold: 120 },
                { genre: 'Shooter', sold: 350 },
                { genre: 'Other', sold: 150 }],
            id: id + Math.floor(Math.random()*(9999-1000))+1000,
            width: 400,
            height: 300,
            x: x - 200,
            y,
        });
        this.setState({ chartArray });
    };

    updateChartArray = (chartObj) => {
        const chartArray = [...this.state.chartArray];
        const index = chartArray.findIndex(item => item.id === chartObj.id);
        chartArray.fill(chartObj, index, index + 1);
        this.setState({ chartArray });
    };

    replaceChartArray = (chartArray) => {
        const newChartArray = [...chartArray];
        this.setState({ chartArray: newChartArray });
    };

    render() {
        return (
            <div style={{ display: 'flex', height: '100%' }}>
                <div style={{ width: 200, borderRight: '1px solid rgb(226, 221, 219)', height: '100%' }}>
                    <Box name="test1" chartArrayPush={this.chartArrayPush} />
                    <Box name="test2" chartArrayPush={this.chartArrayPush} />
                    <Box name="test3" chartArrayPush={this.chartArrayPush} />
                </div>
                <div style={{ flex: 1,  height: '100%' }}>
                    <PageThree
                        replaceChartArray={this.replaceChartArray}
                        updateChartArray={this.updateChartArray}
                        chartArray={this.state.chartArray}
                    />
                </div>
            </div>
        );
    }
}

export default PageOne;