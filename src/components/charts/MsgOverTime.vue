<template>
    <div>
        <plotly class="plot" :data="dataTest" :layout="layout"></plotly>
        <PlotButtons :buttons="buttonsNames" />
    </div>
</template>

<script>
import { Plotly } from "vue-plotly";
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
import PlotButtons from "../PlotButtons.vue";
Vue.use(VuePapaParse);

export default {
    name: "MsgOverTime",
    components: {
        Plotly,
        PlotButtons,
    },
    props: {
        msgData: Array,
        names: Array,
    },
    data() {
        return {
            buttonsNames: ["day", "month", "year"],
            dataTest: [
                {
                    x: [],
                    y: [],
                    title: "abc",
                    //mode: "bar",
                    type: "bar",
                    legend: true,
                },
            ],
            layout: {
                title: "Number of messages since start",
                yaxis: {
                    autorange: true,
                },
                xaxis: {
                    rangeselector: {
                        buttons: [
                            {
                                count: 1,
                                label: "1 month",
                                step: "month",
                                stepmode: "backward",
                            },
                            {
                                count: 6,
                                label: "6 month",
                                step: "month",
                                stepmode: "backward",
                            },
                            {
                                count: 12,
                                label: "12 month",
                                step: "month",
                                stepmode: "backward",
                            },
                            { step: "all" },
                        ],
                    },
                    legend: {
                        showlegend: true,
                        legend: {
                            yanchor: "bottom",
                            y: 0,
                            xanchor: "right",
                            x: 1,
                            orientation: "h",
                        },
                    },
                    rangeslider: { autorange: true },
                    type: "date",
                    //autorange: true,
                    //tickformat: "%d/%m",
                },
            },
        };
    },
    mounted() {
        this.prepareData();
    },
    watch: {
        msgData() {
            console.log("New Data!");
            this.prepareData();
        },
    },
    methods: {
        prepareData: function () {
            if (this.msgData.length == 0) {
                return;
            }
            this.dataTest = [];
            // Each name
            for (let i = 0; i < this.names.length; i++) {
                const nameTemp = this.names[i];
                let dataObj = {
                    x: [],
                    y: [],
                    type: "bar",
                    legend: true,
                    name: nameTemp,
                };
                let currentValue = 0;
                let prevDate = "";
                let date = "";
                for (let j = 0; j < this.msgData.length; j++) {
                    if (this.msgData[i].name == nameTemp) {
                        date = this.msgData[j].date;
                        if (j == 0) {
                            prevDate = date;
                        }
                        if (prevDate === date) {
                            currentValue++;
                            prevDate = date;
                        } else {
                            dataObj.x.push(prevDate);
                            dataObj.y.push(currentValue);
                            currentValue = 0;
                        }
                        prevDate = date;
                    }
                }
                this.dataTest.push(dataObj);
            }

            // general

            console.log("prepare new Data");
            let dataObj = {
                x: [],
                y: [],
                type: "bar",
                legend: true,
                name: "Gesamt",
            };
            let currentValue = 0;
            let prevDate = "";
            let date = "";
            for (let i = 0; i < this.msgData.length; i++) {
                date = this.msgData[i].date;
                if (i == 0) {
                    prevDate = date;
                }
                if (prevDate === date) {
                    currentValue++;
                    prevDate = date;
                } else {
                    dataObj.x.push(prevDate);
                    dataObj.y.push(currentValue);
                    currentValue = 0;
                }
                prevDate = date;
            }
            this.dataTest.push(dataObj);
            console.log(this.dataTest);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plot {
    height: calc(100% - 50px);
}
</style>
