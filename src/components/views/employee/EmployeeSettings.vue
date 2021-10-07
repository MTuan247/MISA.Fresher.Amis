<template>
    <transition name="fade">
    <div class="modal" v-show="state.isShowSettings" >
        <div class="settings">
            <div class="settings__header">
                <div v-tooltip.bottom="{ content: 'Close', classes: ['btn-tooltip']}" 
                    class="close mi mi-24 mi-close pointer" 
                    @click="state.isShowSettings = false"
                ></div>
            </div>
            <div class="settings__body">
                <div class="settings__area">
                    <v-checkbox
                        v-model="state.isShowSummary"
                        class="v-checkbox"
                        label="Tóm tắt"
                        hide-details
                    ></v-checkbox>
                    <v-checkbox
                        v-model="paging"
                        class="v-checkbox"
                        label="Phân trang"
                        hide-details
                    ></v-checkbox>
                </div>
                <!-- <div class="settings__area">
                    <table cellspacing="0">
                        <thead>
                            <tr>
                                <th>
                                    Tên cột
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <template
                                v-for="column in state.columns.slice(1)"
                            >
                                <tr :key="column.fieldName">
                                    <td>
                                        {{column.title}}
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    
                </div> -->
            </div>
            
      </div>
    </div>
    </transition>
</template>

<script>
    import {EmployeeStore} from './store'
    export default {
        name: 'EmployeeSettings',
        data() {
            return {
                isShow: EmployeeStore.state.isShowSettings
            }
        },
        computed: {
            state: {
                get: function() {
                    return EmployeeStore.state
                },
            },
            paging: {
                get: function() {
                    return EmployeeStore.state.isPaging
                },
                set: function(value) {
                    if (value) {
                        this.$eventBus.$emit('pagingOn')
                    } else {
                        this.$eventBus.$emit('pagingOff')
                    }
                }
            }
        }
    }
</script>

<style scoped>
@import '../../../css/layout/settings.css';
.fade-enter-active, .fade-leave-active {
  transition: all .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>