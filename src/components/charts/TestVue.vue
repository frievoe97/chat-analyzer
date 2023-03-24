<template>
    <div class="test">
        <p style="height: 80px; color: black">Guten Tag! Wie gehts?!?!</p>
        <div class="content"></div>
    </div>
</template>

<script>
export default {
    // eslint-disable-next-line
    name: "TestVue",
    props: {},

    data() {
        return {};
    },
    mounted() {},
};
</script>

<style>
.content {
    width: 100%;
    height: calc(100% - 80px);
    position: absolut;
}
.test {
    width: 100%;
    height: 100%;
}
</style>
