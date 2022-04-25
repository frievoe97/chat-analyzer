<template>
    <div class="test-plot">
        <Plotly class="plot" :data="dataTest" :layout="layout" />
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
    components: {
        Plotly,
        PlotButtons,
    },
    name: "MsgOverTime3",
    props: {
        msgData: Array,
        names: Array,
    },
    data() {
        return {
            buttonsNames: ["absolute", "relative"],
            dataTest: [],
            layout: {
                title: "Ratio of messages sent",
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
            this.prepareData();
        },
    },
    methods: {
        prepareData: function () {
            this.dataTest = [];

            let dataObj = {
                labels: [],
                values: [],
                title: "",
                type: "pie",
                legend: true,
            };
            for (let i = 0; i < this.names.length; i++) {
                dataObj.labels.push(this.names[i]);
                dataObj.values.push(0);
            }

            for (let i = 0; i < this.msgData.length; i++) {
                const nameTemp = this.msgData[i].name;
                dataObj.values[this.names.indexOf(nameTemp)]++;
            }

            this.dataTest.push(dataObj);
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
