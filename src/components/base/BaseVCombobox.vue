<template>
    <div class="tooltip">
        <v-combobox
            class="v-cbx"
            ref="Input"
            auto-select-first
            :tabindex="tabindex"
            :class="{'v-input--is-error' : !this.isValid}"
            solo
            dense
            v-model="computedValue"
            @blur="inputFocusoutEvent"
            :items="data"
        ></v-combobox>
        <span v-if="tooltipMessage" class="tooltiptext">{{tooltipMessage}}</span>
    </div>
</template>

<script>
import axios from 'axios';
import {messages} from '../../resources/vi'
    export default {
        name: "BaseVCombobox",
        props: {
            value: {

            },
            extraData: {
                default() {
                    return []
                }
            },
            api: {
                default: null
            },
            fieldName: {
                default: null,
            },
            fieldValue: {
                default: null,
            },
            label: {
                default: ''
            },
            tabindex: {
                default: '0'
            }
        },
        computed: {
            computedValue: {
                /**
                 * Hàm lấy giá trị
                 * @author: NMTuan (21/08/2021)
                 */
                get: function() {
                    return this.value;
                },
                /**
                 * Hàm set giá trị và đặt tooltip
                 * @author: NMTuan (21/08/2021)
                 */
                set: function(value) {
                    this.$emit('input', value)
                    this.tooltipMessage = this.getValidateMessage(value);      
                },
            }
        },
        data() {
            return {
                data: [],
                isValid: true,
                tooltipMessage: '',
            }
        },
        created() {
            this.data.push(...this.extraData)
            if (this.api) {
                axios.get(this.api)
                .then((response) => {
                    response.data.forEach(item => {
                        let object = {}
                        object['text'] = item[this.fieldName]
                        object['value'] = item[this.fieldValue]
                        this.data.push(object)
                    });
                })
            }
        },
        methods: {
            /**
             * Hàm xử lý khi blur khổi combobox
             * @author: NMTuan (18/08/2021)
             */
            inputFocusoutEvent() {
                this.tooltipMessage = this.getValidateMessage(this.computedValue)
                this.$emit('setValid', this.isValid);
            },

            /**
             * Method xử lý lấy giá trị message trong tooltip
             * @author: NMTuan (19/8/2021)
             */
            getValidateMessage(value) {
                if (this.checkEmpty(value)) {
                    this.isValid = false;
                    return messages.require(this.label)
                }
                if(value.value == undefined) {
                    this.isValid = false;
                    return messages.error(this.label)
                }
                this.isValid = true;
                return '';
            },

            /**
             * Hàm kiểm tra tồn tại giá trị trong input
             * @author: NMTuan (18/08/2021)
             */
            checkItemExist(text) {
                let isValid = false
                this.data.forEach((item) => {
                    if (item == text) {
                        isValid = true
                    }
                })
                return isValid;
            },

            /**
             * Hàm kiểm tra giá có trống không
             * @author: NMTuan (18/08/2021)
             */
            checkEmpty(text) {
                if(!text) {
                    return true;
                }
                return false;
            }

        }
    }
</script>

<style lang="css" scoped>
@import "../../css/base/vcombo-box.css";
</style>