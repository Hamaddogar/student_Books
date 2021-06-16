const ResizeImage = f => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx =  canvas.getContext("2d");
    ctx.drawImage(img);
}

export default ResizeImage