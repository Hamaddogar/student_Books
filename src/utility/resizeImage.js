const resizeImage = (file, cb) => {
    if (file.size < 257200) return cb(file);
    let width = 500;
    let height = 500;
    const fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const natWidth = img.naturalWidth;
            const natHeight = img.naturalHeight;
            if (natWidth <= 500 && natHeight < 500) return cb(file);

            if (natWidth > natHeight) {
                const widthRatio = width / natWidth;
                height = natHeight * widthRatio;
            }
            else if (natWidth < natHeight) {
                const heightRatio = height / natHeight;
                width = natHeight * heightRatio;
            }
            const elem = document.createElement('canvas');
            elem.width = width;
            elem.height = height;
            const ctx = elem.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            ctx.canvas.toBlob((blob) => {
                const file = new File([blob], fileName,
                    { type: 'image/jpeg', lastModified: Date.now() }
                )
                cb(file);
            }, 'image/jpeg', 1)
        }
        reader.onerror = error => console.log(error);
    };
}


export default resizeImage;