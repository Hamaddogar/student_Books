const usersReducer = (state = [], action) => {
    switch(action.type){
        case "get_all_users":
            return action.payload;
        default:
            return state;
    }
}

export default usersReducer;