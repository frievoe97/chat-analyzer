<template>
    <div>
        <plotly
            class="plot"
            :data="dataTest"
            :layout="layout"
            :transition="transition"
        ></plotly>
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
                },
            ],
            layout: {
                title: "Number of messages since start",
                yaxis: {
                    autorange: true,
                    automargin: true,
                    mirror: true,
                },
                margin: 0,
                padding: 0,
                showlegend: true,
                legend: {
                    orientation: "h",
                },
                xaxis: {
                    mirror: true,
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
                    rangeslider: { autorange: true },
                    type: "date",
                    //autorange: true,
                    //tickformat: "%d/%m",
                },
            },
            transition: {
                duration: 500,
                easing: "cubic-in-out",
            },
            frame: {
                duration: 500,
            },
        };
    },
    mounted() {
        this.prepareData();
    },
    watch: {
        msgData() {
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
