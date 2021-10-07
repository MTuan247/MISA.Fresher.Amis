<template>
    <div class="dropdown" :class="dropdownClass">
        <div class="dropdown-content"  @click="toggleDropdown" >
            <div class="value dropdown-text">{{text}}</div>
            <i :class="{'rotate': isShow, 'fa-caret-up' : direction == 'up', 'fa-caret-down' : direction == 'down'}" class="fa icon-right" aria-hidden="true"></i>
        </div>
        <div v-show="isShow" :class="{'collapse--up' : direction == 'up'}" class="collapse">
            <div 
                class="dropdown-item"
                :class="{'dropdown-item--active' : item.val == val }" 
                v-for="item in items" 
                :key="item.val" 
                @click="selectItem(item.text, item.val)" 
            >
                <i class="fa fa-check icon-left" aria-hidden="true"></i>{{item.text}}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'BaseDropdown',
        props: {
            items: {
                default: []
            },
            dropdownValue: {
                default: 1
            },
            dropdownClass: {

            },
            direction: {
                default: 'down'
            }
        },
        data() {
            return {
                isShow: false,
                text: '',
                val: '',
            }
        },
        mounted() {
            this.setValue()
            document.addEventListener('click', this.clickOutside)
        },
        watch: {
            /**
             * Kiểm tra value truyền vào thay đổi
             * @author: NMTuan (21/7/2021)
             */
            dropdownValue: function() {
                this.setValue()
            }
        },
        beforeDestroy () {
            document.removeEventListener('click',this.clickOutside)
        },
        methods: {
            
            /**
             * Đóng mở dropdown
             * @author: NMTuan (21/7/2021)
             */
            toggleDropdown() {
                this.isShow = !this.isShow
            },

            /**
             * Chọn item
             * @author: NMTuan (21/7/2021)
             */
            selectItem(text, val) {
                this.text = text
                this.val = val
                this.isShow = false
                this.$emit('input', this.val)
            },

            /**
             * Xử lý các giá trị
             * @author: NMTuan (21/7/2021)
             */
            setValue() {
                this.val = this.dropdownValue
                let item = this.items.find((item) => item.val == this.val)
                if (item) this.text = item.text;
                // this.$emit('getValue', this.val)
            },

            /**
             * Method click ra ngoài component
             * @author: NMTuan (29/07/2021)
             */
            clickOutside (e) {
                if (!this.$el.contains(e.target)) {
                    this.isShow = false
                }
            },
        }   
    }
</script>

<style scoped>
@import '../../css/base/dropdown.css'
</style>