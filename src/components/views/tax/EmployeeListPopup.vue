<template>
    <div tabindex="-1" 
        @keydown.down.exact.prevent.stop="selectRowByKey(lastSelect + 1)" 
        @keydown.up.exact.prevent.stop="selectRowByKey(lastSelect - 1)" 
        class="employee-popup"
    >
        <BaseSpinner :isLoading="isLoading" />
        <div class="employee-header">
            <div class="flex flex-justify-space-between flex-align-center">
                <div class="text-heading employee-header__content">Chọn nhân viên</div>
                <div
                    class="close mi mi-24 mi-close pointer" 
                    @click="$emit('close')"
                ></div>
            </div>
            
            <BaseInput
                v-model="search"
                placeholder="Tìm kiếm theo mã, tên nhân viên"
                fieldClass="search-field flex flex-grow-0"
                @input.native="() => filterData()"
                @keydown.enter.native.exact="() => filterData(0)"
            >
                <template v-slot:icon >
                    <div class="icon-right vertical-center mi mi-24 mi-24-search"></div>
                </template>
            </BaseInput>
        </div>
        <div class="grid employee-list" ref="Table">
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
                            :class="{'selected' : selectedRows.includes(row.EmployeeId)}" 
                            :key="row.EmployeeId" 
                        >
                            <td class="check-box" :class="columns[0].class" :style="columns[0].style">
                                <label class="checkbox-container">
                                    <input type="checkbox" :checked="selectedRows.includes(row.EmployeeId)" @change="clickCheckBox(index)" >
                                    <span class="checkmark vertical-center"></span>
                                </label>
                            </td>
                            <template  
                                v-for="col in computedColumns.slice(1)" 
                            >
                                <td 
                                    @click.exact="clickRow(index)" 
                                    :key="col.fieldName"
                                    :style="col.style" 
                                    :class="col.class"
                                >
                                    <span class="cell-text">{{ row[col.fieldName] | formatData(col.fieldName) }}</span>
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
        <ThePagination 
            :pageNumber="this.pageNumber"
            :pageSize="this.pageSize"
            :totalPage="this.totalPage"
            :totalRecord="this.totalRecord"
            @switchPage="switchPage($event)"
            @updatePageSize="updatePageSize"
        />
        <div class="employee-footer flex flex-grow-0 flex-justify-end">
            <BaseButton 
                title="Hủy"
                btnClass="btn-seconds btn-employee-control"
                :clickEvent="() => {this.$emit('close')}"
            />
            <BaseButton 
                title="Đồng ý"
                btnClass="btn-employee-control"
                :clickEvent="submit"
            />
        </div>
    </div>
</template>

<script>
    import EmployeeApi from '../../../js/api/employee/employee-api'
    import { formatData } from '../../../js/common/format'
    import ThePagination from '../../layout/ThePagination.vue'
    import BaseInput from '../../base/BaseInput.vue'
    import BaseButton from '../../base/BaseButton.vue'
    import BaseSpinner from '../../base/BaseSpinner.vue'

    import {tableMixin} from '../../../mixins/table-mixin'

    export default {
        name: 'EmployeeListPopup',
        components: { 
            ThePagination,
                BaseInput,
                BaseButton,
                BaseSpinner 
        },
        mixins: [tableMixin],
        props: {
            columns: {},
            selected: {
                default: []
            }
        },
        data() {
            return{
                records : [],
                lastSelect: null,
                pageNumber: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecord: 0,
                search: '',
                delayTimer: null,
                isLoading: false,
                selectedRows: [],
                savedRows: [],
            }
        },
        computed: {
            computedColumns: {
                get: function() {
                    return this.columns
                }
            },

            computedSelected: {
                get: function() {
                    return this.selected;
                },
                set: function(value) {
                    this.$emit('updateSelected', value)
                }
            }
        },
        filters: {
            formatData(value, fieldName) {
                return formatData(value, fieldName)
            }
        },
        created() {
            this.loadData()
            // this.selectedRows = [...this.selected]
        },
        updated() {
            this.$nextTick(() => {
                if (this.records.length > 0) {
                    let td = document.querySelectorAll('.employee-popup .grid.employee-list td');
                    td.forEach((item) => {
                        if (item.firstElementChild.scrollWidth > item.firstElementChild.clientWidth) {
                            item.classList.add("tooltip-container")
                            let tooltip = document.createElement('div')
                            tooltip.classList.add("tooltip-text")
                            tooltip.innerText = item.querySelector(".cell-text").innerText
                            item.appendChild(tooltip)
                            item.addEventListener('mouseenter', () => {
                                if (tooltip.getBoundingClientRect().top > window.screen.height*0.7) {
                                    tooltip.style.top = "-100%"
                                }
                            })
                        }
            
                    })
                }
            })
        },
        methods: {
            /**
             * Hàm lấy dữ liệu
             * @author: NMTuan (22/7/2021)
             */
            loadData() {
                this.records = [];
                this.isLoading = true;
                EmployeeApi.getDataFiltered(this.pageSize, this.pageNumber - 1, this.search.trim(), '', (response) => {
                    this.totalPage = response.data.TotalPage
                    this.totalRecord = response.data.TotalRecord
                    this.records = response.data.Data.filter((item) => {
                        return !this.computedSelected.includes(item.EmployeeId)
                    })
                    this.isLoading = false;
                    if(!response.data) {
                        this.records = [];
                        this.totalPage = 0;
                        this.totalRecord = 0;
                    }
                }, () => {
                    this.isLoading = false;
                })
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
                        {title: 'Nhân bản', action: () => this.openModal(id, 'Add')}
                    ]
                )
            },

            /**
             * update giá trị pageSize
             * @author: NMTuan (20/07/2021)
             */
            updatePageSize(pageSize) {
                this.pageSize = pageSize
                this.pageNumber = 1;
                this.loadData()
            },

            /**
             * Chuyển trang
             * @author: NMTuan (20/07/2021)
             */
            switchPage(number) {
                this.pageNumber = number
                this.loadData()
            },

            /**
             * Hàm delay filter dữ liệu
             * @author: NMTuan (29/08/2021)
             */
            filterData(delay = 1000) {
                clearTimeout(this.delayTimer)
                this.delayTimer = setTimeout(() => {
                    this.pageNumber = 1;
                    this.loadData()
                }, delay)
            },

            /**
             * Hàm sumit popup
             * @author: NMTuan (20/09/2021)
             */
            submit() {
                EmployeeApi.getByIds(this.selectedRows, (response) => {
                    this.$emit('input', response)
                })
                this.computedSelected = this.computedSelected.concat(this.selectedRows)
            },
        }
    }
</script>

<style scoped>
@import '../../../css/views/tax/employee-popup.css';
</style>