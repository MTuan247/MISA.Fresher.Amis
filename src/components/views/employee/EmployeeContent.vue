<template>
    <div class="content" :class="{'content--collapsed' : isContentCollapse}">
        <!-- <ClipLoader :loading="isLoading" size="60px" /> -->
        <BaseSpinner :isLoading="isLoading" />
        <div class="content-header">
            <div class="content-title">Nhân viên</div>
            <BaseButton
                id="add-employee"
                btnClass="btn-icon"
                title="Thêm mới nhân viên"
                :isDisabled="isLoading"
                :clickEvent="() => openModal('')"
            />
        </div>
        <div class="main-content flex flex-column">
            <div class="filter-bar flex flex-justify-space-between flex-grow-0">
                <div class="filter-area flex flex-align-center">
     
                </div>
                <div class="btn-action-area flex flex-align-center">
                    <!-- <BaseButton
                        i="far fa-trash-alt"
                        btnClass="delete btn-seconds btn-action"
                        :isDisabled="isLoading"
                        :clickEvent="this.delete"
                    /> -->

                    <div class="search-field field-label flex">
                        <input 
                            @keydown.enter.exact="refresh"
                            :disabled="isLoading"
                            ref="search" 
                            v-model="search" 
                            type="search" 
                            name="" 
                            id="" 
                            placeholder="Tìm kiếm theo mã, tên nhân viên"
                        >
                        <div class="search-icon vertical-center mi mi-24 mi-24-search"></div>
                    </div>

                    <BaseButton 
                        btnClass="refresh btn-seconds btn-action mi mi-refresh"
                        :isDisabled="isLoading"
                        :clickEvent="refresh"
                        background="./assets/img/Sprites.64af8f61.svg"
                        hoverTitle="Lấy lại dữ liệu"
                        tooltipClass="refresh-tooltip"
                    />
                </div>
            </div>
            <BaseGridTable 
                :columns="this.columns"
                :rows="this.rows"
                :selectedRows="selectedRows"
                @openModal='openModal'
                @updateSelectedRows='updateSelectedRows'
            />
        </div>
        <ThePagination 
            :pageNumber="this.pageNumber"
            :pageSize="this.pageSize"
            :totalPage="this.totalPage"
            :totalRecord="this.totalRecord"
            @switchPage="switchPage($event)"
            @updatePageSize="updatePageSize"
        />
    </div>
</template>

<script>
    import BaseButton from '../../base/BaseButton.vue';
    import BaseGridTable from '../../base/BaseGridTable.vue' 
    import ThePagination from '../../layout/ThePagination.vue'

    import EmployeeApi from '../../../js/api/employee/EmployeeApi'

    // import BaseVCombobox from '../../base/BaseVCombobox.vue'
    import BaseSpinner from '../../base/BaseSpinner.vue'

    export default {
        name: "TheContent",
        props: {
            isContentCollapse: {
                default: false
            }
        },
        data() {
            return {
                columns: [
                    {
                        title: '',
                        fieldName: 'Checkbox',
                        style: 'width: 50px; left: 0',
                        class: 'sticky'
                    },
                    {
                        title: 'Mã nhân viên',
                        fieldName: 'EmployeeCode',
                        style: 'width: 140px; left: 50px',
                        class: 'sticky'
                    },
                    {
                        title: 'Tên nhân viên',
                        fieldName: 'EmployeeName',
                        style: 'width: 200px; left: 190px',
                        class: 'sticky'
                    },
                    {
                        title: 'Giới tính',
                        fieldName: 'GenderName',
                        style: 'width: 100px;',
                    },
                    {
                        title: 'Ngày sinh',
                        fieldName: 'DateOfBirth',
                        style: 'width: 150px; text-align: center',
                    },
                    {
                        title: 'Số CMND',
                        fieldName: 'IdentityNumber',
                        style: 'width: 150px;',
                    },
                    {
                        title: 'Địa chỉ',
                        fieldName: 'Address',
                        style: 'width: 250px;',
                    },
                    {
                        title: 'Số điện thoại',
                        fieldName: 'PhoneNumber',
                        style: 'width: 150px;',
                    },
                    {
                        title: 'Email',
                        fieldName: 'Email',
                        style: 'width: 200px;',
                    },
                    {
                        title: 'Chức danh',
                        fieldName: 'EmployeePosition',
                        style: 'width: 180px;',
                    },
                    {
                        title: 'Bộ phận/Phòng ban',
                        fieldName: 'DepartmentName',
                        style: 'width: 180px;',
                    },
                    {
                        title: 'Số tài khoản',
                        fieldName: 'BankAccountNumber',
                        style: 'width: 180px;',
                    },
                    {
                        title: 'Tên ngân hàng',
                        fieldName: 'BankName',
                        style: 'width: 180px;',
                    },
                    {
                        title: 'Chi nhánh ngân hàng',
                        fieldName: 'BankBranchName',
                        style: 'width: 180px;',
                    },
                    {
                        title: 'Chức năng',
                        fieldName: '',
                        style: 'width: 100px; right: 0',
                        class: 'sticky'
                    }
                ],
                rows: [],
                selectedRows: [],
                departmentId: '',
                pageNumber: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecord: 0,
                search: '',
                isLoading: true,
            }
        },
        components: {
            BaseButton, BaseGridTable, ThePagination, BaseSpinner
        },
        created() {
            /**
             * Lấy data khi khởi tạo
             * @author: NMTuan (22/07/2021)
             */
            this.loadData()

            this.$eventBus.$on('loadData', this.loadData)
            this.$eventBus.$on('refresh', this.refresh)

        },

        mounted: function(){
        },

        methods: {

            /**
             * Hàm refresh đưa trang về các giá trị mặc định
             * @author: NMTuan (20/07/2021)
             */
            refresh() {
                this.pageNumber = 1
                this.loadData()
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
                    title : "Xóa bản ghi",
                    message : 'Bạn chưa chọn bản ghi cần xóa!',
                    isShow: true,
                    confirm: 'Đóng'
                }
                if (this.selectedRows.length != 0) {
                    popup.type = 'alarm'
                    popup.title = `Xóa ${this.selectedRows.length} bản ghi`
                    popup.message = `Bạn có chắc muốn xóa ${this.selectedRows.length} bản ghi hay không?`
                    popup.confirm = 'Xóa'
                    popup.callback = () => {
                        EmployeeApi.deleteMultiple(this.selectedRows, () => {
                            this.selectedRows = [];
                            this.loadData()
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
             * update các row được chọn
             * @author: NMTuan (20/07/2021)
             */
            updateSelectedRows(id) {
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
             * update giá trị pageSize
             * @author: NMTuan (20/07/2021)
             */
            updatePageSize(pageSize) {
                this.pageSize = pageSize
                this.pageNumber = 1
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

        }
    }
</script>

<style scoped>

@import '../../../css/layout/content.css';

</style>