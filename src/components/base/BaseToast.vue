<template>
    <div class="toast" :class="classType">
        <div class="toast__icon mi mi-24" :class="iconClass">
        </div>
        <div class="toast__message">{{message}}</div>
        <div class="toast__close-icon mi mi-16 mi-16-close" ></div>
    </div>
</template>

<script>
    export default {
        name: 'BaseToast',
        props: {
            type: {
                default: 'success'
            },
            message: {
                type: String,
                default: ''
            }
        },
        computed: {
            classType() {
                return 'toast--' + this.type
            },

            iconClass() {
                return 'mi-24-' + this.type
            },
        },
        created() {

        }
    }
</script>

<style scoped>
@import '../../css/base/toast.css';
</style>