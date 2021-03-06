<template>
    <div class="paging-bar">
        <div class="paging-left">
            Tổng số: <span class="notosans-bold" >{{this.totalRecord}}</span> bản ghi
        </div>
        
        <div class="paging-right">
            <BaseDropdown 
                :items="[
                    {
                        text: '10 bản ghi/trang',
                        val: 10
                    },
                    {
                        text: '20 bản ghi/trang',
                        val: 20
                    },
                    {
                        text: '50 bản ghi/trang',
                        val: 50
                    },
                    {
                        text: '100 bản ghi/trang',
                        val: 100
                    },
                ]"
                dropdownClass="paging-dropdown"
                direction="up"
                :dropdownValue="pageSize"
                @input="updatePageSize"
            />
            <div class="paging-index">

                <div class="paging-item paging-control paging-prev"
                    :class="{'paging-control--disabled' : isFirst}"
                    @click="prevPage"
                >Trước</div>

                <div
                    class="paging-item paging-number"
                    v-if="hasFirst"
                    @click="firstPage"
                >1</div>

                <div
                    class="paging-item paging-ellipsis"
                    v-if="hasFirst"
                    @click="showFirst"
                >...</div>

                <div 
                    v-for="number in pagingNumber" 
                    :key="number" 
                    @click="switchPage(number)" 
                    class="paging-item paging-number"
                    :class="{'paging-number--active' : number == pageNumber}"
                >{{number}}</div>

                <div
                    class="paging-item paging-ellipsis"
                    v-if="hasLast"
                    @click="showLast"
                >...</div>

                <div
                    class="paging-item paging-number"
                    @click="switchPage(totalPage)" 
                    v-if="hasLast"
                >
                    {{this.totalPage}}
                </div>

                <div class="paging-item paging-control paging-next"
                    :class="{'paging-control--disabled' : isLast}"
                    @click="nextPage"
                >Sau</div>

            </div>
        </div>
    </div>
</template>

<script>
    import BaseDropdown from '../base/BaseDropdown.vue'
    export default {
        name: 'ThePagination',
        components: {
            BaseDropdown
        },
        props: {
            pageNumber : {
                default: 1,
            },
            pageSize: {
                default: 10,
            },
            totalPage: {
                type: Number
            },
            totalRecord: {
                type: Number
            }
        },
        data() {
            return {
                pagingNumber: [],
                recordRange: '',
                isFirst: true,
                isLast: false,
                hasLast: true,
                hasFirst: false,
            }
        },
        created() {
            this.pagingNumber = this.getPagingNumber(this.pageNumber)
        },
        mounted() {
        },
        computed: {
            range() {
                return this.getRecordRange()
            }
        },
        watch: {
            /**
             * Kiểm tra sự thay đổi của pageNumber, totalPage thì lấy lại paging number và record range
             * @author: NMTuan (20/07/2021)
             */
            pageNumber: function (value) {
                this.pagingNumber = this.getPagingNumber(value);
                
                this.isFirst = (value == 1)
                this.isLast = (value == this.totalPage)
            },
            totalPage: function () {
                this.pagingNumber = this.getPagingNumber(this.pageNumber);
            },
        },
        methods: {
            /**
             * Method thay đổi giá trị pageNumber
             * @author: NMTuan(21/07/2021)
             */
            switchPage(number) {
                if (number > this.totalPage) {
                    this.$emit('switchPage', this.totalPage);
                    return;
                }
                this.$emit('switchPage', number);
            },

            /**
             * Hàm sinh list paging number
             * @author: NMTuan(21/07/2021)
             * modified by: NMTuan (03/08/2021)
             */
            getPagingNumber(value) {

                //Lấy danh sách paging trong trường hợp ít hơn 4 trang
                if (this.totalPage < 4) {
                    this.hasLast = false;
                    this.hasFirst = false;
                    let paging = [];
                    for (let i = 1; i <= this.totalPage; i++) {
                        paging.push(i);
                    }
                    return paging;
                }

                //Trường hợp ở trang 1
                if (value < 4) {
                    this.hasLast = true
                    this.hasFirst = false;
                    return [1,2,3,4];
                //Trường hơp ở trang gần cuối
                } else if ( this.totalPage - value < 3 ) {
                    this.hasLast = false;
                    this.hasFirst = true;
                    return [this.totalPage -3, this.totalPage -2, this.totalPage -1, this.totalPage];
                //Trương hợp khác
                } else {
                    this.hasLast = true
                    this.hasFirst = true;
                    return [value - 1, value, value + 1];
                }
            },

            /**
             * Hàm sinh ra record range
             * @author: NMTuan(21/07/2021)
             */
            getRecordRange() {
                //numberStart giá trị bắt đầu
                let numberStart = (this.pageNumber - 1) * this.pageSize + 1;
                //numberEnd giá trị kết thúc
                let numberEnd = this.pageNumber * this.pageSize;
                //Xét trường hợp vượt quá giá trị tối đa
                if (numberEnd > this.totalRecord) {
                    numberEnd = this.totalRecord;
                }
                //Xét trường hợp không có bản ghi nào
                if (!this.totalRecord) {
                    numberStart = 0;
                }
                return numberStart + '-' + numberEnd + '/' + this.totalRecord;
            },

            /**
             * Method update lại giá trị page size
             * @author: NMTuan (20/07/2021)
             */
            updatePageSize($event) {
                this.$emit('updatePageSize', $event);
            },

            /**
             * Lùi 1 trang trước đó
             * @author: NMTuan (20/07/2021)
             */
            prevPage() {
                if (this.isFirst) return;
                this.switchPage(this.pageNumber - 1);
            },

            /**
             * Tiến 1 trang
             * @author: NMTuan (20/07/2021)
             */
            nextPage() {
                if (this.isLast) return;
                this.switchPage(this.pageNumber + 1 );
            },

            /**
             * Đến trang cuối cùng
             * @author: NMTuan (20/07/2021)
             */
            lastPage() {
                if (this.isLast) return;
                this.switchPage(this.totalPage);
            },

            /**
             * Về trang đầu tiên
             * @author: NMTuan (20/07/2021)
             */
            firstPage() {
                if (this.isFirst) return;
                this.switchPage(1);
            },

            showFirst() {
                this.hasFirst = false;
                this.hasLast = true;
                this.pagingNumber = [1,2,3];
                // this.pagingNumber = this.getPagingNumber(this.pageNumber - 1)
            },

            showLast() {
                this.hasFirst = true;
                this.hasLast = false;
                this.pagingNumber = [this.totalPage -2, this.totalPage -1, this.totalPage];
            }

        }
    }
</script>

<style scoped>
@import '../../css/layout/pagination.css';
@import '../../css/base/dropdown.css';
</style>