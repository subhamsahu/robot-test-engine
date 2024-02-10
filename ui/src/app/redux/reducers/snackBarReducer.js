import { HIDE_SNACKBAR, SHOW_SNACKBAR } from "../constant"

const initialState = {
    show: false,
    msg: "",
    type: "success"
}

export const snackBarStateData = (snackBarState = initialState, action) => {
    switch (action.type) {
        case SHOW_SNACKBAR:
            snackBarState = {
                show:true,
                msg:action.payload.msg,
                type:action.payload.type
            }
            return snackBarState
        case HIDE_SNACKBAR:
            snackBarState= {
                show: false,
                msg: "",
                type: "success"
            }
            return snackBarState
        default:
            return snackBarState
    }
}