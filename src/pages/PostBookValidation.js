import Categories from '../data/Categories';
import { cities } from '../data/cities';

const PostBookValidation = (e, errCallBack) => {
    let err = null;
    const { title, price, city, category, writer, description } = e.target;

    // City Validation
    const isCity = cities.find(cty => cty.toLowerCase() === city.value.toLowerCase());
    if (!isCity) {
        city.value.trim() !== "" ? city.className = "filled danger" : city.className = "danger";
        err = "Please select city from dropdown options"
    }

    // Category Validation
    const isCategory = Categories.find(({ cat }) => cat.toLowerCase() === category.value.toLowerCase());
    if (!isCategory) {
        category.value.trim() !== "" ? category.className = "filled danger" : category.className = "danger";
        err = "Please select a category from dropdown options"
    }

    // Title Price Validation
    if (title.value.trim() === "") {
        title.className = "danger";
        err = "Please fill all the above fields";
    }
    if (price.value.trim() === "") {
        price.className = "danger";
        err = "Please fill all the above fields";
    }

    if (err) {
        errCallBack(err);
        return null
    };
    return {
        title: title.value,
        price: price.value,
        city: city.value,
        category: category.value,
        writer: writer.value,
        description: description.value,
    }
}

export default PostBookValidation;