import { formatMoney } from '../js/common/format'

export const tableMixin = {
    data() {
        return {
            lastSelect : null,
            entityName: 'Employee',
        }
    },
    computed: {
        idName: {
            get: function() {
                return this.entityName + 'Id'
            }
        },
        codeName: {
            get: function() {
                return this.entityName + 'Code'
            }
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
    methods: {
        /** 
         * Hàm xử lý checkbox
         * Author: NMTuan (20/07/2021)
         * @param {int} index 
         */
        checkBox(index) {
            let row = this.records[index]
            this.selectedRows.push(row[this.idName])
        },

        /**
         * Hàm xử ly uncheckbox
         * @author: NMTuan (21/09/2021)
         */
        uncheckBox(index) {
            let row = this.records[index]
            let rowToDeleteIndex = this.selectedRows.indexOf(row[this.idName])
            this.selectedRows.splice(rowToDeleteIndex, 1)
        },

        /** 
         * Hàm xử lý click checkbox
         * Author: NMTuan (20/07/2021)
         * @param {int} index 
         */
        clickCheckBox(index) {
            let row = this.records[index]
            if (!this.selectedRows.includes(row[this.idName])) {
                this.lastSelect = index;
                this.checkBox(index)
            } else {
                this.lastSelect = null;
                this.uncheckBox(index)
            }
            
        },

        /**
         * Hàm xử lý ctrl-click vào row
         * @author: NMTuan (09/08/2021)
         */
        ctrlClickRow(index) {
            this.clickCheckBox(index)
        },

        /**
         * Hàm click vào 1 dòng
         * @author: NMTuan (28/08/2021)
         */
        clickRow(index) {
            this.selectOne(index)
        },
        
        /**
         * Hàm chọn 1 dòng
         * @author: NMTuan (28/08/2021)
         */
        selectOne(index) {
            let row = this.records[index]
            this.lastSelect = index;
            this.selectedRows = [row[this.idName]]
        },

        /**
         * Hàm chuột phải vào dòng
         * @author: NMTuan (31/08/2021)
         */
        rightClickRow(index, evt) {
            this.clickRow(index)
            let row = this.records[index]
            this.contextMenu(evt, row[this.idName], row[this.codeName])
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
                index = this.records.length -1;
            } else if (index == this.records.length) {
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
            this.selectedRows = []
            this.$nextTick(() => {

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
            })
        },

        /**
         * Hàm chọn tất cả các dòng
         * @author: NMTuan (30/08/2021)
         */
        selectAll() {
            if (this.isAllSelected()) {
                this.selectedRows = []
            } else {
                let recordIds = [];
                this.records.forEach(record => {
                    recordIds.push(record[this.idName])
                });
                this.selectedRows = recordIds
            }
        },
        
        /**
         * Hàm kiểm tra tất cả các dòng đã được chọn
         * @author: NMTuan (22/09/2021)
         */
        isAllSelected() {
            if (this.records.length == 0) return false
            return this.records.every(record => {
                return this.selectedRows.includes(record[this.idName])
            })
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
    }
}