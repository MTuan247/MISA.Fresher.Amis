<template>
    <div class="field-label tooltip">
        <div class="label" >{{inputLabel}} <span v-if="required" style="color: red;">*</span></div>
        <input 
            ref="Input"
            autocomplete="off"
            spellcheck="false"
            :disabled="isDisabled"
            :id="inputId" 
            :class="[inputClass, { 'field--error': !isValid, 'field--focus': isFocus }]" 
            :type="inputType" 
            :maxlength="inputMaxlength" 
            :name="inputName"
            :required="required"
            :value="this.value"
            :tabindex="tabindex"
            @input="onInputEvent"
            @focus="inputFocusEvent"
            @blur="inputFocusoutEvent"
            @keypress="filterInput($event)"
        >
        <div v-if="clearIcon" v-show="!this.isEmpty" @click="clearInput" class="mi mi-24 mi-16-close icon-right"></div>
        <span v-if="tooltipMessage" class="tooltiptext">{{tooltipMessage}}</span>
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
                default: true,
            },
            //Có tooltip k
            tooltip: {
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
            //Giá trị truyền vào
            modelValue: {
                type: String,
                default: ''
            },
            isDisabled: {
                default: false
            },
            filterInputType: {
                default: 'text'
            },
            tabindex: {
                default: '0'
            }
        },
        data() {
            return {
                isFocus: false,
                isEmpty: true,
                isValid: true,
                isShowTooltip: false,
                value: this.modelValue,
                tooltipMessage: '',
            }
        },
        computed: {
        },
        watch: {
            modelValue: function(value) {
                this.value = value
                this.isFocus = false
                // this.isValid = true
            }
        },
        methods: {
            /**
             * Method xử lí event focusin
             * @author: NMTuan (15/7/2021)
             */
            inputFocusEvent() {
                this.isFocus = true
            },

            /**
             * Method xử lí event focusout
             * @author: NMTuan (15/7/2021)
             */
            inputFocusoutEvent() {
                this.isFocus = false;
                this.tooltipMessage = this.getValidateMessage();
                this.$emit('setValid', this.isValid);
                this.$emit('update', this.value);
            },

            /**
             * Method xử lý sự kiện khi đang nhập
             * @author: NMTuan (15/7/2021)
             */
            onInputEvent($event) {
                this.value = $event.target.value;
                this.$emit('update', $event.target.value);
            },

            /**
             * Method xử lý sự kiện khi click clear button
             * @author: NMTuan (15/7/2021)
             */
            clearInput() {
                this.$emit('update', '');
                this.getValidateMessage();
                this.isEmpty = true;
            },

            /**
             * Method xử lý ẩn hiện clear icon
             * @author: NMTuan (15/7/2021)
             */
            showClearIcon() {
                if(this.value) {
                    this.isEmpty = false;
                } else {
                    this.isEmpty = true;
                }
            },

            /**
             * Method xử lý lấy giá trị message trong tooltip
             * @author: NMTuan (15/7/2021)
             */
            getValidateMessage() {
                //Kiểm tra trường bắt buộc
                if(this.required) {
                    if(!validateRequire(this.value)) {                        
                        this.isValid = false;
                        return this.$resources.messages.required(this.inputLabel)
                    }
                }
                //Kiểm tra email
                if(this.inputType == 'email') {
                    if (!validateEmail(this.value)) {
                        this.isValid = false;
                        return this.$resources.messages.invalid(this.inputLabel);
                    }
                }
                //Kiểm tra theo pattern
                if(this.pattern) {
                    if(!validate(this.value, this.pattern)) {
                        this.isValid = false;
                        return this.$resources.messages.invalid(this.inputLabel);
                    }
                }
                this.isValid = true;
                return '';
            },

            /**
             * Hàm filter ký tự nhập vào
             * @author: NMTuan (20/08/2021)
             */
            filterInput: function(evt) {
                if (this.filterInputType == "number") {
                    evt = (evt) ? evt : window.event;
                    var charCode = (evt.which) ? evt.which : evt.keyCode;
                    if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
                        evt.preventDefault();
                    } else {
                        return true;
                    }
                }
            }

        }

    }
</script>

<style scoped>
@import '../../css/base/input.css';
</style>