<template>
    <div class="test-plot">
        <Plotly
            :data="dataTest"
            :layout="layout"
            :display-mode-bar="false"
        ></Plotly>
    </div>
</template>

<script>
import { Plotly } from "vue-plotly";
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
Vue.use(VuePapaParse);

export default {
    components: {
        Plotly,
    },
    name: "HelloWorld",
    props: {},
    data: function () {
        return {
            data: [
                {
                    x: [1, 2, 3, 4],
                    y: [10, 15, 13, 17],
                    type: "scatter",
                },
            ],
            layout: {
                title: "My graph",
            },
        };
    },
    mounted() {
        this.readTxt();
    },
    methods: {
        readTxt: function () {
            //console.log(this.$papa.parse('../../assets/lisa.txt', {}))
            //const response =  fetch("../../assets/lisa.txt");
            //console.log(response)
            //const reader = new FileReader();
            //reader.readAsText("../../assets/lisa.txt");
            //console.log(reader)
            //fetch('./lisa.txt').then(response => response.text()).then(text => console.log(text))
        },
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped></style>
