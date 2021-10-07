<template>
  <div class="router-view tax-administration">
    <transition name="fade">
      <TaxDetail 
        v-if='modalShow'
        @closeModal='closeModal'
        :entityId='entityId'
        :formState='formState'
      />
    </transition>
    <BaseToastContainer />
    <BasePopup 
      v-if="popup['isShow']"
      :type="popup['type']"
      :title="popup['title']"
      :message="popup['message']"
      :isShow="popup['isShow']"
      :callback="popup['callback']"
      :subCallback="popup['subCallback']"
      :confirm="popup['confirm']"
      :subConfirm="popup['subConfirm']"
      :cancel="popup['cancel']"
    />
    <BaseContextMenu />
    <TaxContent 
      :isContentCollapse="isContentCollapse"
      ref="TaxContent"
      @openModal='openModal'
      @closeModal='closeModal'
      :modalShow='modalShow'
    />
  </div>
</template>

<script>
import TaxContent from "./TaxContent.vue";
import TaxDetail from "./TaxDetail.vue"
import BasePopup from "../../base/BasePopup"
import BaseToastContainer from '../../base/BaseToastContainer.vue';
import BaseContextMenu from '../../base/BaseContextMenu.vue'
import EmployeeApi from '../../../js/api/employee/employee-api';
import axios from 'axios';
import {TaxStore} from './store'

export default {
  name: "TaxAdministration",
  props: ['isContentCollapse'],
  components: {
    TaxContent,
    TaxDetail,
    BasePopup,
    BaseToastContainer,
    BaseContextMenu
  },
  created() {
    this.$eventBus.$on('openModal', this.openModal)
    this.$eventBus.$on('showPopup', this.showPopup)
    // Lấy dữ liệu department
    axios.get(EmployeeApi.departmentApi)
    .then((response) => {
        TaxStore.state.department = [];
        response.data.forEach(item => {
            let object = {}
            object['text'] = item['DepartmentName']
            object['value'] = item['DepartmentId']
            TaxStore.state.department.push(object)
        });
    })
    
  },
  destroyed() {
    this.$eventBus.$off('openModal', this.openModal);
    this.$eventBus.$off('showPopup', this.showPopup)
  },
  data() {
    return {
      store: TaxStore.state,
      department: [],
      modalShow: false,
      entityId: null,
      formState: '',
      popup: {
        title: '',
        message: '',
        type: 'warning',
        isShow: false,
      },
    }
  },
  methods: {
    /**
     * Hàm mở form
     */
    openModal(id, state) {
      this.formState = state
      this.entityId = id
      this.modalShow = true
    },

    /**
     * Hàm đóng form
     */
    closeModal() {
      this.modalShow = false
    },

    /**
     * Hàm mở popup
     */
    showPopup(popup) {
      this.popup = popup
    }

  }
};
</script>
<style scoped>
@import "../../../css/views/tax/tax.css";
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>