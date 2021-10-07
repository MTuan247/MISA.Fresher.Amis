<template>
    <div :class="fieldClass" class="field-label tooltip-container">
        <div v-if="inputLabel && isLabel" class="label" >{{inputLabel}} <span v-if="required" style="color: red;">*</span></div>
        <input 
            ref="Input"
            autocomplete="off"
            spellcheck="false"
            v-model="computedValue"
            :disabled="isDisabled"
            :id="inputId" 
            :class="[inputClass, { 'field--error': !isValid, 'field--focus': isFocus }]" 
            :name="inputName"
            :tabindex="tabindex"
            :placeholder="placeholder"
            :style="{textAlign: textAlign=='right' ? 'right' : 'left'}"
            @input="onInputEvent"
            @focus="inputFocusEvent"
            @blur="inputFocusoutEvent"
            @keypress="filterInput($event)"
            @mouseenter="isShowTooltip = true"
            @mouseleave="isShowTooltip = false"
        >
        <slot name="icon"></slot>
        <div v-if="clearIcon" v-show="!this.isEmpty" @click="clearInput" class="mi mi-24 mi-16-close clear-icon"></div>
        <span v-if="tooltipMessage" v-show="isShowTooltip" class="tooltiptext">{{tooltipMessage}}</span>
    </div>
</template>

<script>
    import {validate, validateEmail, validateRequire} from '../../js/common/validate'
    export default {
        name: 'BaseInput',
        props: {
            //Label input
            inputLabel: {},
            //Loại input email, text, number
            inputType: {
                type: String,
                default: 'text'
            },
            //Class cho input
            inputClass: {
                type: String
            },
            //Id cho input
            inputId: {
                type: String
            },
            //Name attribute input
            inputName: {
                type:String
            },
            //Max length
            inputMaxlength: {
                type: Number,
                default: 100
            },
            //Clear icon
            clearIcon: {
                default: false,
            },
            //Bắt buộc
            required: {
                default: false
            },
            //Pattern
            pattern: {
                default: false
            },
            isDisabled: {
                default: false
            },
            tabindex: {
                default: '0'
            },
            value: {},
            placeholder: {},
            fieldClass: {},
            isLabel: {
                default: true,
            },
            textAlign: {
                default: 'left'
            }
        },
        data() {
            return {
                isFocus: false,
                isEmpty: true,
                isValid: true,
                isShowTooltip: false,
                tooltipMessage: '',
                delayTooltip: null,
            }
        },
        computed: {
            computedValue: {
                get: function() {
                    return this.value;
                },
                set: function(value) {
                    this.$emit('input', value)
                },
            }
        },
        watch: {
        },
        methods: {
            /**
             * Method xử lí event focusin
             * @author: NMTuan (15/7/2021)
             */
            inputFocusEvent() {
                this.isFocus = true
                this.$refs.Input.select()
            },

            /**
             * Method xử lí event focusout
             * @author: NMTuan (15/7/2021)
             */
            inputFocusoutEvent() {
                this.isFocus = false;
                this.validate();
                this.$emit('validate', this.isValid);
            },

            /**
             * Method xử lý sự kiện khi đang nhập
             * @author: NMTuan (15/7/2021)
             */
            onInputEvent() {
                this.$nextTick(() => this.validateRequire()) 
            },

            /**
             * Method xử lý sự kiện khi click clear button
             * @author: NMTuan (15/7/2021)
             */
            clearInput() {
                this.$emit('input', '');
                this.validate();
                this.isEmpty = true;
            },

            /**
             * Method xử lý ẩn hiện clear icon
             * @author: NMTuan (15/7/2021)
             */
            showClearIcon() {
                if(this.computedValue) {
                    this.isEmpty = false;
                } else {
                    this.isEmpty = true;
                }
            },

            /**
             * Hàm hiện tooltip
             * @author: NMTuan (29/08/2021)
             */
            showTooltip() {
                clearTimeout(this.delayTooltip)
                this.isShowTooltip = true,
                this.delayTooltip = setTimeout(() => {
                    this.isShowTooltip = false
                }, 1500)
            },

            /**
             * Hàm validate required
             * @author: NMTuan (20/09/2000)
             */
            validateRequire() {
                let value = this.computedValue
                if(this.required) {
                    if(!validateRequire(value)) {                        
                        this.isValid = false;
                        this.tooltipMessage = this.$resources.messages.required(this.inputLabel)
                        return false
                    }
                }
                this.isValid = true;
                this.tooltipMessage = ''
                return true
            },

            /**
             * Method xử lý lấy giá trị message trong tooltip
             * @author: NMTuan (15/7/2021)
             */
            validate() {
                let value = this.computedValue
                //Kiểm tra trường bắt buộc
                if(this.required) {
                    if(!validateRequire(value)) {                        
                        this.isValid = false;
                        this.tooltipMessage = this.$resources.messages.required(this.inputLabel)
                        return false
                    }
                }
                //Kiểm tra email
                if(this.inputType == 'email') {
                    if (!validateEmail(value)) {
                        this.isValid = false;
                        this.tooltipMessage = this.$resources.messages.invalid(this.inputLabel);
                        return false
                    }
                }
                //Kiểm tra theo pattern
                if(this.pattern) {
                    if(!validate(value, this.pattern)) {
                        this.isValid = false;
                        this.tooltipMessage = this.$resources.messages.invalid(this.inputLabel);
                        return false
                    }
                }
                this.isValid = true;
                this.tooltipMessage = '';
                return true;
            },

            /**
             * Hàm filter ký tự nhập vào
             * @author: NMTuan (20/08/2021)
             */
            filterInput: function(evt) {
                if (this.inputType == "number") {
                    evt = (evt) ? evt : window.event;
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                        evt.preventDefault();
                    }
                }
                if (this.inputMaxlength) {
                    if (this.computedValue.length >= this.inputMaxlength) {
                        evt.preventDefault()
                        this.tooltipMessage = `Không được nhập quá ${this.inputMaxlength} kí tự!`
                        this.showTooltip()
                    }
                }
            }

        }

    }
</script>

<style scoped>
@import '../../css/base/input.css';
</style>