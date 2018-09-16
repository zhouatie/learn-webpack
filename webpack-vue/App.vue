<template>
    <div>
        <h1>{{ msg }}</h1>
        <button @click="handleClick">按钮</button>
    </div>
</template>
<script>
export default {
    data() {
        return {
            msg: 'Hello, world vue'
        }
    },
    methods: {
        handleClick() {
            const message = `i use es6 to compiler | ${this.msg}`;
            this.msg = message;
        }
    }
}
</script>
<style>
</style>
