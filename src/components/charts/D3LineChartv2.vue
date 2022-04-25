<template>
    <div>
        <div id="my_dataviz"></div>
        <!-- <button @click="changeIndex()">change Index</button> -->
    </div>
</template>

<script>
// eslint-disable-next-line
import * as d3 from "d3";

export default {
    name: "D3LineChartv2",
    components: {},
    props: {
        data: Object,
    },
    data() {
        return {
            plotData: [], // erster Index ist Lisa, Friedrich, Gesamt // Zweiter Index ist unvonverted, perDay, perMonth, perYear
            starteDate: "",
            endDate: "",
            index: 1,
            parseTime: d3.timeParse("%Y-%m-%d"),
            allCurveObjects: [],
            curve: {},
            svg: {},
            xScale: {},
            yScale: {},
            width: 0,
            height: 0,
            margin: {},
        };
    },
    mounted() {
        this.prepareData2();
    },
    watch: {
        data() {
            this.prepareData2();
        },
    },
    methods: {
        changeIndex: function () {
            if (this.index == 1) {
                this.index = 2;
            } else if (this.index == 2) {
                this.index = 3;
            } else {
                this.index = 1;
            }
            //this.updateCurve();
            //this.createPlot();
            this.updateCurve();
        },
        updateCurve() {
            //const xScale = this.xScale;
            //const yScale = this.yScale;

            // eslint-disable-next-line
            const margin = this.margin;
            const width = this.margin;
            const height = this.margin;
            //const height = this.margin;

            let maxY = this.calculateMaxY(this.plotData[2][this.index]);

            //const parseTime = this.parseTime;

            let parseTime = this.parseTime;
            if (this.index == 2) {
                parseTime = d3.timeParse("%Y-%m");
            } else if (this.index == 1) {
                parseTime = d3.timeParse("%Y-%m-%d");
            } else if (this.index == 3) {
                parseTime = d3.timeParse("%Y");
            }
            /*const u = this.svg
                .selectAll(".lineTest")
                .data([this.plotData[2][this.index]], function (d) {
                    return d[0]; */

            if (this.index == 2) {
                this.starteDate = this.plotData[2][2][0][0].substring(0, 7);
                this.endDate = this.plotData[2][2][
                    this.plotData[2][2].length - 1
                ][0].substring(0, 7);
            } else if (this.index == 1) {
                this.starteDate = this.plotData[2][1][0][0].substring(0, 10);
                this.endDate = this.plotData[2][1][
                    this.plotData[2][1].length - 1
                ][0].substring(0, 10);
                //maxY = 60;
            } else if (this.index == 3) {
                this.starteDate = this.plotData[2][3][0][0].substring(0, 4);
                this.endDate = this.plotData[2][3][
                    this.plotData[2][3].length - 1
                ][0].substring(0, 4);
            }

            console.log(
                "Index: ",
                this.index,
                " Startdatum: ",
                this.starteDate,
                " Enddatum: ",
                this.endDate
            );

            this.xScale
                //.scaleTime()
                //.domain([parseTime("2017-06-22"), parseTime("2022-04-09")])
                .domain([
                    this.parseTime(this.starteDate),
                    this.parseTime(this.endDate),
                ])
                .range([0, width]);
            this.yScale
                //.scaleLinear()
                .domain([0, maxY])
                //.domain([0, 1000])
                .range([height, 0]);

            const xScale = this.xScale;
            const yScale = this.yScale;

            /*

            this.xScale
                //.transition()
                //.duration(1000)
                //.domain([parseTime("2017-06-22"), parseTime("2022-04-09")])
                .domain([parseTime(this.starteDate), parseTime(this.endDate)])
                .range([0, this.width]);

            this.xScale = xScale;
            */

            //const parseTime = this.parseTime;
            // svg, xScale, parseTime, yScale

            this.curve
                .datum(this.plotData[2][this.index])
                .transition()
                .duration(1000)
                .attr(
                    "d",
                    d3
                        .line()
                        .curve(d3.curveBumpX)
                        .x(function (d) {
                            //console.log(parseTime(d[0]));
                            return xScale(parseTime(d[0]));
                        })
                        .y(function (d) {
                            return yScale(d[1]);
                        })
                );
        },
        prepareData2: function () {
            if (!this.data.allMessages.length) return;
            this.plotData = [];
            const defaultPaerseTime = d3.timeParse("%Y-%m-%d");

            if (this.index == 2) {
                this.parseTime = d3.timeParse("%Y-%m");
            } else if (this.index == 1) {
                this.parseTime = d3.timeParse("%Y-%m-%d");
            } else if (this.index == 3) {
                this.parseTime = d3.timeParse("%Y");
            }

            for (let i = 0; i < this.data.names.length; i++) {
                this.plotData.push([[], [], [], []]);
            }

            this.plotData.push([[], [], [], []]);

            for (let i = 0; i < this.data.allMessages.length; i++) {
                const name = this.data.allMessages[i].name;
                // eslint-disable-next-line
                const nameIndex = this.data.names.indexOf(name);

                this.plotData[nameIndex][0].push([
                    this.data.allMessages[i].date,
                ]);
                this.plotData[this.data.names.length][0].push([
                    this.data.allMessages[i].date,
                ]);
            }

            // Count Unvonverted, still stored as unconverted
            for (let i = 0; i < this.plotData.length; i++) {
                let updatedUnconverted = [];
                let lastDate = "";
                for (let j = 0; j < this.plotData[i][0].length; j++) {
                    if (this.plotData[i][0][j][0] != lastDate) {
                        lastDate = this.plotData[i][0][j][0];
                        updatedUnconverted.push([lastDate, 1]);
                    } else {
                        lastDate = this.plotData[i][0][j][0];
                        const lastvalue =
                            updatedUnconverted[
                                updatedUnconverted.length - 1
                            ][1];
                        updatedUnconverted[updatedUnconverted.length - 1] = [
                            lastDate,
                            lastvalue + 1,
                        ];
                    }
                }
                this.plotData[i][0] = updatedUnconverted;
            }

            // per Day
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];

                const allDates = [];
                for (let j = 0; j < this.plotData[i][0].length; j++) {
                    allDates.push(this.plotData[i][0][j][0]);
                }
                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    const date = new Date(j).toISOString().split("T")[0];
                    if (allDates.includes(date)) {
                        const dateIndex = allDates.indexOf(date);
                        this.plotData[i][1].push([
                            this.plotData[i][0][dateIndex][0],
                            this.plotData[i][0][dateIndex][1],
                        ]);
                    } else {
                        this.plotData[i][1].push([date, 0]);
                    }
                }
            }

            // per month
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];
                const allMonth = []; // 2015-06
                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    const month = new Date(j).toISOString().substring(0, 7);
                    if (!allMonth.includes(month)) {
                        allMonth.push(month);
                        this.plotData[i][2].push([month, 0]);
                    }
                }
                for (let j = 0; j < this.plotData[i][0].length; j = j + 12) {
                    const month = this.plotData[i][0][j][0].substring(0, 7);
                    const value = this.plotData[i][0][j][1];
                    const monthIndex = allMonth.indexOf(month);
                    this.plotData[i][2][monthIndex][1] =
                        this.plotData[i][2][monthIndex][1] + value;
                }
            }
            // per month
            for (let i = 0; i < this.plotData.length; i++) {
                const startDate = this.plotData[i][0][0][0];
                const endDate =
                    this.plotData[i][0][this.plotData[i][0].length - 1][0];
                const allYears = []; // 2015
                for (
                    let j = new Date(defaultPaerseTime(startDate));
                    j <= new Date(defaultPaerseTime(endDate));
                    j.setDate(j.getDate() + 1)
                ) {
                    const year = new Date(j).toISOString().substring(0, 4);
                    if (!allYears.includes(year)) {
                        allYears.push(year);
                        this.plotData[i][3].push([year, 0]);
                    }
                }
                for (let j = 0; j < this.plotData[i][0].length; j = j + 1) {
                    const year = this.plotData[i][0][j][0].substring(0, 4);
                    const value = this.plotData[i][0][j][1];
                    const yearIndex = allYears.indexOf(year);
                    this.plotData[i][3][yearIndex][1] =
                        this.plotData[i][3][yearIndex][1] + value;
                }
            }

            this.createPlot();
        },
        createPlot: function () {
            // eslint-disable-next-line
            const parseTime = this.parseTime;
            // eslint-disable-next-line
            let maxY = this.calculateMaxY(this.plotData[2][this.index]);
            if (this.index == 2) {
                this.starteDate = this.plotData[2][2][0][0].substring(0, 7);
                this.endDate = this.plotData[2][2][
                    this.plotData[2][2].length - 1
                ][0].substring(0, 7);
            } else if (this.index == 1) {
                this.starteDate = this.plotData[2][1][0][0].substring(0, 10);
                this.endDate = this.plotData[2][1][
                    this.plotData[2][1].length - 1
                ][0].substring(0, 10);
                //maxY = 60;
            } else if (this.index == 3) {
                this.starteDate = this.plotData[2][3][0][0].substring(0, 4);
                this.endDate = this.plotData[2][3][
                    this.plotData[2][3].length - 1
                ][0].substring(0, 4);
            }

            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 1060 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            this.width = width;
            this.height = height;
            this.margin = margin;

            // Steo 2: Layout
            // = var svg...
            this.svg = d3
                .select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("margin", 40)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // Step 3: Set scale

            const xScale = d3
                .scaleTime()
                //.domain([parseTime("2017-06-22"), parseTime("2022-04-09")])
                .domain([
                    this.parseTime(this.starteDate),
                    this.parseTime(this.endDate),
                ])
                .range([0, width]);
            const yScale = d3
                .scaleLinear()
                .domain([0, maxY])
                //.domain([0, 1000])
                .range([height, 0]);

            this.xScale = xScale;
            this.yScale = yScale;

            var g = this.svg
                .append("g")
                //.attr("transform", "translate(" + 100 + "," + 100 + ")");
                .attr("transform", "translate(" + 0 + "," + 0 + ")");

            // Step 4: Add text

            // Title

            /*
                svg.append("text")
                //.attr("x", width / 2 + 100)
                //.attr("y", 0)
                .attr("y", 100)
                .attr("text-anchor", "middle")
                .style("font-family", "Helvetica")
                .style("font-size", 20)
                .text("Line Chart");

                // X label
                svg.append("text")
                //.attr("x", width / 2 + 100)
                //.attr("y", height - 15 + 150)
                .attr("text-anchor", "middle")
                .style("font-family", "Helvetica")
                .style("font-size", 12)
                .text("Independant");

                // Y label
                svg.append("text")
                .attr("text-anchor", "middle")
                .attr("transform", "translate(60," + height + ")rotate(-90)")
                .style("font-family", "Helvetica")
                .style("font-size", 12)
                .text("Dependant");
                */

            // Step 5: Add axis

            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            g.append("g").call(d3.axisLeft(yScale));

            // Step 6: Scatter dots

            /*
                svg.append("g")
                .selectAll("dot")
                .data(this.completeNewData[2][2])
                //.data(this.plotData2[0].perDay)
                .enter()
                .append("circle")
                .attr("cx", function (d) {
                    return xScale(parseTime(d[0]));
                })
                .attr("cy", function (d) {
                    return yScale(d[1]);
                })
                .attr("r", 2)
                //.attr("transform", "translate(" + 100 + "," + 100 + ")")
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .style("fill", "#CC0000");
                */

            // Step 7: Plot Line
            // eslint-disable-next-line

            this.curve = this.svg
                .append("g")
                .append("path")
                .attr("class", "mypath")
                .datum(this.plotData[2][this.index])
                .attr(
                    "d",
                    d3
                        .line()
                        .curve(d3.curveBumpX)
                        .x(function (d) {
                            return xScale(parseTime(d[0]));
                        })
                        .y(function (d) {
                            return yScale(d[1]);
                        })
                )
                .style("fill", "none")
                .style("stroke", "#CC0000")
                .style("stroke-width", "2");
            // eslint-disable-next-line

            /*
        

            

            var line = d3
                .line()
                .x(function (d) {
                    return xScale(parseTime(d[0]));
                })
                .y(function (d) {
                    return yScale(d[1]);
                })
                .curve(d3.curveBumpX);

            // eslint-disable-next-line
            svg.append("path")
                .datum(this.plotData[2][this.index])
                //.datum(this.plotData2[0].perDay)
                .attr("class", "line")
                //.attr("transform", "translate(" + 100 + "," + 100 + ")")
                .attr("transform", "translate(" + 0 + "," + 0 + ")")
                .attr("d", line)
                .style("fill", "none")
                .style("stroke", "#CC0000")
                .style("stroke-width", "2");

                */

            // MOUSE
        },
        calculateMaxY: function (array) {
            let max = 0;
            for (let i = 0; i < array.length; i++) {
                if (array[i][1] > max) {
                    max = array[i][1];
                }
            }
            if (max < 10) {
                max = 10;
            } else if (max < 100) {
                let modulo = max % 10;
                max = max - modulo + 10;
            } else if (max < 500) {
                let modulo = max % 100;
                max = max - modulo + 100;
            } else if (max < 1000) {
                let modulo = max % 200;
                max = max - modulo + 200;
            } else if (max < 10000) {
                let modulo = max % 500;
                max = max - modulo + 500;
            }
            return max;
        },
    },
};
</script>
<!-- css loaderhttps://vue-loader.vuejs.org/guide/scoped-css.html#mixing-local-and-global-styles -->
<style>
/* AXES */
/* ticks */
.axis line {
    stroke: #706f6f;
    stroke-width: 0.5;
    shape-rendering: crispEdges;
}

/* axis contour */
.axis path {
    stroke: #706f6f;
    stroke-width: 0.7;
    shape-rendering: crispEdges;
}

/* axis text */
.axis text {
    fill: #2b2929;
    font-family: Georgia;
    font-size: 120%;
}
</style>
