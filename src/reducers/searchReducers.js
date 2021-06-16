const searchReducers = (state = [], action) => {
    switch(action.type){
        case "search_results":
            return [...action.payload, ...state];
        default:
            return state;   
    }
}

export default searchReducers;