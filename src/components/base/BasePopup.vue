<template>
    <div class="popup__background" v-if="isShow">
        <div tabindex="0" ref="Popup" @keydown.enter="confirmPopup" class="popup" :class="classType" >
            <div class="popup__header">
                <div class="popup__title">{{title}}</div>
                <div class="mi mi-24 mi-close close pointer" @click="closePopup"></div>
            </div>
            <div class="popup__body">
                <!-- <div class="popup__icon mi mi-48" :class="iconClass"></div> -->
                <div v-html="message" class="popup__content">
                </div>
            </div>
            <div class="popup__footer flex flex-justify-space-evenly flex-align-center">
                <div class="popup__footer-left flex flex-align-center">
                    <div v-if="cancel && subConfirm" class="popup__btn btn-base btn-seconds cancel" @click="closePopup" >{{cancel}}</div>
                </div>
                <div class="popup__footer-right flex flex-align-center">
                    <div v-if="subConfirm" class="popup__btn btn-base btn-seconds sub-confirm" @click="subConfirmPopup" >{{subConfirm}}</div>
                    <div v-if="cancel && !subConfirm" class="popup__btn btn-base btn-seconds cancel" @click="closePopup" >{{cancel}}</div>
                    <div class="popup__btn btn-base btn-icon confirm" @click="confirmPopup" >{{confirm}}</div>
                </div>
            </div>
        </div>
    </div>   
</template>

<script>
    export default {
        name: 'BasePopup',
        props: {
            type: {
                default: 'alarm'
            },

            title: {
                default: 'Xác nhận'
            },

            message: {
                default: ''
            },

            callback: {
                type: Function,
                default: function () {}
            },

            subCallback: {
                type: Function,
                default: function () {}
            },

            subConfirm: {

            },

            confirm: {
                default: 'Xác nhận'
            },

            cancel: {
                default: 'Hủy'
            },

            isShow: {
                default: false
            }
        },
        computed: {
            /**
             * Computed class cho popup
             * @author: NMTuan (22/08/2021)
             */
            classType() {
                let classType = 'popup--' + this.type
                return classType
            },

            /**
             * Computed class icon theo từng loại
             * @author: NMTuan (22/08/2021)
             */
            iconClass() {
                let classIcon = 'mi-' + this.type
                return classIcon
            }
        },
        mounted() {
            this.$refs.Popup.focus()
        },
        methods: {
            /**
             * Hàm đóng popup
             * @author: NMTuan (21/08/2021)
             */
            closePopup() {
                this.$parent.popup = { isShow: false }
            },

            /**
             * Hàm xác nhận popup
             * @author: NMTuan (21/08/2021)
             */
            confirmPopup() {
                this.closePopup()
                this.callback()
            },

            /**
             * Hàm xác nhận phụ (nút xác nhận 2)
             * @author: NMTuan (21/08/2021)
             */
            subConfirmPopup() {
                this.closePopup()
                this.subCallback()
            }
        }
    }
</script>

<style scoped>
@import '../../css/base/popup.css'
</style>