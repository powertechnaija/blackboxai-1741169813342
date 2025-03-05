import React, { useState } from 'react';
import Modal from './Modal';

const ImageGallery = ({
  images = [],
  aspectRatio = 'square',
  thumbnailPosition = 'bottom',
  className = ''
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Aspect ratio classes
  const aspectRatioClasses = {
    square: 'aspect-w-1 aspect-h-1',
    portrait: 'aspect-w-3 aspect-h-4',
    landscape: 'aspect-w-4 aspect-h-3',
    wide: 'aspect-w-16 aspect-h-9'
  };

  // Thumbnail position classes
  const thumbnailContainerClasses = {
    bottom: 'flex-col',
    left: 'flex-row-reverse',
    right: 'flex-row'
  };

  const thumbnailListClasses = {
    bottom: 'flex-row space-x-2 mt-2',
    left: 'flex-col space-y-2 mr-2',
    right: 'flex-col space-y-2 ml-2'
  };

  // Handle navigation
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Handle keyboard navigation in modal
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      goToNext();
    } else if (e.key === 'ArrowLeft') {
      goToPrevious();
    }
  };

  return (
    <div className={`flex ${thumbnailContainerClasses[thumbnailPosition]} ${className}`}>
      {/* Main image */}
      <div className="flex-1">
        <div
          className={`
            relative overflow-hidden rounded-lg
            ${aspectRatioClasses[aspectRatio]}
            cursor-pointer
          `}
          onClick={() => setIsModalOpen(true)}
        >
          <img
            src={images[currentIndex]}
            alt={`Product image ${currentIndex + 1}`}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-75 hover:bg-opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className={`flex ${thumbnailListClasses[thumbnailPosition]}`}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`
                relative overflow-hidden rounded-lg
                w-16 h-16
                focus:outline-none focus:ring-2 focus:ring-primary-500
                ${index === currentIndex ? 'ring-2 ring-primary-500' : ''}
              `}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="xl"
        className="bg-black bg-opacity-95"
      >
        <div
          className="h-full flex flex-col items-center justify-center"
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <i className="fas fa-times text-2xl"></i>
          </button>

          {/* Main image */}
          <div className="relative max-h-[80vh] max-w-full">
            <img
              src={images[currentIndex]}
              alt={`Product image ${currentIndex + 1}`}
              className="max-h-[80vh] max-w-full object-contain"
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                >
                  <i className="fas fa-chevron-left text-2xl"></i>
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                >
                  <i className="fas fa-chevron-right text-2xl"></i>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex space-x-2 mt-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`
                    relative overflow-hidden rounded-lg
                    w-16 h-16
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    ${index === currentIndex ? 'ring-2 ring-primary-500' : ''}
                  `}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default ImageGallery;
