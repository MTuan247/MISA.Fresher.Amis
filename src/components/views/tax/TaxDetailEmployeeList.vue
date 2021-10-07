<template>
    <div class="tax-detail__table">
        <EmployeeListPopup 
            :columns="TaxStore.employeeColumns"
            :selected="gridEmployeeIds"
            @close="employeePopup = false"
            @input="updateDetailrecords"
            @updateSelected="(value) => {this.gridEmployeeIds = value}"
            v-if="employeePopup"
        />
        <div class="grid-header flex">
            <div class="grid-header-left flex">
                <div class="grid-header__content">Thông tin nhân viên</div>
                <BaseInput
                    placeholder="Tìm kiếm nhân viên..."
                    fieldClass="search-field flex flex-grow-0"
                    @input.native="() => filter()"
                    v-model="search"
                >
                    <template v-slot:icon >
                        <div class="icon-right vertical-center mi mi-24 mi-24-search"></div>
                    </template>
                </BaseInput>
            </div>
            <div class="grid-header-right flex">
                <BaseButton
                    btnClass="add btn-grid-control btn-seconds mi-24"
                    hoverTitle="Thêm"
                    :clickEvent="() => {this.employeePopup = true}"
                >
                    <template v-slot:icon>
                        <i class="fal fa-plus-circle"></i>
                    </template>
                </BaseButton>

                <BaseButton
                    btnClass="delete btn-grid-control btn-seconds mi-24"
                    hoverTitle="Xóa"
                    :clickEvent="() => deleteRows()"
                    :isDisabled="selectedRows.length == 0"
                >
                    <template v-slot:icon>
                        <i class="fal fa-trash-alt"></i>
                    </template>
                </BaseButton>
            </div>
        </div>
        <div class="grid tax-detail-employee-list">
            <div class="no-content" v-show="!records.length" >
                <div class="no-content-img"></div>
                <div class="no-content-msg">Không có dữ liệu</div>
            </div>
            <table cellspacing="0">
                <thead>
                    <tr>
                        <th style="width: 40px; left: 0;" class="sticky check-box">
                            <label class="checkbox-container">
                                <input @change="selectAll" :checked="isAllSelected()" type="checkbox" >
                                <span class="checkmark vertical-center"></span>
                            </label>
                        </th>
                        <th style="width: 40px;" v-tooltip="{content: 'Số thứ tự'}" >STT</th>
                        <th style="width: 120px;">Mã nhân viên</th>
                        <th style="width: 180px;">Tên nhân viên</th>
                        <th class="text-align-right" style="width: 120px;">Tiền lương tháng</th>
                        <th class="text-align-right" v-tooltip="{content: 'Tiền bảo hiểm', classes: ['tooltip-base']}" style="width: 120px;">Tiền BHXH</th>
                        <th class="text-align-right" style="width: 150px;">Thu nhập tính thuế</th>
                        <th class="text-align-right" style="width: 120px;">Thuế</th>
                        <th class="sticky" style="width: 60px; right: 0;"></th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(row, index) in records">
                        <tr 
                            draggable="true"
                            @dragstart="dragstart(index)"
                            @dragover="dragover($event)"
                            @drop="drop(index)"
                            @click.ctrl.exact="ctrlClickRow(index)" 
                            @click.shift.exact.prevent="shiftClickRow(index)" 
                            :key="row.EmployeeCode"
                            v-show="!row.isHidden"
                        >
                            <td style="width: 40px; left: 0;" class="sticky check-box">
                                <label class="checkbox-container">
                                    <input :checked="selectedRows.includes(row.EmployeeId)" @change="clickCheckBox(index)" type="checkbox" >
                                    <span class="checkmark vertical-center"></span>
                                </label>
                            </td>
                            <td class="text-align-center" @click.exact="clickRow(index)">{{index + 1}}</td>
                            <td @click.exact="clickRow(index)">{{row.EmployeeCode}}</td>
                            <td @click.exact="clickRow(index)">{{row.EmployeeName}}</td>
                            <td>
                                <BaseInput 
                                    ref="Salary"
                                    :value="row.Salary | formatMoney"
                                    :inputMaxlength="15"
                                    :required="true"
                                    :isLabel="false"
                                    inputLabel="Tiền lương"
                                    inputType="number"
                                    textAlign="right"
                                    tabindex="6"
                                    @input="($event) => {
                                        row.Salary = $event;
                                        calculateTax(row)
                                    }"
                                />
                            </td>
                            <td>
                                <BaseInput 
                                    ref="Insurance"
                                    :value="row.Insurance | formatMoney"
                                    inputType="number"
                                    :required="true"
                                    :isLabel="false"
                                    inputLabel="Tiền bảo hiểm"
                                    textAlign="right"
                                    tabindex="6"
                                    @input="($event) => {
                                        row.Insurance = $event;
                                        calculateTax(row)
                                    }"
                                />
                            </td>
                            <td @click.exact="clickRow(index)" class="text-align-right">{{row.TaxableIncome | formatMoney}}</td>
                            <td @click.exact="clickRow(index)" class="text-align-right">{{row.Tax | formatMoney}}</td>
                            <td style="right: 0" class="sticky" >
                                <div 
                                    @click="deleteRow(row.EmployeeId)"
                                    style="margin: auto"
                                    class="mi mi-16 mi-trash pointer btn-row-control"
                                    v-tooltip.bottom="{content: 'Xóa', classes: ['tooltip-base'], delay: { show: 300 }}"
                                ></div>
                            </td>
                        </tr>
                    </template>
                </tbody>
                <!-- <tfoot>
                    <tr>
                        <td style="width: 40px;"></td>
                        <td style="width: 40px;"></td>
                        <td style="width: 120px;"></td>
                        <td style="width: 200px;"></td>
                        <td style="width: 150px;" class="text-align-right">{{calculateSummary('Salary') | formatMoney}}</td>
                        <td style="width: 150px;" class="text-align-right">{{calculateSummary('Insurance') | formatMoney}}</td>
                        <td style="width: 150px;" class="text-align-right">{{calculateSummary('TaxableIncome') | formatMoney}}</td>
                        <td style="width: 150px;" class="text-align-right">{{calculateSummary('Tax') | formatMoney}}</td>
                        <td style="width: 200px;"></td>
                        <td style="width: 60px;"></td>
                    </tr>
                </tfoot> -->
            </table>
        </div>
    </div>
</template>

<script>
    import BaseButton from '@/components/base/BaseButton'
    import BaseInput from '@/components/base/BaseInput'
    import { formatMoney, removeAccents } from '../../../js/common/format'
    import {TaxStore} from './store'
    import EmployeeListPopup from './EmployeeListPopup.vue'
    import { tableMixin } from '../../../mixins/table-mixin'

    export default {
        name: 'TaxDetailEmployeeList',
        mixins: [tableMixin],
        data() {
            return {
                records: [],
                gridEmployeeIds: [],
                employeePopup: false,
                selectedRows: [],
                onDrag: null,
                search: '',
            }
        },
        components: {
            BaseButton,EmployeeListPopup,BaseInput
        },
        computed: {
            TaxStore() {
                return TaxStore.state;
            }
        },
        filters: {
            /**
             * Filter giá trị tiền
             * @author: NMTuan (20/09/2021)
             */
            formatMoney: function(value) {
                return formatMoney(value)
            }
        },
        created() {
            this.$eventBus.$on('setRecordsDetailEmployeeList', (records) => {
                this.records = records
                records.forEach(item => {
                    this.gridEmployeeIds.push(item['EmployeeId'])
                })
            });
        },
        updated() {
        },
        methods: {
            /**
             * Hàm tính toán thuế
             * @author: NMTuan (20/09/2021)
             */
            calculateTax(row) {
                let salary = parseInt((row.Salary + '').replaceAll('.', ''))
                let insurance = parseInt((row.Insurance + '').replaceAll('.', ''))
                let taxableIncome = salary - insurance - 11000000
                row.TaxableIncome = taxableIncome > 0 ? taxableIncome : 0
                if (row.TaxableIncome < 5000000) {
                    row.Tax = 0.05 * row.TaxableIncome
                } else if (row.TaxableIncome < 10000000) {
                    row.Tax = 0.1 * row.TaxableIncome - 250000
                } else if (row.TaxableIncome < 18000000) {
                    row.Tax = 0.15 * row.TaxableIncome - 750000
                } else if (row.TaxableIncome < 32000000) {
                    row.Tax = 0.2 * row.TaxableIncome - 1650000
                } else if (row.TaxableIncome < 52000000) {
                    row.Tax = 0.25 * row.TaxableIncome - 3250000
                } else if (row.TaxableIncome < 80000000) {
                    row.Tax = 0.3 * row.TaxableIncome - 5850000
                } else {
                    row.Tax = 0.35 * row.TaxableIncome - 9850000
                }
                row.Tax = Math.round(row.Tax)
                this.$forceUpdate()
            },

            /**
             * Hàm tính tổng các cột
             * @author: NMTuan (22/09/2021)
             */
            calculateSummary(fieldName) {
                let summary = this.records.reduce((prev, current) => {
                    let currentValue = parseInt((current[fieldName] + '').replaceAll('.',''))
                    return prev + currentValue
                }, 0)
                return summary
            },

            /**
             * Hàm cập nhật lại các bản ghi trong bảng
             * @author: NMTuan (22/09/2021)
             */
            updateDetailrecords(rows) {
                this.records = this.records.filter((item) => {
                    return this.gridEmployeeIds.includes(item.EmployeeId)
                })
                rows.forEach(row => {
                    if (!this.records.find((item) => {
                        return item.EmployeeId == row.EmployeeId
                    })) {
                        row.Salary = 0;
                        row.Insurance = 0;
                        row.TaxableIncome = 0;
                        row.Tax = 0;
                        this.records.push(row)
                    }
                })
                this.employeePopup = false
            },

            /**
             * Hàm xóa 1 hàng
             * @author: NMTuan (22/09/2021)
             */
            deleteRow(id) {
                this.records = this.records.filter((item) => {
                    return item.EmployeeId != id
                })
                this.gridEmployeeIds = this.gridEmployeeIds.filter((item) => {
                    return item != id
                })
            },

            /**
             * Hàm xóa các hàng đã chọn
             * @author: NMTuan (22/09/2021)
             */
            deleteRows() {
                this.records = this.records.filter((item) => {
                    return !this.selectedRows.includes(item.EmployeeId)
                })
                this.gridEmployeeIds = this.gridEmployeeIds.filter((item) => {
                    return !this.selectedRows.includes(item)
                })
            },

            /**
             * Hàm chạy khi bắt đầu drag 1 hàng
             * @author: NMTuan (22/09/2021)
             */
            dragstart(index) {
                this.onDrag = index
            },

            /**
             * Hàm chạy khi dragover trên 1 hàng khác
             * @author: NMTuan (22/09/2021)
             */
            dragover(e) {
                e.preventDefault()
            },

            /**
             * Hàm thả, drop trên hàng
             * @author: NMTuan (22/09/2021)
             */
            drop(index) {
                let dragging = this.records[this.onDrag]
                this.records.splice(this.onDrag, 1)
                this.records.splice(index, 0, dragging)
            },

            /**
             * Hàm filter lại dữ liệu
             * @author: NMTUan (25/09/2021)
             */
            filter() {
                this.records.forEach(item => {
                    if (!item.EmployeeCode.includes(this.search) && !removeAccents(item.EmployeeName).toLowerCase().includes(this.search)) {
                        item.isHidden = true
                    } else {
                        item.isHidden = false
                    }
                })
                this.$forceUpdate()
            }
        }
    }
</script>

<style scoped>

</style>