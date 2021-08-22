<template>
  <div 
    class="btn-base" 
    ref="Button"
    :tabindex="tabindex" 
    :class="btnClass" 
    :id="id" 
    @click="handleEvent" 
    @keydown.enter="handleEvent"
    v-tooltip.bottom="{content: hoverTitle, classes: ['btn-tooltip', tooltipClass], delay: { show: 300 }}"
  >
    <div v-if="title" >{{title}}</div>
  </div>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    id: {},
    btnClass: {},
    icon: {},
    title: {},
    clickEvent: {
      type: Function,
      default: function() {}
    },
    isDisabled: {
      default: false
    },
    hoverTitle: {
      default: ""
    },
    tabindex: {
      default: "0"
    },
    tooltipClass: {
      default: ""
    }
  },
  computed: {
  },
  methods: {
    /**
     *Hàm xử lý event truyền vào
     @author: NMTuan
     */
    handleEvent() {
      if (!this.isDisabled) {
        this.clickEvent()
      }
    }
  }
};
</script>

<style scoped>
@import "../../css/base/button.css";

</style>