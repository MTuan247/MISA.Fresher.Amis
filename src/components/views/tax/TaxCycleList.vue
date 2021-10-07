<template>
    <div class="grid" ref="Table"
        tabindex="-1"
        @keydown.down.prevent="selectRowByKey(lastSelect + 1)"
        @keydown.up.prevent="selectRowByKey(lastSelect - 1)"
    >
        <div class="no-content" v-show="!$parent.isLoading && !records.length" >
            <div class="no-content-img"></div>
            <div class="no-content-msg">Không có dữ liệu</div>
        </div>
        <div class="grid-wrapper">
            <table cellspacing=0>
                <thead>
                    <tr>
                        <th class="check-box" :class="columns[0].class" :style="columns[0].style">
                            <label class="checkbox-container">
                                <input :checked="isAllSelected()" @change="selectAll" type="checkbox" >
                                <span class="checkmark vertical-center"></span>
                            </label>
                        </th>
                        <th v-for="col in columns.slice(1)" :class="col.class" :key="col.fieldName" :style="col.style" v-tooltip="{content: col.tooltip}" >
                            {{col.title}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(row, index) in records">
                        <tr 
                            @click.ctrl.exact="ctrlClickRow(index)" 
                            @click.shift.exact.prevent="shiftClickRow(index)"
                            @click.right.exact.prevent="rightClickRow(index, $event)"
                            :class="{'selected' : selectedRows.includes(row[idName])}" 
                            :key="row[idName]" 
                        >
                            <td class="check-box" :class="columns[0].class" :style="columns[0].style">
                                <label class="checkbox-container">
                                    <input type="checkbox" :checked="selectedRows.includes(row[idName])" @change="clickCheckBox(index)" >
                                    <span class="checkmark vertical-center"></span>
                                </label>
                            </td>
                            <template  
                                v-for="col in computedColumns.slice(1)" 
                            >
                                <td 
                                    @dblclick="dbclickRow(row[idName])"
                                    @click.exact="clickRow(index, row[idName])" 
                                    :key="col.fieldName"
                                    :style="col.style" 
                                    :class="col.class"
                                >
                                    <span class="cell-text">{{ row[col.fieldName] | formatData(col.fieldName, col.type) }}</span>
                                    <span class="tooltip-text">{{ row[col.fieldName] | formatData(col.fieldName, col.type) }}</span>
                                </td>
                            </template>
                            <td :class="columns[columns.length - 1].class" :style="columns[columns.length - 1].style" class="flex flex-justify-center flex-align-center">
                                <div 
                                    @click="openModal(row[idName])" 
                                    class="edit pointer btn-row-control"
                                    v-tooltip.bottom="{content: 'Sửa', classes: ['tooltip-base'], delay: { show: 300 }}"
                                >
                                    <i class="fal fa-edit"></i>
                                </div>
                                <div 
                                    @click="deleteRow(row[idName], row[codeName])" 
                                    class="delete pointer btn-row-control"
                                    v-tooltip.bottom="{content: 'Xóa', classes: ['tooltip-base'], delay: { show: 300 }}"
                                >
                                    <i class="fal fa-trash-alt"></i>
                                </div>
                                <!-- <div 
                                    @click="openModal(row[idName], 'Add')" 
                                    class="mi-16 mi-copy pointer btn-row-control"
                                    v-tooltip.bottom="{content: 'Nhân bản', classes: ['tooltip-base'], delay: { show: 300 }}"
                                ></div> -->
                            </td>
                        </tr>
                    </template>
                </tbody>
                <tfoot v-show="false">
                    <tr>
                        <template v-for="col in columns">
                            <td class="text-align-right" v-if="col.type == 'Number' | col.type == 'Money'" :key="col.fieldName">
                            {{calculateSummary(col.fieldName) | formatMoney}}
                            </td>
                            <td v-else :key="col.fieldName"></td>
                        </template>
                    </tr>
                </tfoot>
            </table>
        </div>
        <table class="table-summary" cellspacing="0" v-show="records.length">
            <tr>
                <template v-for="col in columns">
                    <td class="text-align-right" 
                        v-if="col.type == 'Number' | col.type == 'Money'" 
                        :key="col.fieldName"
                        :style="col.style" 
                        :class="col.class" 
                    >
                        {{calculateSummary(col.fieldName) | formatMoney}}
                    </td>
                    <td v-else 
                        :style="col.style" 
                        :class="col.class" 
                        :key="col.fieldName"
                    ></td>
                </template>
            </tr>
        </table>
    </div>
</template>

<script>
    import { formatData } from '../../../js/common/format'
    import TaxApi from '../../../js/api/tax/tax-api'
    import {tableMixin} from '../../../mixins/table-mixin'

    export default {
        name: 'TaxList',
        props: ['columns', 'rows', 'selected'],
        mixins: [tableMixin],
        data() {
            return{
                records : [],
                isLoading: true,
                lastSelect: null,
                entityName: 'Tax'
            }
        },

        computed: {
            // Array cột sau khi xử lý
            computedColumns: {
                get: function() {
                    let cols = [...this.columns]
                    cols.pop()
                    return cols
                }
            },

            selectedRows: {
                get: function() {
                    return this.selected
                },

                set: function(value) {
                    this.$emit('updateSelected', value)
                }
            }

        },

        components: {
        },

        watch: {
            rows: function() {
                this.records = this.rows;
                this.$nextTick(() => {
                    if (this.records.length > 0) {
                        let td = document.querySelectorAll('.grid .grid-master td');
                        td.forEach((item) => {
                            if (item.firstElementChild.scrollWidth > item.firstElementChild.clientWidth) {
                                item.classList.add("tooltip-container")
                            }
                        })
                    }
                })
                
            },
        },
        
        filters: {
            formatData: function(value, fieldName, type) {
                return formatData(value, fieldName, type)
            }
        },

        created() {
        },

        mounted() {
        },

        updated() {
        },

        methods: {

            /**
             * Hàm xử lý dblclick vào hàng
             * @author: NMTuan (20/07/2021)
             */
            dbclickRow(id) {
                this.openModal(id)
            },

            /**
             * Hàm mở form
             * @author: NMTuan (20/07/2021)
             */
            openModal(id, state = 'Update') {
                this.$eventBus.$emit('openModal', id, state);
            },

            /**
             * Hàm xóa bản ghi
             * @author: NMTuan (13/08/2021)
             */
            deleteRow(id, code) {
                let popup = {
                    type: 'alarm',
                    message : `Bạn có thực sự muốn xóa Kỳ thuế&nbsp;<span style="font-weight: 600">${code}</span>&nbsp;không?`,
                    isShow: true,
                    confirm: 'Xóa',
                    subConfirm: '',
                    cancel: 'Không',
                    callback: () => {
                        TaxApi.delete(id, () => {
                            this.$eventBus.$emit('loadData')
                        })
                    },
                }
                this.$eventBus.$emit('showPopup', popup);
            },

            /**
             * Hàm hiện context menu
             * @author: NMTuan (31/08/2021)
             */
            contextMenu(evt, id, code) {
                this.$eventBus.$emit(
                    'showContext', 
                    evt.pageX, 
                    evt.pageY, 
                    [
                        {title: 'Sửa', action: () => this.openModal(id) },
                        {title: 'Xóa', action: () => this.deleteRow(id, code)},
                        // {title: 'Nhân bản', action: () => this.openModal(id, 'Add')}
                    ]
                )
            },

            /**
             * Hàm click vào 1 dòng
             * @author: NMTuan (28/08/2021)
             */
            clickRow(index, id) {
                this.selectOne(index)
                this.$emit('detailRow', id)
            }

        }
    }
</script>

<style scoped>
@import '../../../css/base/grid.css';
</style>