<template>
    <div class="tooltip-container">
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
            @mouseenter="isShowTooltip = true"
            @mouseleave="isShowTooltip = false"
            :items="data"
            :return-object="returnObject"
        ></v-combobox>
        <span v-if="tooltipMessage" v-show="isShowTooltip" class="tooltiptext">{{tooltipMessage}}</span>
    </div>
</template>

<script>
import axios from 'axios';
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
            },
            required: {
                default: false
            },
            returnObject: {
                default: true
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
                    this.tooltipMessage = this.validate(value);      
                },
            }
        },
        data() {
            return {
                data: [],
                isValid: true,
                tooltipMessage: '',
                isShowTooltip: false,
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
                this.tooltipMessage = this.validate(this.computedValue)
                this.$emit('validate', this.isValid);
            },

            /**
             * Method xử lý lấy giá trị message trong tooltip
             * @author: NMTuan (19/8/2021)
             */
            validate(value) {
                if (this.required) {
                    if (this.checkEmpty(value)) {
                        this.isValid = false;
                        return this.$resources.messages.required(this.label)
                    }
                }
                if (this.returnObject) {
                    if(value.value == undefined) {
                        this.isValid = false;
                        return this.$resources.messages.error(this.label)
                    }
                }
                
                this.isValid = true;
                return '';
            },

            /**
             * Hàm hiện tooltip
             * @author: NMTuan (29/08/2021)
             */
            showTooltip() {
                this.isShowTooltip = true,
                setTimeout(() => {
                    this.isShowTooltip = false
                }, 1000)
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