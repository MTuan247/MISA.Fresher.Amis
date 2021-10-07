<template>
    <div class="content tax-content" :class="{'content--collapsed' : isContentCollapse}">
        <BaseSpinner :isLoading="isLoading" />
        <div class="content-header">
            <div class="content-title">Thuế</div>
            <!-- <BaseButton
                btnClass="btn-icon"
                title="Thêm mới"
                :isDisabled="isLoading"
                :clickEvent="() => openModal('')"
            /> -->
        </div>
        <div class="main-content flex flex-column">
            <div class="content-wrapper" v-show="!expandDetail">
                <div class="filter-bar flex flex-justify-space-between flex-grow-0">
                    <div class="filter-bar-left flex flex-align-center">
                        <BaseInput
                            v-model="search"
                            placeholder="Tìm kiếm theo mã kỳ, tên kỳ"
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

                        <BaseButton
                            btnClass="add btn-seconds btn-action mi-24"
                            hoverTitle="Thêm mới"
                            :clickEvent="() => openModal('')"
                        >
                            <template v-slot:icon>
                                <i class="fal fa-plus-circle"></i>
                            </template>
                        </BaseButton>

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

                    </div>
                </div>
                <TaxCycleList 
                    :columns="TaxStore.columns"
                    :rows="this.rows"
                    :selected="selectedRows"
                    @openModal='openModal'
                    @updateSelected="(value) => {this.selectedRows = value}"
                    @detailRow="updateDetailTable"
                />
                <ThePagination 
                    v-show="TaxStore.isPaging"
                    :pageNumber="this.pageNumber"
                    :pageSize="this.pageSize"
                    :totalPage="this.totalPage"
                    :totalRecord="this.totalRecord"
                    @switchPage="switchPage($event)"
                    @updatePageSize="updatePageSize"
                />
            </div>
            <TaxDetailTable 
                :columns="TaxStore.detailColumns"
                :resizable="!expandDetail"
                :records="detailRecords"
                @expand="() => { this.expandDetail = !this.expandDetail}"
            />
        </div>
    </div>
</template>

<script>
    import BaseButton from '../../base/BaseButton.vue';
    import TaxCycleList from './TaxCycleList.vue' 
    import ThePagination from '../../layout/ThePagination.vue'

    import TaxApi from '../../../js/api/tax/tax-api'

    import {TaxStore} from './store'

    import BaseSpinner from '../../base/BaseSpinner.vue'
    import BaseInput from '../../base/BaseInput.vue';
    import TaxDetailTable from './TaxDetailTable.vue';

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
                pageNumber: 1,
                pageSize: 20,
                totalPage: 0,
                totalRecord: 0,
                search: '',
                isLoading: true,
                delayTimer: null,
                expandDetail: false,
                detailRecords: []
            }
        },
        computed: {
            TaxStore() {
                return TaxStore.state
            }
        },
        components: {
            BaseButton, TaxCycleList, ThePagination, BaseSpinner,
                BaseInput,
                TaxDetailTable
        },
        created() {
            /**
             * Lấy data khi khởi tạo
             * @author: NMTuan (22/07/2021)
             */
            this.loadData()

            this.$eventBus.$on('loadData', this.loadData);
            this.$eventBus.$on('refresh', this.refresh);
            this.$eventBus.$on('detail', this.updateDetailTable)
            this.$eventBus.$on('updateSelectedMaster', (selectedRows) => {
                this.selectedRows = selectedRows
            })
            this.$eventBus.$on('pagingOff', () => {
                this.TaxStore.isPaging = false
                this.pageSize = 0;
                this.pageNumber = 1;
                this.loadData()
            })
            this.$eventBus.$on('pagingOn', () => {
                this.TaxStore.isPaging = true
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
            loadData({
                success = () => {
                    this.updateDetailTable(this.rows[0].TaxId)
                    this.selectedRows = [this.rows[0].TaxId]
                }
            } = {}) {
                this.rows = [];
                this.isLoading = true;
                TaxApi.getDataFiltered(this.pageSize, this.pageNumber - 1, this.search.trim(), (response) => {
                    this.totalPage = response.data.TotalPage
                    this.totalRecord = response.data.TotalRecord
                    this.rows = response.data.Data
                    // this.detailRecords = []
                    this.isLoading = false;
                    if(!response.data) {
                        this.rows = [];
                        this.totalPage = 0;
                        this.totalRecord = 0;
                        this.detailRecords = []
                        return;
                    }
                    success(this.rows)
                }, () => {
                    this.isLoading = false;
                    this.detailRecords = []
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
                    title: 'Xác nhận',
                    cancel: false,
                }
                if (this.selectedRows.length != 0) {
                    popup.type = 'alarm'
                    popup.message = `Bạn có chắc muốn xóa ${this.selectedRows.length} bản ghi hay không?`
                    popup.confirm = 'Xóa'
                    popup.cancel = 'Hủy'
                    popup.callback = () => {
                        this.isLoading = true;
                        TaxApi.deleteMultiple(this.selectedRows, () => {
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
             * Hàm cập nhật bảng detail
             * @author: NMTuan (24/09/2021)
             */
            updateDetailTable(id) {
                TaxApi.getById(id, (response) => {
                    this.detailRecords = response.data.Details
                })
            }

        }
    }
</script>

<style scoped>
@import '../../../css/layout/content.css';
@import '../../../css/views/tax/tax-content.css';
</style>