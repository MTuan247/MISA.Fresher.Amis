<template>
    <div class="tax-detail-table" :class="{'resizable' : resizable}">
        <div v-tooltip="{content: 'Thay đổi kích thước'}" class="resizer" @mousedown.prevent="resizeMouseDown">
        </div>
        <div class="grid-header">
            <div class="text-heading">Danh sách nhân viên</div>
            <div v-tooltip="{content: 'Thu/Phóng', classes: ['r-tooltip', 'tooltip-base']}" @click="$emit('expand')" class="expand pointer">
                <i class="fal fa-expand" v-if="resizable"></i>
                <i class="fal fa-compress" v-if="!resizable"></i>
            </div>
        </div>
        <div class="grid" ref="Table">
            <table cellspacing=0>
                <thead>
                    <tr>
                        <th v-for="col in columns" :class="col.class" :key="col.fieldName" :style="col.style" v-tooltip="{content: col.tooltip, classes: ['tooltip-base', col.tooltipClass]}" >
                            {{col.title}}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="(row, index) in records">
                        <tr 
                            :key="row.EmployeeId" 
                        >
                            <td :style="columns[0].style" 
                                :class="columns[0].class"
                            >
                                {{index + 1}}
                            </td>
                            <template  
                                v-for="col in columns.slice(1)" 
                            >
                                <td 
                                    :key="col.fieldName"
                                    :style="col.style" 
                                    :class="col.class"
                                >
                                    <span class="cell-text">{{ row[col.fieldName] | formatData(col.fieldName, col.type) }}</span>
                                    <span class="tooltip-text">{{ row[col.fieldName] | formatData(col.fieldName, col.type) }}</span>
                                </td>
                            </template>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import { formatData } from '../../../js/common/format'
    export default {
        name: 'TaxDetailTable',
        props: {
            columns: {
                default: []
            },
            resizable: {
                default: false,
            },
            records: {
                default: () => {
                    return []
                }
            }
        },
        mounted() {
        },
        data() {
            return {
            }
        },
        filters: {
            formatData: function(value, fieldName, type) {
                return formatData(value, fieldName, type)
            }
        },
        methods: {
            /**
             * Hàm resize lại chiều cao
             * @author: NMTuan (21/09/2021)
             */
            resize(e) {
                let el = this.$el
                const MAX_HEIGHT = document.querySelector('.main-content').clientHeight*0.6;
                const MIN_HEIGHT = 50;
                let height = el.getBoundingClientRect().bottom - e.pageY

                height = height > MAX_HEIGHT ? MAX_HEIGHT : height
                height = height < MIN_HEIGHT ? MIN_HEIGHT : height

                el.style.height = height + 'px'
            },

            /**
             * Hàm thêm sự kiện resize khi di chuột, dừng khi mouse up
             * @author: NMTuan (21/09/2021)
             */
            resizeMouseDown() {
                window.addEventListener('mousemove', this.resize)
                window.addEventListener('mouseup', this.stopResize)
            },

            /**
             * Hàm dừng resize
             * @author: NMTuan (21/09/2021)
             */
            stopResize() {
                window.removeEventListener('mousemove', this.resize)
            }
        }
    }
</script>

<style lang="css" scoped>
@import '../../../css/views/tax/tax-detail-table.css';
</style>