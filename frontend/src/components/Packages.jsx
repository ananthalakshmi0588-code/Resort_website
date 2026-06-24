// components/Packages.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookingForm from './BookingForm';
import './Packages.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        if (response.data.success) {
          setPackages(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleViewDetails = (pkg) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  // ✅ UPDATED: Use BookingForm instead of direct navigation
  const handleBookNow = (pkg) => {
    setSelectedPackage(pkg);
    setShowBookingForm(true);
    // Close details modal if open
    setIsModalOpen(false);
  };

  // Filter packages by tag
  const filteredPackages = activeTab === 'all' 
    ? packages 
    : packages.filter(pkg => pkg.tags && pkg.tags.includes(activeTab));

  // Get unique tags
  const allTags = ['all', ...new Set(packages.flatMap(pkg => pkg.tags || []))];

  if (loading) return <div className="loading">Loading packages...</div>;

  return (
    <section id="packages" className="packages-section">
      <div className="container">
        <div className="packages-header">
          <h2>Special Packages & Offers</h2>
          <p>Discover our curated packages designed to make your stay unforgettable with exclusive benefits and savings</p>
        </div>

        {/* Filter Tabs */}
        <div className="package-tabs">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`tab-btn ${activeTab === tag ? 'active' : ''}`}
              onClick={() => setActiveTab(tag)}
            >
              {tag === 'all' ? 'All Packages' : tag.charAt(0).toUpperCase() + tag.slice(1)}
            </button>
          ))}
        </div>

        <div className="packages-grid">
          {filteredPackages.map(pkg => (
            <div key={pkg._id} className={`package-card ${pkg.featured ? 'featured' : ''}`}>
              {/* Featured Badge */}
              {pkg.featured && <div className="featured-badge">Featured</div>}
              
              {/* Discount Badge */}
              {pkg.originalPrice && pkg.originalPrice > pkg.price && (
                <div className="discount-badge">
                  {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                </div>
              )}

              <div className="package-image">
                <div className="image-placeholder">
                  <span>🏝️</span>
                  <p>{pkg.name}</p>
                </div>
              </div>

              <div className="package-content">
                <div className="package-header">
                  <h3>{pkg.name}</h3>
                  <div className="package-duration">
                    <span className="duration-icon">⏱️</span>
                    {pkg.duration} {pkg.duration === 1 ? 'Night' : 'Nights'}
                  </div>
                </div>

                <p className="package-description">{pkg.description}</p>

                {/* Tags */}
                {pkg.tags && pkg.tags.length > 0 && (
                  <div className="package-tags">
                    {pkg.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="package-tag">#{tag}</span>
                    ))}
                  </div>
                )}

                {/* Price Section */}
                <div className="package-price">
                  {pkg.originalPrice && pkg.originalPrice > pkg.price ? (
                    <>
                      <span className="original-price">₹{pkg.originalPrice}</span>
                      <span className="current-price">₹{pkg.price}</span>
                    </>
                  ) : (
                    <span className="current-price">₹{pkg.price}</span>
                  )}
                  <span className="price-note">for {pkg.duration} nights</span>
                </div>

                {/* Inclusions Preview */}
                {pkg.inclusions && pkg.inclusions.length > 0 && (
                  <div className="inclusions-preview">
                    <h4>Includes:</h4>
                    <ul>
                      {pkg.inclusions.slice(0, 3).map((inclusion, index) => (
                        <li key={index}>✓ {inclusion.name}</li>
                      ))}
                      {pkg.inclusions.length > 3 && (
                        <li className="more-items">+ {pkg.inclusions.length - 3} more inclusions</li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="package-actions">
                  <button 
                    className="view-details-btn"
                    onClick={() => handleViewDetails(pkg)}
                  >
                    View Details
                  </button>
                  <button 
                    className="book-now-btn"
                    onClick={() => handleBookNow(pkg)}
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="no-packages">
            <h3>No packages found</h3>
            <p>Please check back later for new offers</p>
          </div>
        )}
      </div>

      {/* Package Details Modal */}
      {isModalOpen && selectedPackage && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content package-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            
            <div className="package-modal-content">
              <div className="package-modal-image">
                <div className="image-placeholder large">
                  <span>🏝️</span>
                  <p>{selectedPackage.name}</p>
                </div>
              </div>

              <div className="package-modal-info">
                <h2>{selectedPackage.name}</h2>
                
                <div className="package-meta">
                  <div className="meta-item">
                    <span className="meta-icon">⏱️</span>
                    <span>{selectedPackage.duration} Nights</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">👥</span>
                    <span>Max {selectedPackage.maxGuests?.adults || 2} Adults</span>
                  </div>
                  {selectedPackage.maxGuests?.children > 0 && (
                    <div className="meta-item">
                      <span className="meta-icon">👶</span>
                      <span>Max {selectedPackage.maxGuests.children} Children</span>
                    </div>
                  )}
                </div>

                <div className="modal-price-section">
                  {selectedPackage.originalPrice && selectedPackage.originalPrice > selectedPackage.price ? (
                    <>
                      <span className="original-price">₹{selectedPackage.originalPrice}</span>
                      <span className="current-price">₹{selectedPackage.price}</span>
                      <span className="discount-text">
                        Save ₹{selectedPackage.originalPrice - selectedPackage.price}
                      </span>
                    </>
                  ) : (
                    <span className="current-price">₹{selectedPackage.price}</span>
                  )}
                  <span className="price-duration">for {selectedPackage.duration} nights</span>
                </div>

                <div className="package-description-full">
                  <h4>Package Description</h4>
                  <p>{selectedPackage.description}</p>
                </div>

                {selectedPackage.inclusions && selectedPackage.inclusions.length > 0 && (
                  <div className="package-inclusions">
                    <h4>What's Included</h4>
                    <div className="inclusions-grid">
                      {selectedPackage.inclusions.map((inclusion, index) => (
                        <div key={index} className="inclusion-item">
                          <span className="inclusion-icon">✓</span>
                          <div className="inclusion-content">
                            <strong>{inclusion.name}</strong>
                            {inclusion.description && <p>{inclusion.description}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPackage.roomTypes && selectedPackage.roomTypes.length > 0 && (
                  <div className="package-rooms">
                    <h4>Available Room Types</h4>
                    <div className="room-types">
                      {selectedPackage.roomTypes.map((roomType, index) => (
                        <span key={index} className="room-type-tag">
                          {roomType.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="package-validity">
                  <p>
                    <strong>Valid:</strong> {new Date(selectedPackage.validFrom).toLocaleDateString()} - {' '}
                    {new Date(selectedPackage.validTo).toLocaleDateString()}
                  </p>
                </div>

                <div className="modal-actions">
                  {/* ✅ UPDATED: Use handleBookNow instead of direct navigation */}
                  <button 
                    className="book-now-btn large"
                    onClick={() => handleBookNow(selectedPackage)}
                  >
                    Book This Package
                  </button>
                  <button className="close-modal-btn" onClick={handleCloseModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ✅ ADD: Booking Form Modal for Packages */}
      {showBookingForm && selectedPackage && (
        <BookingForm
          package={selectedPackage}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedPackage(null);
          }}
          onBookingSuccess={() => {
            setShowBookingForm(false);
            setSelectedPackage(null);
            alert('Package booking request submitted successfully! We will contact you for confirmation.');
          }}
        />
      )}
    </section>
  );
};

export default Packages;