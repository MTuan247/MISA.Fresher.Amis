<template>
  <div class="tooltip-container"
    @mouseenter="showTooltip"
    @mouseleave="isShowTooltip = false"
  >
    <date-picker 
      ref="Input"
      :class="{'mx-datepicker--error': !isValid}"
      v-model="computedDate"                 
      value-type="YYYY-MM-DD"
      :input-attr="{tabindex: tab}"
      :format='formatType'
      :placeholder="formatType"
      :lang="lang"
      :input-class="inputClass"
      :disabled-date="disabledDate"
      @input-error="inputErrorEvent"
      @change="changeEvent"
      @focus="inputFocusEvent"
      @blur="inputFocusoutEvent"
    ></date-picker>
    <span v-if="tooltipMessage" v-show="isShowTooltip" class="tooltiptext">{{tooltipMessage}}</span>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';
  import 'vue2-datepicker/locale/vi'
  import '../../css/base/datepick.css'
  import { formatDateOnInput } from '../../js/common/format';

  export default {
    components: { DatePicker },
    props: {                    
      inputClass: {

      },
      value: {

      },
      formatType: {
        default: 'DD/MM/YYYY'
      },
      tab: {
        default: '0'
      },
      disabledDate: {
        default: () => {
          return (date) => date > new Date()
        }
      },
      required: {
        default: false
      },
      label: {

      }
    },
    computed: {
      computedDate: {
        get: function() {
          return this.value;
        },
        set: function(value) {
          this.$emit('input', value)
        },
      }
      
    },
    data() {
      return {
        lang: {
          formatLocale: {
            firstDayOfWeek: 1,
          },
          monthBeforeYear: true,
        },
        tooltipMessage: '',
        isValid: true,
        isShowTooltip: false
      };
    },
    mounted() {
      /**
       * Hàm format date, thêm dấu / trong lúc nhập
       * @author: NMTuan (08/09/2021)
       */
      let input = this.$el.querySelector('input')
      input.addEventListener('input', (e) => {
        input.value = formatDateOnInput(e.target.value, this.formatType)
      })
    },
    methods: {
      /**
       * Hàm focus out input
       * @author: NMTuan (27/09/2021)
       */
      inputFocusoutEvent() {
        this.validateRequired()
        this.$emit('validate', this.isValid)
      },

      /**
       * Hàm focus event
       * @author: NMTuan (10/09/2021)
       */
      inputFocusEvent() {
        let input = this.$el.querySelector('input')
        input.select()
      },

      /**
       * Hàm gọi khi giá trị nhập sai
       * @author: NMTuan (20/08/2021)
       */
      inputErrorEvent(val) {
        this.tooltipMessage = 'Ngày vừa nhập <' + val + '> không hợp lệ!';
        return val
      },

      /**
       * Hàm gọi khi giá trị thay đổi
       * @author: NMTuan (20/08/2021)
       */
      changeEvent() {
        this.tooltipMessage = ''
        this.isValid = true
      },

      /**
       * Hàm hiện tooltip
       * @author: NMTuan (09/09/2021)
       */
      showTooltip() {
        if (!this.tooltipMessage) return;
        this.isShowTooltip = true
        this.$nextTick(() => {
          let tooltip = this.$el.querySelector('.tooltiptext')
          let parent = this.$el.parentElement
          let tooltipRight = tooltip.getBoundingClientRect().right
          let parentRight = parent.getBoundingClientRect().right
          if (tooltipRight > parentRight) {
            tooltip.style.right = "0px"
            tooltip.style.left = "unset"
          }
        })
      },

      /**
       * Hàm validate bắt buộc nhập
       * @author: NMTuan (09/09/2021)
       */
      validateRequired() {
        if (this.required) {
          if (!this.computedDate) {
            this.isValid = false
            this.tooltipMessage = this.$resources.messages.required(this.label);
          } else {
            this.isValid = true
            this.tooltipMessage = ""
          }
        }
      }
    }
  };
</script>
