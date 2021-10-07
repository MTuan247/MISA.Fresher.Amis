<template>
    <div class="header">
        <div class="header-left">
            <div class="logo-site">
                <div class="toggle-icon pointer mi mi-24 mi-24-toggle-icon" @click="collapseContent" ></div>
                <div class="site-icon"></div>
            </div>
            <div class="header-title">
                <div class="mi mi-24 mi-three-stripes pointer"></div>
                <div class="header-text text-branch pointer">Công ty Cổ phần Misa</div>
                <div class="dropdown-icon mi mi-16 mi-16-arrow-down pointer">
                </div>
                <BaseVCombobox 
                    label="Năm"
                    class="year-combobox"
                    v-model="year"
                    v-if="$router.currentRoute.path == '/Tax'"
                    :extraData="years"
                />
            </div>
        </div>
        <div class="account">
            <div class="avatar pointer"></div>
            <div class="username pointer">Nguyễn Minh Tuân</div>
            <div class="icon mi mi-16 mi-16-arrow-down pointer"></div>
        </div>
    </div>
</template>

<script>
    import BaseVCombobox from '../base/BaseVCombobox.vue'
    import {TaxStore} from '../views/tax/store'
    export default {
        /**
         * Layout Header
         */
        name: 'TheHeader',
        components: { BaseVCombobox },
        computed: {
            TaxStore: {
                get: function() {
                    return TaxStore.state
                },
                set: function(value) {
                    TaxStore.state = value
                }
            },

            year: {
                get: function() {
                    return TaxStore.state.year
                },
                set: function(value) {
                    TaxStore.state.year = value
                    if (value.value) {
                        this.$eventBus.$emit('refresh')
                    }
                }
            },

            years: {
                get: function() {
                    let currentYear = new Date().getFullYear()
                    let items = []
                    for (var year = currentYear - 15; year < currentYear + 6; year++) {
                        items.push({
                            text: 'Năm ' + year,
                            value: year
                        })
                    }
                    return items
                }
            }
        },
        watch: {
        },
        methods: {
            /**
             * Collapse lại navbar
             * @author: NMTuan (22/08/2021)
             */
            collapseContent() {
                this.$parent.isContentCollapsed = !this.$parent.isContentCollapsed
            },
        }
    }
</script>

<style lang="css" scoped>
@import '../../css/layout/header.css';
</style>