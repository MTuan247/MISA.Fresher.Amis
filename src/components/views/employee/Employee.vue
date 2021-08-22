<template>
  <div class="router-view">
    <transition name="fade">
      <EmployeeForm 
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
    
    <EmployeeContent 
      :isContentCollapse="isContentCollapse"
      ref="EmployeeContent"
      @openModal='openModal'
      @closeModal='closeModal'
      :modalShow='modalShow'
    />
    <!-- </div> -->
  </div>
</template>

<script>
import EmployeeContent from "./EmployeeContent.vue";
import EmployeeForm from "./EmployeeForm.vue"
import BasePopup from "../../base/BasePopup"
import BaseToastContainer from '../../base/BaseToastContainer.vue';

export default {
  name: "Employee",
  props: ['isContentCollapse'],
  components: {
    EmployeeContent,
    EmployeeForm,
    BasePopup,
    BaseToastContainer,
  },
  created() {
    localStorage.formatDate = "DD/MM/YYYY"
    this.$eventBus.$on('openModal', this.openModal)
    this.$eventBus.$on('showPopup', this.showPopup)
  },
  destroyed() {
    this.$eventBus.$off('openModal', this.openModal);
    this.$eventBus.$off('showPopup', this.showPopup)
  },
  data() {
    return {
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
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>