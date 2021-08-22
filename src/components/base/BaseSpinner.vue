<template>
    <div v-if="isLoading" class="modal" :style="{opacity : opacity, backgroundColor: backgroundColor}">
        <!-- <ClipLoader :loading="isLoading" :size="size" :style="{opacity : opacity, backgroundColor: backgroundColor}" /> -->
        <object class="spinner" :data="loaderUrl"></object>
    </div>
</template>

<script>
    // import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    export default {
        name: 'BaseSpinner',
        props: {
            isLoading: {},
            opacity: {
                default: 1
            },
            size: {
                default: '60px'
            },
            backgroundColor: {
                default: 'rgba(0,0,0,0)'
            }
        },
        components: {
            // ClipLoader
        },
        data() {
            return {
                loaderUrl: require('../../assets/icon/loading.svg')
            }
        },
        mounted() {
        }
    }
</script>

<style scoped>
@import '../../css/base/spinner.css';
</style>