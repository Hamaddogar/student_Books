const userContactReducer = (state = {}, action) => action.type === "user_contact_is_added" ? action.payload : state;

export default userContactReducer;