<template>
  <div data-app=true id="app">
    <div>
      <TheHeader :key="$router.currentRoute.path" />
      <div class="main">
        <TheNavbar :isCollapsed="isContentCollapsed" />
        <router-view :isContentCollapse="isContentCollapsed" />
      </div>
    </div>
  </div>
</template>

<script>
import TheHeader from "./components/layout/TheHeader.vue";
import TheNavbar from "./components/layout/TheNavbar.vue";

export default {
  name: 'App',
  components: {
    TheHeader, TheNavbar,
  },
  data() {
    return {
      isContentCollapsed: false
    }
  }
}
</script>

<style>
@import '../lib/fontawesome-5.15.1/css/all.min.css';
@import '../lib/fontawesome-pro-5.0.13/css/all.css';
@import './css/main.css';
@import './css/common/common.css';
@import './css/common/text.css';
@import './css/common/icon.css';
@import './css/common/tooltip.css';
@import './css/base/vradio.css';
@import './css/base/vtab.css';
@import './css/base/vmenu.css';
@import './css/base/vcheckbox.css';
@import './css/base/checkbox.css';
</style>
