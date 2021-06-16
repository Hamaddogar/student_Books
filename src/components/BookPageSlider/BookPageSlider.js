import React, { useState, useRef } from 'react';
import './BookPageSlider.scss';

const BookPageSlider = ({ photos }) => {
    const [index, setIndex] = useState(0);
    const scrollBar = useRef();
    const increment = () => {
        let i = index;
        i === (photos.length - 1) ? i = 0 : i++;
        slide(i);
    }
    const decrement = () => {
        let i = index;
        i === 0 ? i = (photos.length - 1) : i--;
        slide(i)
    }
    const slide = (i) => {
        scrollBar.current.scrollLeft = (scrollBar.current.offsetWidth / 100) * 25 * i;
        setIndex(i);
    }
    return (
        <div className='BookPageSlider fg pd card flex col'>
            <div className='big-book-image-container border flex ai fg sb'>
                <i className="fas fa-chevron-circle-left" onClick={decrement}></i>
                <i className="fas fa-chevron-circle-right" onClick={increment}></i>
                {photos.map((photo, i) => <div key={i}
                    className={`big-book-image flex ${i === index ? 'active' : ''}`}
                >
                    <img src={photo.url} alt={photo.name} />
                </div>
                )}
            </div>
            <div className='border'>
                <div className='flex images-container' ref={scrollBar}>
                    {photos.map((photo, i) => (
                        <div key={i}
                            className='book-image backgroundImage'
                            onClick={() => setIndex(i)}
                            style={{ backgroundImage: `url(${photo.url})` }}
                        >
                            <div className={`book-inner-image ${index === i ? 'active' : ''}`}></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BookPageSlider;