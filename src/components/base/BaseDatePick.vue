<template>
  <div class="tooltip">
    <date-picker 
      :class="{'mx-datepicker--error': !isValid}"
      v-model="computedDate"                 
      value-type="YYYY-MM-DD"
      :input-attr="{tabindex: tab}"
      :format='formatType'
      :placeholder="formatType"
      :lang="lang"
      :input-class="inputClass"
      :disabled-date="(date) => date > new Date()"
      @input-error="inputErrorEvent"
      @change="changeEvent"
    ></date-picker>
    <span v-if="tooltipMessage" class="tooltiptext">{{tooltipMessage}}</span>
  </div>
</template>

<script>
  import DatePicker from 'vue2-datepicker';
  import 'vue2-datepicker/index.css';
  import 'vue2-datepicker/locale/vi'
  import '../../css/base/datepick.css'

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
        isValid: true
      };
    },
    methods: {
      inputFocusoutEvent() {},

      /**
       * Hàm gọi khi giá trị nhập sai
       * @author: NMTuan (20/08/2021)
       */
      inputErrorEvent(val) {
        // this.tooltipMessage = 'Ngày vừa nhập <' + val + '> không hợp lệ!';
        // this.isValid = false
        return val
      },

      /**
       * Hàm gọi khi giá trị thay đổi
       * @author: NMTuan (20/08/2021)
       */
      changeEvent() {
        this.tooltipMessage = ''
        this.isValid = true
      }
    }
  };
</script>
