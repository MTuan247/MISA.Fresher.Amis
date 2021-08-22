<template>
    <div class="grid">
        <table cellspacing=0>
            <thead>
                <tr>
                    <th v-for="col in columns" :class="col.class" :key="col.fieldName" :style="col.style" >
                        {{col.title}}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    @click.ctrl="ctrlClickRow(index)" 
                    :employeeId="row.EmployeeId" 
                    :class="{'selected' : row['isSelected']}" 
                    :key="row.EmployeeId"
                    v-for="(row, index) in records" 
                >
                    <td class="check-box" :class="columns[0].class" :style="columns[0].style">
                        <div class="custom-checkbox" :class="{'custom-checkbox--selected' : row['isSelected']}">
                            <i class="fa fa-check" aria-hidden="true"></i>
                        </div>
                        <input type="checkbox" @change="checkBox(index)" name="" id="">
                    </td>
                    <td 
                        @dblclick="dbclickRow(row.EmployeeId)" 
                        v-for="col in computedColumns.slice(1)" 
                        :key="col.fieldName" 
                        :style="col.style" 
                        :class="col.class"
                        :title="row[col.fieldName] | formatData(col.fieldName)"
                    >
                        {{ row[col.fieldName] | formatData(col.fieldName) }}
                    </td>
                    <td :class="columns[columns.length - 1].class" :style="columns[columns.length - 1].style" class="flex flex-center v-context-menu">
                        <div @click="openModal(row.EmployeeId)" style="color: #0075c0; font-size: 13px; font-weight: 600;" class="pointer">
                            Sửa
                        </div>
                        <v-menu offset-y offset-x content-class="v-context-menu" >
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                    color="primary"
                                    v-bind="attrs"
                                    v-on="on"
                                >
                                    <i class="fa fa-caret-down" />
                                </v-btn>
                            </template>

                            <v-list class="v-menu__list">
                                <v-list-item class="pointer" @click="openModal(row.EmployeeId, 'Add')">
                                    <v-list-item-title>Nhân bản</v-list-item-title>
                                </v-list-item>
                                <v-list-item class="pointer" @click="deleteRow(row.EmployeeId, row.EmployeeCode)">
                                    <v-list-item-title>Xóa</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import Vue from 'vue'
    import { formatData} from '../../js/common/format'
    import EmployeeApi from '../../js/api/employee/EmployeeApi'

    export default {
        name: 'BaseGridTable',
        props: ['columns', 'rows', 'selectedRows'],

        data() {
            return{
                records : [],
                isLoading: true

            }
        },

        computed: {
            computedColumns: {
                get: function() {
                    let cols = [...this.columns]
                    cols.pop()
                    return cols
                }
            }
        },

        components: {
        },

        watch: {
            rows: function() {
                this.records = [...this.rows]
                this.records.forEach(record => {
                    let isSelected = false;
                    if (this.selectedRows.includes(record.EmployeeId)) isSelected = true;
                    record['isSelected'] = isSelected;
                })
            }
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
             * Hàm xử lý click checkbox
             * Author: NMTuan (20/07/2021)
             * @param {int} index 
             */
            checkBox(index) {
                let row = this.records[index]
                row.isSelected = !row.isSelected
                Vue.set(this.records, index, row)
                this.$emit('updateSelectedRows', row.EmployeeId)
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
                // this.$emit('openModal', id)
                this.$eventBus.$emit('openModal', id, state);
            },
            
            /**
             * Hàm xử lý ctrl-click vào row
             * @author: NMTuan (09/08/2021)
             */
            ctrlClickRow(index) {
                this.checkBox(index)
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

        }
    }
</script>

<style scoped>
@import '../../css/base/grid.css';
</style>