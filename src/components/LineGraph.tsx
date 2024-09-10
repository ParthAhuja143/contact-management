import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import numeral from 'numeral'

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem: any, data: any) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value: number, index: number, values: number[]) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
};

interface LineGraphProps {
    casesType: string;
}

const buildChartData = (data: any, casesType: string) => {
    let charData: { x: string; y: number }[] = [];
    let lastDataPoint: number | undefined;

    for (let date in data.cases) {
        if (lastDataPoint) {
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint, // to get new cases we subtract last date cases                 
            }
            charData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }

    return charData;
}

const LineGraph: React.FC<LineGraphProps> = ({ casesType }) => {
    const [data, setData] = useState<{ x: string; y: number }[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
                .then(response => response.json())
                .then(data => {
                    let chartData = buildChartData(data, casesType);
                    setData(chartData);
                });
        }

        fetchData();
    }, [casesType]);

    return (
        <div>
            {data.length > 0 && (
                <Line
                    data={{
                        datasets: [
                            {
                                backgroundColor: `${casesType !== 'recovered' ? 'rgba(204, 16, 52, 0.5)' : 'rgba(0, 230, 64, 0.5)'}`,
                                borderColor: `${casesType !== 'recovered' ? 'rgba(204, 16, 52, 1)' : 'rgba(0, 230, 64, 1)'}`,
                                data: data,
                            },
                        ],
                    }}
                    options={options}
                />
            )}
        </div>
    )
}

export default LineGraph