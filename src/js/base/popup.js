import EventBus from "../../plugins/eventbus";

export default function showErrorPopup(message, callback = function(){}) {
    let popup = {
        type: 'warning',
        message : message,
        isShow: true,
        confirm: 'Đồng ý',
        subConfirm: '',
        cancel: '',
        callback: () => callback(),
    }
    EventBus.$emit('showPopup', popup);
}

export function showAlarmPopup(message, callback = function(){}) {
    let popup = {
        type: 'alarm',
        message : message,
        isShow: true,
        confirm: 'Đóng',
        subConfirm: '',
        cancel: '',
        callback: () => callback(),
    }
    EventBus.$emit('showPopup', popup);
}