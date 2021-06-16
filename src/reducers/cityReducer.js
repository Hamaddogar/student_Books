let initalState = localStorage.getItem("city");
!initalState && (initalState = "");

const cityReducer = (state = initalState, action) => {
    switch(action.type){
        case "city_is_selected":
            return action.payload;
        default:
            return state;
    }
}

export default cityReducer;