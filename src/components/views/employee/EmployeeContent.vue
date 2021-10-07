<template>
    <div class="content" :class="{'content--collapsed' : isContentCollapse}">
        <!-- <ClipLoader :loading="isLoading" size="60px" /> -->
        <BaseSpinner :isLoading="isLoading" />
        <div class="content-header">
            <div class="content-title">Nhân viên</div>
            <BaseButton
                id="add-employee"
                btnClass="btn-icon"
                title="Thêm mới"
                :isDisabled="isLoading"
                :clickEvent="() => openModal('')"
            />
        </div>
        <div class="main-content flex flex-column">
            <div class="filter-bar flex flex-justify-space-between flex-grow-0">
                <div class="filter-bar-left flex flex-align-center">
                    <BaseInput
                        v-model="search"
                        placeholder="Tìm kiếm theo mã, tên nhân viên"
                        fieldClass="search-field flex"
                        @input.native="() => filterData()"
                        @keydown.enter.native.exact="() => filterData(0)"
                    >
                        <template v-slot:icon >
                            <div class="search-icon vertical-center mi mi-24 mi-24-search"></div>
                        </template>
                    </BaseInput>
                </div>
                <div class="filter-bar-right flex flex-align-center">

                    <!-- <BaseButton 
                        btnClass="refresh btn-seconds btn-action mi mi-24 mi-pen"
                        :isDisabled="isLoading"
                        :clickEvent="updateMultiple"
                        hoverTitle="Sửa"
                    /> -->

                    <BaseButton
                        btnClass="delete btn-seconds btn-action mi-24"
                        :isDisabled="isLoading"
                        :clickEvent="() => this.delete()"
                        hoverTitle="Xóa"
                    >
                        <template v-slot:icon>
                            <i class="fal fa-trash-alt"></i>
                        </template>
                    </BaseButton>

                    <BaseButton 
                        btnClass="refresh btn-seconds btn-action mi-24"
                        :isDisabled="isLoading"
                        :clickEvent="refresh"
                        hoverTitle="Lấy lại dữ liệu"
                        tooltipClass="refresh-tooltip"
                    >
                        <template v-slot:icon>
                            <i class="fal fa-redo"></i>
                        </template>
                    </BaseButton>

                    <!-- <BaseButton 
                        btnClass="btn-seconds btn-action mi mi-24 mi-settings"
                        :isDisabled="isLoading"
                        :clickEvent="() => {EmployeeStore.isShowSettings = true}"
                        hoverTitle="Cài đặt"
                    /> -->
                </div>
            </div>
            <EmployeeList 
                :columns="EmployeeStore.columns"
                :rows="this.rows"
                :selected="selectedRows"
                @openModal='openModal'
                @updateSelected="(value) => {this.selectedRows = value}"
            />
            <div class="summary"
                v-show="EmployeeStore.isShowSummary"
            >
                Số cột: <span class="notosans-bold">{{EmployeeStore.columns.length}}</span>
            </div>
            <ThePagination 
                v-show="EmployeeStore.isPaging"
                :pageNumber="this.pageNumber"
                :pageSize="this.pageSize"
                :totalPage="this.totalPage"
                :totalRecord="this.totalRecord"
                @switchPage="switchPage($event)"
                @updatePageSize="updatePageSize"
            />
        </div>
        
    </div>
</template>

<script>
    import BaseButton from '../../base/BaseButton.vue';
    import EmployeeList from './EmployeeList.vue' 
    import ThePagination from '../../layout/ThePagination.vue'

    import EmployeeApi from '../../../js/api/employee/employee-api'

    import {EmployeeStore} from './store'

    import BaseSpinner from '../../base/BaseSpinner.vue'
    import BaseInput from '../../base/BaseInput.vue';

    export default {
        name: "TheContent",
        props: {
            isContentCollapse: {
                default: false
            }
        },
        data() {
            return {
                rows: [],
                selectedRows: [],
                updatedRows: [],
                departmentId: '',
                pageNumber: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecord: 0,
                search: '',
                isLoading: true,
                delayTimer: null,
            }
        },
        computed: {
            EmployeeStore() {
                return EmployeeStore.state
            }
        },
        components: {
            BaseButton, EmployeeList, ThePagination, BaseSpinner,
                BaseInput
        },
        created() {
            /**
             * Lấy data khi khởi tạo
             * @author: NMTuan (22/07/2021)
             */
            this.loadData()

            this.$eventBus.$on('loadData', this.loadData);
            this.$eventBus.$on('refresh', this.refresh);
            this.$eventBus.$on('selectRow', this.selectRow);
            this.$eventBus.$on('multipleSelectRow', this.multipleSelectRow);
            this.$eventBus.$on('clearSelectedRow', () => this.selectedRows = [])
            this.$eventBus.$on('pagingOff', () => {
                this.EmployeeStore.isPaging = false
                this.pageSize = 0;
                this.pageNumber = 1;
                this.loadData()
            })
            this.$eventBus.$on('pagingOn', () => {
                this.EmployeeStore.isPaging = true
                this.pageSize = 20;
                this.loadData()
            })
        },

        mounted: function(){
        },

        updated() {
        },

        methods: {

            /**
             * Hàm refresh đưa trang về các giá trị mặc định
             * @author: NMTuan (20/07/2021)
             */
            refresh() {
                this.pageNumber = 1;
                this.selectedRows = [];
                this.loadData();
            },

            /**
             * Hàm lấy dữ liệu
             * @author: NMTuan (22/7/2021)
             */
            loadData() {
                this.rows = [];
                this.isLoading = true;
                EmployeeApi.getDataFiltered(this.pageSize, this.pageNumber - 1, this.search.trim(), this.departmentId, (response) => {
                    this.totalPage = response.data.TotalPage
                    this.totalRecord = response.data.TotalRecord
                    this.rows = response.data.Data
                    this.isLoading = false;
                    if(!response.data) {
                        this.rows = [];
                        this.totalPage = 0;
                        this.totalRecord = 0;
                    }
                }, () => {
                    this.isLoading = false;
                })
            },

            /**
             * Hàm xóa các giá trị đã chọn
             * @author: NMTuan (21/07/2021)
             */
            delete() {
                let popup = {
                    type: 'warning',
                    message : 'Bạn chưa chọn bản ghi cần xóa!',
                    isShow: true,
                    confirm: 'Đồng ý',
                    cancel: false,
                }
                if (this.selectedRows.length != 0) {
                    popup.type = 'alarm'
                    popup.message = `Bạn có chắc muốn xóa ${this.selectedRows.length} bản ghi hay không?`
                    popup.confirm = 'Xóa'
                    popup.callback = () => {
                        this.isLoading = true;
                        EmployeeApi.deleteMultiple(this.selectedRows, () => {
                            this.selectedRows = [];
                            this.loadData()
                        }, () => {
                            this.isLoading = false
                        })
                    }
                }
                this.$parent.popup = popup
            },

            /**
             * Gọi Hàm mở form ở component cha
             * @author: NMTuan (20/07/2021)
             */
            openModal(id) {
                this.$eventBus.$emit('openModal', id, 'Add')
            },

            /**
             * Hàm chọn 1 row
             * @author: NMTuan (28/08/2021)
             */
            selectRow(id) {
                this.selectedRows = [];
                this.selectedRows.push(id)
            },

            /**
             * Chọn nhiều row
             * @author: NMTuan (20/07/2021)
             */
            multipleSelectRow(id) {
                if (!this.selectedRows.includes(id)){
                    this.selectedRows.push(id)
                } else {
                    let index = this.selectedRows.indexOf(id)
                    if ( index > -1 ) {
                        this.selectedRows.splice(index, 1)
                    }
                }
            },

            /**
             * Chon tất cả row trong bảng
             * @author: NMTuan (01/09/2021)
             */
            selectAll() {
                this.selectedRows = [];
                this.rows.forEach(item => {
                    this.selectedRows.push(item.EmployeeId)
                })
            },

            /**
             * Hàm lưu thay đổi các giá trong bảng
             * @author: NMTuan (01/09/2021)
             */
            saveChangedRow(row) {
                let rowFinded = this.updatedRows.find(item => item.EmployeeId == row.EmployeeId)
                if (rowFinded) {
                    rowFinded = row;
                } else {
                    this.updatedRows.push(row)
                }
            },

            /**
             * Hàm gọi api sửa nhiều bản ghi
             * @author: NMTuan (01/09/2021)
             */
            updateMultiple() {
                this.isLoading = true;
                EmployeeApi.updateMultiple(this.updatedRows, () => {
                    this.refresh()
                }, () => {
                    this.isLoading = false;
                })
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

        }
    }
</script>

<style scoped>

@import '../../../css/layout/content.css';
@import '../../../css/views/employee/content.css';

</style>