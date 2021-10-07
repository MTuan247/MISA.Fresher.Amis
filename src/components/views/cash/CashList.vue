<template>
    <div class="grid" ref="Table"
        tabindex="-1"
        @keydown.down.prevent="selectRowByKey(lastSelect + 1)"
        @keydown.up.prevent="selectRowByKey(lastSelect - 1)"
    >
        <div class="no-content" v-if="!$parent.isLoading && !records.length" >
        </div>
        <table cellspacing=0>
            <thead>
                <tr>
                    <th class="check-box" :class="columns[0].class" :style="columns[0].style">
                        <label class="checkbox-container">
                            <input :checked="!$parent.isLoading && selectedRows.length == records.length" @change="selectAll" type="checkbox" >
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
                        class="grid-master"
                        @click.ctrl.exact="ctrlClickRow(index)" 
                        @click.shift.exact.prevent="shiftClickRow(index)"
                        @click.right.exact.prevent="rightClickRow(index, $event)"
                        :class="{'selected' : row['isSelected']}" 
                        :key="row.EmployeeId" 
                    >
                        <td class="check-box" :class="columns[0].class" :style="columns[0].style">
                            <!-- <div class="custom-checkbox">
                            </div>
                            <input type="checkbox" @change="clickCheckBox(index)" name="" id=""> -->
                            <label class="checkbox-container">
                                <input type="checkbox" :checked="row['isSelected']" @change="clickCheckBox(index)" >
                                <span class="checkmark vertical-center"></span>
                            </label>
                        </td>
                        <template  
                            v-for="col in computedColumns.slice(1)" 
                        >
                            <td 
                                @dblclick="dbclickRow(row.EmployeeId, $data)"
                                @click.exact="clickRow(index)" 
                                :key="col.fieldName"
                                :style="col.style" 
                                :class="col.class"
                            >
                                <span class="cell-text">{{ row[col.fieldName] | formatData(col.fieldName) }}</span>
                                <span class="tooltip-text">{{ row[col.fieldName] | formatData(col.fieldName) }}</span>
                            </td>
                        </template>
                        <td :class="columns[columns.length - 1].class" :style="columns[columns.length - 1].style" class="flex flex-align-center flex-justify-space-evenly">
                            <div 
                                @click="openModal(row.EmployeeId)" 
                                class="mi mi-16 mi-pen pointer"
                                v-tooltip.bottom="{content: 'Sửa', classes: ['tooltip-base'], delay: { show: 300 }}"
                            ></div>
                            <div 
                                @click="deleteRow(row.EmployeeId, row.EmployeeCode)" 
                                class="mi mi-16 mi-trash pointer"
                                v-tooltip.bottom="{content: 'Xóa', classes: ['tooltip-base'], delay: { show: 300 }}"
                            ></div>
                            <div 
                                @click="openModal(row.EmployeeId, 'Add')" 
                                class="mi-16 mi-copy pointer"
                                v-tooltip.bottom="{content: 'Nhân bản', classes: ['tooltip-base'], delay: { show: 300 }}"
                            ></div>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { formatData } from '../../../js/common/format'
    import EmployeeApi from '../../../js/api/employee/employee-api'
    import {CashStore} from './store'

    export default {
        name: 'EmployeeList',
        props: ['columns', 'rows', 'selectedRows'],

        data() {
            return{
                records : [],
                isLoading: true,
                lastSelect: null,
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
            /**
             * Danh sách phòng ban
             */
            departmentItems() {
                return CashStore.state.department
            },

            /**
             * Lấy và set giá trị phòng ban
             */
            department: {
                get: function() {
                    return (index) => {
                        return {
                            text: this.records[index].DepartmentName,
                            value: this.records[index].DepartmentId,
                        }
                    }
                },
                set: function(value) {
                    let text = value.$event.text;
                    let val = value.$event.value;
                    text = text ? text : "";
                    val = val ? val : null;
                    this.records[value.index].DepartmentName = text;
                    this.records[value.index].DepartmentId = val;
                    this.$parent.saveChangedRow(this.records[value.index])
                }
                
            }

        },

        components: {
        },

        watch: {
            rows: function() {
                // this.records = [...this.rows]
                this.records = this.rows;
                this.records.forEach(record => {
                    let isSelected = false;
                    if (this.selectedRows.includes(record.EmployeeId)) isSelected = true;
                    record['isSelected'] = isSelected;
                })
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

            selectedRows: function() {
                this.records.forEach((record, index) => {
                    let isSelected = false;
                    if (this.selectedRows.includes(record.EmployeeId)) isSelected = true;
                    record['isSelected'] = isSelected;
                    Vue.set(this.records, index, record);
                })
            },
        },
        
        filters: {
            formatData: function(value, fieldName) {
                return formatData(value, fieldName)
            }
        },

        created() {
        },

        mounted() {
        },
        methods: {

            /** 
             * Hàm xử lý checkbox
             * Author: NMTuan (20/07/2021)
             * @param {int} index 
             */
            checkBox(index) {
                let row = this.records[index]
                this.$eventBus.$emit('multipleSelectRow', row.EmployeeId)
            },

            /** 
             * Hàm xử lý click checkbox
             * Author: NMTuan (20/07/2021)
             * @param {int} index 
             */
            clickCheckBox(index) {
                let row = this.records[index]
                if (!row.isSelected) {
                    this.lastSelect = index;
                } else {
                    this.lastSelect = null;
                }
                this.$eventBus.$emit('multipleSelectRow', row.EmployeeId)
            },

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
             * Hàm xử lý ctrl-click vào row
             * @author: NMTuan (09/08/2021)
             */
            ctrlClickRow(index) {
                this.clickCheckBox(index)
            },

            /**
             * Hàm chọn 1 dòng
             * @author: NMTuan (28/08/2021)
             */
            clickRow(index) {
                let row = this.records[index]
                this.lastSelect = index;
                this.$eventBus.$emit('selectRow', row.EmployeeId)
            },

            /**
             * Hàm chuột phải vào dòng
             * @author: NMTuan (31/08/2021)
             */
            rightClickRow(index, evt) {
                this.clickRow(index)
                let row = this.records[index]
                this.contextMenu(evt, row.EmployeeId, row.EmployeeCode)
            },

            /**
             * Hàm chọn 1 dòng bằng phím
             * @author: NMTuan (30/08/2021)
             */
            selectRowByKey(index) {
                const rowHeight = 42;
                let scrollTop = this.$refs.Table.scrollTop
                let clientHeight = this.$refs.Table.clientHeight;
                let scrollBottom = scrollTop + clientHeight;
                if (index < 0) {
                    index = this.rows.length -1;
                } else if (index == this.rows.length) {
                    index = 0;
                }
                let offsetTop = (index - 2) * rowHeight;
                let offsetBottom = (index + 4) * rowHeight;
                if (offsetTop < scrollTop) {
                    // this.$refs.Table.scrollTop = offsetTop;
                    this.$refs.Table.scroll({
                        top: offsetTop,
                        behavior: 'smooth'
                    })
                }
                if (offsetBottom > scrollBottom) {
                    // this.$refs.Table.scrollTop = offsetBottom - clientHeight;
                    this.$refs.Table.scroll({
                        top: offsetBottom - clientHeight,
                        behavior: 'smooth'
                    })
                }
                this.clickRow(index)
            },

            /**
             * Hàm xử lý shift-click vào row
             * @author: NMTuan (28/08/2021)
             */
            shiftClickRow(index) {
                document.getSelection().removeAllRanges();
                this.$eventBus.$emit('clearSelectedRow')
                if(this.lastSelect != null) {
                    if (this.lastSelect <= index) {
                        for (let i = this.lastSelect; i <= index; i++) {
                            this.checkBox(i)
                        }
                    } else {
                        for (let i = index; i <= this.lastSelect; i++) {
                            this.checkBox(i)
                        }
                    }
                    
                }
            },

            /**
             * Hàm xóa bản ghi
             * @author: NMTuan (13/08/2021)
             */
            deleteRow(id, code) {
                let popup = {
                    type: 'warning',
                    message : `Bạn có thực sự muốn xóa Nhân viên <${code}> không?`,
                    isShow: true,
                    confirm: 'Có',
                    subConfirm: '',
                    cancel: 'Không',
                    callback: () => {
                        EmployeeApi.delete(id, () => {
                            this.$eventBus.$emit('loadData')
                        })
                    },
                }
                this.$eventBus.$emit('showPopup', popup);
            },

            /**
             * Hàm chọn tất cả các dòng
             * @author: NMTuan (30/08/2021)
             */
            selectAll() {
                if (this.selectedRows.length == this.records.length) {
                    this.$eventBus.$emit('clearSelectedRow')
                } else {
                    this.$parent.selectAll()
                }
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
             * Cập nhật data chỉnh sửa từ bảng
             * @author: NMTuan (30/08/2021)
             */
            updateData(row, evt, fieldName) {
                let value = null;
                if (fieldName == 'DateOfBirth') {
                    value = evt
                } else {
                    value = evt.target.innerText
                }
                row[fieldName] = value;
                this.$parent.saveChangedRow(row)
            }

        }
    }
</script>

<style scoped>
@import '../../../css/base/grid.css';
</style>