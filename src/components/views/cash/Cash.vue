<template>
  <div class="router-view">
    <transition name="fade">
      <CashDetail 
        v-if='modalShow'
        @closeModal='closeModal'
        :entityId='entityId'
        :formState='formState'
      />
    </transition>
    <CashSettings />
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
    <CashContent 
      :isContentCollapse="isContentCollapse"
      ref="CashContent"
      @openModal='openModal'
      @closeModal='closeModal'
      :modalShow='modalShow'
    />
  </div>
</template>

<script>
import CashContent from "./CashContent.vue";
import CashDetail from "./CashDetail.vue"
import BasePopup from "../../base/BasePopup"
import BaseToastContainer from '../../base/BaseToastContainer.vue';
import BaseContextMenu from '../../base/BaseContextMenu.vue'
import EmployeeApi from '../../../js/api/employee/employee-api';
import CashSettings from './CashSettings.vue'
import axios from 'axios';
import {CashStore} from './store'

export default {
  name: "Cash",
  props: ['isContentCollapse'],
  components: {
    CashContent,
    CashDetail,
    BasePopup,
    BaseToastContainer,
    BaseContextMenu,
    CashSettings
  },
  created() {
    this.$eventBus.$on('openModal', this.openModal)
    this.$eventBus.$on('showPopup', this.showPopup)
    // Lấy dữ liệu department
    axios.get(EmployeeApi.departmentApi)
    .then((response) => {
        CashStore.state.department = [];
        response.data.forEach(item => {
            let object = {}
            object['text'] = item['DepartmentName']
            object['value'] = item['DepartmentId']
            CashStore.state.department.push(object)
        });
    })
    
  },
  destroyed() {
    this.$eventBus.$off('openModal', this.openModal);
    this.$eventBus.$off('showPopup', this.showPopup)
  },
  data() {
    return {
      store: CashStore.state,
      department: [],
      modalShow: false,
      entityId: null,
      formState: '',
      cashState: '',
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
    openModal(id, state, cashState) {
      this.formState = state
      this.cashState = cashState
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
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>