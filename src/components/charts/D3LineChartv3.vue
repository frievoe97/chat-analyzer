<template>
    <div>
        <div class="title">
            Number of messages per {{ this.indexName[this.index - 1] }}
        </div>
        <div id="my_dataviz2"></div>
        <div class="button-box" style="height: 50px">
            <button
                class="button"
                :class="{ active: index == 3 }"
                type="button"
                @click="changeIndex2(3)"
            >
                Year
            </button>
            <button
                class="button"
                :class="{ active: index == 2 }"
                type="button"
                @click="changeIndex2(2)"
            >
                Month
            </button>
            <button
                class="button"
                :class="{ active: index == 1 }"
                type="button"
                @click="changeIndex2(1)"
            >
                Day
            </button>
        </div>
    </div>
</template>

<script>
// eslint-disable-next-line
import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";

export default {
    name: "D3LineChartv3",
    components: {},
    props: {
        data: Object,
    },
    data() {
        return {
            plotData: [], // erster Index ist Lisa, Friedrich, Gesamt // Zweiter Index ist unvonverted, perDay, perMonth, perYear
            starteDate: "",
            endDate: "",
            index: 3,
            parseTime: d3.timeParse("%Y-%m-%d"),
            allCurveObjects: [],
            curve: {},
            svg: {},
            xScale: {},
            yScale: {},
            x: {},
            y: {},
            xAxis: {},
            yAxis: {},
            margin: { top: 50, right: 50, bottom: 50, left: 50 },
            width: 1060 - 50 - 50,
            height: 400 - 50 - 50,
            indexName: ["day", "month", "year"],
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
            } else if (this.index == 3) {
                this.index = 1;
            } else {
                this.index = 3;
            }
            //this.updateCurve();
            //this.createPlot();
            this.updateCurve();
        },
        changeIndex2: function (index) {
            this.index = index;
            this.updateCurve();
        },
        updateCurve() {
            //const xScale = this.xScale;
            //const yScale = this.yScale;

            // eslint-disable-next-line
            //const margin = this.margin;
            //const width = this.margin;
            //const height = this.margin;
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

            this.x.domain([
                parseTime(this.starteDate),
                parseTime(this.endDate),
            ]);
            this.svg
                .selectAll(".myXaxis")
                .transition()
                .duration(1000)
                .call(this.xAxis);

            // create the Y axis
            this.y.domain([0, maxY]).nice();
            this.svg
                .selectAll(".myYaxis")
                .transition()
                .duration(1000)
                .call(this.yAxis);

            this.svg.select("title").text("NEUN");

            const x = this.x;
            const y = this.y;

            // Create a update selection: bind to the new data
            const u = this.svg
                .selectAll(".lineTest")
                .data([this.plotData[2][this.index]], function (d) {
                    return parseTime(d[0]);
                });

            // eslint-disable-next-line
            const line = d3
                .line()
                .curve(d3.curveBumpX)
                .x(function (d) {
                    return x(parseTime(d[0]));
                })
                .y(function (d) {
                    return y(d[1]);
                });

            // Updata the line
            u.join("path")
                .attr("class", "lineTest")
                .merge(u)
                .transition()
                .duration(1000)
                .attrTween("d", function (d) {
                    var previous = d3.select(this).attr("d");
                    var current = line(d);
                    return interpolatePath(previous, current);
                })
                .style("fill", "none")
                .style("stroke", "#CC0000")
                .style("stroke-width", "2");

            /*
        .attrTween('d', function (d) {
    var previous = d3.select(this).attr('d');
    var current = line(d);
    return d3.interpolatePath(previous, current);
  });

            */

            /*

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
            /*

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
                */
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
                this.plotData.push([[], [], [], [], []]);
            }

            this.plotData.push([[], [], [], [], []]);

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
                // eslint-disable-next-line
                let countDaysPerMonth = 1;
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
                    // eslint-disable-next-line
                    let prevMonthIndex = 0;
                    if (j == 0) {
                        // eslint-disable-next-line
                        prevMonthIndex = monthIndex;
                        //console.log(prevMonthIndex, monthIndex);
                    }
                    this.plotData[i][2][monthIndex][1] =
                        this.plotData[i][2][monthIndex][1] + value;
                    /*
                    if (monthIndex == prevMonthIndex) {
                        countDaysPerMonth++;
                    } else {
                        this.plotData[i][2][prevMonthIndex][1] =
                            this.plotData[i][2][prevMonthIndex][1] /
                            countDaysPerMonth;
                        countDaysPerMonth = 1;
                    }
                    */
                    // eslint-disable-next-line
                    prevMonthIndex = monthIndex;
                    if (j == 0) {
                        //console.log(countDaysPerMonth);
                    }
                }
            }
            console.log(this.plotData);
            // per year
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

            /*

            //test
            for (let i = 0; i < this.plotData.length; i++) {
                const numberOfDays = this.plotData[i][1].length;
                const numberOfMonths = this.plotData[i][2].length;
                const numberOfYears = this.plotData[i][3].length;
                const lastMonthDate =
                    this.plotData[i][2][this.plotData[i][2].length - 1][0];
                const lastMonthValue =
                    this.plotData[i][2][this.plotData[i][2].length - 1][1];
                const lastYearDate =
                    this.plotData[i][3][this.plotData[i][3].length - 1][0];
                const lastYearValue =
                    this.plotData[i][3][this.plotData[i][3].length - 1][1];
                for (let j = 1; j <= numberOfDays - numberOfMonths; j++) {
                    this.plotData[i][2].push([lastMonthDate, lastMonthValue]);
                }
                for (let j = 1; j <= numberOfDays - numberOfYears; j++) {
                    this.plotData[i][2].push([lastYearDate, lastYearValue]);
                }
            }
            */

            for (let i = 0; i < this.plotData.length; i++) {
                for (let j = 0; j < this.plotData[i][3].length; j++) {
                    this.plotData[i][4].push([
                        this.plotData[i][3][j][0],
                        this.plotData[i][3][j][1] *
                            (Math.random() * (3 - 0.5) + 0.5),
                    ]);
                }
            }

            console.log(this.plotData);

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

            /*

            const margin = { top: 50, right: 50, bottom: 50, left: 50 };
            const width = 1060 - margin.left - margin.right;
            const height = 400 - margin.top - margin.bottom;

            this.width = width;
            this.height = height;
            this.margin = margin;

            */

            // Steo 2: Layout
            // = var svg...
            /*
            this.svg = d3
                .select("#my_dataviz")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("margin", 40)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
                */

            const svg = d3
                .select("#my_dataviz2")
                .append("svg")
                .attr(
                    "width",
                    this.width + this.margin.left + this.margin.right
                )
                .attr(
                    "height",
                    this.height + this.margin.top + this.margin.bottom
                )
                .append("g")
                .attr(
                    "transform",
                    `translate(${this.margin.left},${this.margin.top})`
                );

            const x = d3
                .scaleTime()

                .range([0, this.width]);
            const xAxis = d3.axisBottom().scale(x);

            svg.append("g")
                .attr("transform", `translate(0, ${this.height})`)
                .attr("class", "myXaxis");

            // Step 3: Set scale

            /*
            const xScale = d3
                .scaleTime()
                //.domain([parseTime("2017-06-22"), parseTime("2022-04-09")])
                .domain([
                    this.parseTime(this.starteDate),
                    this.parseTime(this.endDate),
                ])
                .range([0, width]);
                */

            const y = d3.scaleLinear().range([this.height, 0]);
            const yAxis = d3.axisLeft().scale(y);
            svg.append("g").attr("class", "myYaxis");

            this.x = x;
            this.y = y;
            this.xAxis = xAxis;
            this.yAxis = yAxis;
            this.svg = svg;

            /*
            const yScale = d3
                .scaleLinear()
                .domain([0, maxY])
                //.domain([0, 1000])
                .range([height, 0]);

            this.xScale = xScale;
            this.yScale = yScale;
            */
            /*

            var g = this.svg
                .append("g")
                //.attr("transform", "translate(" + 100 + "," + 100 + ")");
                .attr("transform", "translate(" + 0 + "," + 0 + ")");
                */

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

            /*
            g.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(xScale));

            g.append("g").call(d3.axisLeft(yScale));
            */

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

            /*
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
                */
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
            this.updateCurve();
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

/* STYLE BUTTONS */
.button-box {
    width: max-content;
    margin: auto;
}

.button {
    min-width: 50px;
    width: max-content;
    height: 35px;
    border-style: none;
    background-color: white;
    margin-right: 20px;
    text-decoration: none;
    color: #000;
}

.button:last-child {
    margin-right: 0px;
}

.button {
    position: relative;
    color: #000;
    text-decoration: none;
}

.button:hover {
    color: #000;
}

.button::before {
    content: "";
    position: absolute;
    display: block;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #000;
    transform: scaleX(0);
    transition: transform 0.3s ease;
    /*
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    */
}

.button:hover::before {
    transform: scaleX(1);
}

.active {
    position: relative;
}

.active::after {
    content: "";
    position: absolute;
    width: 100%;
    height: 2px;
    left: 0;
    bottom: 0;
    background-color: black;
    transition: all 0.3s ease-in-out;
    /*
    -webkit-transition: all 0.3s ease-in-out;
    -moz-transition: all 0.3s ease-in-out;
    -ms-transition: all 0.3s ease-in-out;
    -o-transition: all 0.3s ease-in-out;
    */
}

/* title */
.title {
    font-size: 20px;
    text-anchor: middle;
}
</style>
