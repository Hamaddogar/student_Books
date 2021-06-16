const cityAction = payload => {
    localStorage.setItem("city", payload);
    return {
        type: "city_is_selected",
        payload,
    }
}

export default cityAction;