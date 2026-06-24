import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Gallery.css';

const API_URL = 'http://localhost:5000/api';

const Gallery = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/gallery`);

        if (response.data.success) {
          setGallery(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const openModal = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="loading">Loading gallery...</div>;
  }

  return (
    <section id="gallery" className="gallery-section">
      <div className="container">
        <h2>Resort Gallery</h2>
        <p className="section-subtitle">
          Explore the beauty of Nandhini Beach Resort
        </p>

        <div className="gallery-grid">
          {gallery.map((item) => (
            <div
              key={item._id}
              className="gallery-item"
              onClick={() => openModal(item)}
            >
              <img
                src={`${API_URL}${item.imageUrl}`}
                alt={item.title}
                loading="lazy"
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/600x400?text=Image+Not+Found';
                }}
              />

              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}>
              &times;
            </button>

            <img
              src={`${API_URL}${selectedImage.imageUrl}`}
              alt={selectedImage.title}
            />

            <div className="modal-info">
              <h3>{selectedImage.title}</h3>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Gallery;