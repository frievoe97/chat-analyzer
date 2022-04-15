<template>
    <div class="button-box" style="height: 50px">
        <button class="button" v-for="name in buttons" v-bind:key="name">
            {{ name }}
        </button>
    </div>
</template>

<script>
import Vue from "vue";
import VuePapaParse from "vue-papa-parse";
Vue.use(VuePapaParse);

export default {
    components: {},
    name: "PlotButtons",
    props: {
        buttons: Array,
    },
    data() {
        return {};
    },
    mounted() {},

    methods: {},
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button-box {
    width: max-content;
    margin: auto;
}

.button {
    min-width: 50px;
    width: max-content;
    height: 40px;
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
}

.button:hover::before {
    transform: scaleX(1);
}
</style>
