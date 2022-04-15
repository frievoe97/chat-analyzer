<template>
    <div class="test-plot">
        <Plotly class="plot" :data="dataTest" :layout="layout" />
        <PlotButtons :buttons="buttonsNames1" />
        <PlotButtons :buttons="buttonsNames2" />
    </div>
</template>

<script>
import { Plotly } from "vue-plotly";
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
import PlotButtons from "../PlotButtons.vue";
Vue.use(VuePapaParse);

export default {
    components: {
        Plotly,
        PlotButtons,
    },
    name: "MsgOverTime2",
    props: {
        msgData: Array,
        names: Array,
        config: Object,
    },
    data() {
        return {
            buttonsNames1: ["hour", "minute", "second"],
            buttonsNames2: ["absolute", "relative"],
            dataTest: [],
            layout: {
                title: "Number of messages per hour",
                xaxis: {
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
            console.log(this.names);
            this.prepareData();
        },
        names() {
            this.prepareData();
        },
    },
    methods: {
        prepareData: function () {
            console.log(this.names, this.config);
            if (this.msgData.length == 0) {
                return;
            }

            this.dataTest = [];

            // Each Name

            for (let i = 0; i < this.names.length; i++) {
                const nameTemp = this.names[i];
                console.log(nameTemp);
                let dataObj = {
                    x: [
                        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
                        16, 17, 18, 19, 20, 21, 22, 23,
                    ],
                    y: [
                        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0,
                    ],
                    name: nameTemp,
                };

                for (let j = 0; j < this.msgData.length; j++) {
                    if (this.msgData[j].name == nameTemp) {
                        for (let k = 0; k < dataObj.x.length; k++) {
                            if (
                                dataObj.x[k] ==
                                this.msgData[j].time.substring(0, 2)
                            ) {
                                dataObj.y[k]++;
                            }
                        }
                    }
                }
                this.dataTest.push(dataObj);
            }

            let dataObj = {
                x: [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                    17, 18, 19, 20, 21, 22, 23,
                ],
                y: [
                    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                    0, 0, 0, 0,
                ],
                name: "Gesamt",
            };

            for (let i = 0; i < this.msgData.length; i++) {
                for (let j = 0; j < dataObj.x.length; j++) {
                    if (dataObj.x[j] == this.msgData[i].time.substring(0, 2)) {
                        dataObj.y[j]++;
                    }
                }
            }

            for (let i = 0; i < dataObj.y.length; i++) {
                dataObj.y[i] = (100 / this.config.totalMsg) * dataObj.y[i];
            }

            //let tempData = this.dataTest;
            //this.dataTest = tempData;
            this.dataTest.push(dataObj);
            console.log(this.dataTest);
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.plot {
    height: calc(100% - 100px);
}
</style>
