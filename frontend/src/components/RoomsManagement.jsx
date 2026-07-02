import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './RoomsManagement.css';

const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'deluxe',
    pricePerNight: '',
    maxAdults: 2,
    maxChildren: 0,
    description: '',
    amenities: []
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const roomTypes = [
    { value: 'villa-balcony-view', label: 'Beach Front Villa' },
    { value: 'villa-garden-view', label: 'Garden View Villa' },
    { value: 'suite', label: 'Family Suite' },
    { value: 'deluxe', label: 'Deluxe Room' },
    { value: 'family', label: 'Family Suite' }
  ];

  const commonAmenities = [
    'Air Conditioning', 'Free WiFi', 'TV', 'Mini Bar', 'Safe', 
    'Ocean View', 'Private Balcony', 'Bathtub', 'Shower',
    'Room Service', 'Daily Housekeeping', 'Coffee Maker'
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('https://relaxee.onrender.com/api/rooms');
      if (response.data.success) {
        setRooms(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  // Image Upload Functions
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file types and size
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > 5) {
      alert('Maximum 5 images allowed per room');
      return;
    }

    setSelectedImages(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      if (selectedImages.length > 0) {
        // If images are selected, use FormData
        const submitData = new FormData();
        
        // Append room data
        submitData.append('name', formData.name);
        submitData.append('type', formData.type);
        submitData.append('pricePerNight', formData.pricePerNight);
        submitData.append('maxAdults', formData.maxAdults);
        submitData.append('maxChildren', formData.maxChildren);
        submitData.append('description', formData.description);
        submitData.append('amenities', JSON.stringify(formData.amenities));
        
        // Append images
        selectedImages.forEach(image => {
          submitData.append('images', image);
        });

        if (editingRoom) {
          // Update room with images
          const response = await axios.put(
            `https://relaxee.onrender.com/api/rooms/${editingRoom._id}`,
            submitData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          if (response.data.success) {
            setRooms(prevRooms =>
              prevRooms.map(room =>
                room._id === editingRoom._id ? response.data.data : room
              )
            );
            alert('Room updated successfully with new images!');
          }
        } else {
          // Create new room with images
          const response = await axios.post(
            'https://relaxee.onrender.com/api/rooms', 
            submitData,
            {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }
          );
          
          if (response.data.success) {
            setRooms(prevRooms => [...prevRooms, response.data.data]);
            alert('Room added successfully with images!');
          }
        }
      } else {
        // No images selected, use regular JSON
        if (editingRoom) {
          const response = await axios.put(
            `https://relaxee.onrender.com/api/rooms/${editingRoom._id}`,
            formData
          );
          
          if (response.data.success) {
            setRooms(prevRooms =>
              prevRooms.map(room =>
                room._id === editingRoom._id ? response.data.data : room
              )
            );
            alert('Room updated successfully!');
          }
        } else {
          const response = await axios.post('https://relaxee.onrender.com/api/rooms', formData);
          
          if (response.data.success) {
            setRooms(prevRooms => [...prevRooms, response.data.data]);
            alert('Room added successfully!');
          }
        }
      }
      
      resetForm();
    } catch (error) {
      alert('Error saving room: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'deluxe',
      pricePerNight: '',
      maxAdults: 2,
      maxChildren: 0,
      description: '',
      amenities: []
    });
    setSelectedImages([]);
    setImagePreviews([]);
    setEditingRoom(null);
    setShowAddRoom(false);
  };

  const handleEdit = (room) => {
    setFormData({
      name: room.name,
      type: room.type,
      pricePerNight: room.pricePerNight,
      maxAdults: room.maxAdults,
      maxChildren: room.maxChildren,
      description: room.description,
      amenities: room.amenities
    });
    setEditingRoom(room);
    setSelectedImages([]);
    setImagePreviews([]);
    setShowAddRoom(true);
  };

  const handleDelete = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        const response = await axios.delete(`https://relaxee.onrender.com/api/rooms/${roomId}`);
        
        if (response.data.success) {
          setRooms(prevRooms => prevRooms.filter(room => room._id !== roomId));
          alert('Room deleted successfully!');
        }
      } catch (error) {
        alert('Error deleting room: ' + error.response?.data?.message);
      }
    }
  };

  const toggleFeatured = async (roomId, currentlyFeatured) => {
    try {
      const response = await axios.put(`https://relaxee.onrender.com/api/rooms/${roomId}`, {
        featured: !currentlyFeatured
      });
      
      if (response.data.success) {
        setRooms(prevRooms =>
          prevRooms.map(room =>
            room._id === roomId ? { ...room, featured: !currentlyFeatured } : room
          )
        );
        alert(`Room ${!currentlyFeatured ? 'featured' : 'unfeatured'} successfully!`);
      }
    } catch (error) {
      alert('Error updating room: ' + error.response?.data?.message);
    }
  };

  if (loading) return <div className="loading">Loading rooms...</div>;

  return (
    <div className="rooms-management">
      <div className="section-header">
        <div className="header-content">
          <div>
            <h2>Room Management</h2>
            <p>Manage your resort rooms and suites</p>
          </div>
          <button 
            className="btn-add-room"
            onClick={() => setShowAddRoom(true)}
          >
            + Add New Room
          </button>
        </div>
      </div>

      {/* Add/Edit Room Form */}
      {(showAddRoom || editingRoom) && (
        <div className="room-form-overlay">
          <div className="room-form-container">
            <div className="form-header">
              <h3>{editingRoom ? 'Edit Room' : 'Add New Room'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="room-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Room Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Ocean View Suite"
                  />
                </div>

                <div className="form-group">
                  <label>Room Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    {roomTypes.map(room => (
                      <option key={room.value} value={room.value}>
                        {room.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Night (₹) *</label>
                  <input
                    type="number"
                    name="pricePerNight"
                    value={formData.pricePerNight}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="5000"
                  />
                </div>

                <div className="form-group">
                  <label>Max Adults *</label>
                  <select
                    name="maxAdults"
                    value={formData.maxAdults}
                    onChange={handleInputChange}
                    required
                  >
                    {[1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Max Children</label>
                  <select
                    name="maxChildren"
                    value={formData.maxChildren}
                    onChange={handleInputChange}
                  >
                    {[0, 1, 2, 3].map(num => (
                      <option key={num} value={num}>{num}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe the room features, view, and amenities..."
                  rows="4"
                />
              </div>

              {/* Image Upload Section */}
              <div className="form-group">
                <label>Room Images (Max 5 images)</label>
                <div className="image-upload-section">
                  <div className="upload-area">
                    <input
                      type="file"
                      id="room-images"
                      multiple
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="file-input"
                    />
                    <label htmlFor="room-images" className="upload-label">
                      <div className="upload-icon">📷</div>
                      <p>Click to upload images</p>
                      <span>PNG, JPG, JPEG up to 5MB each</span>
                      <span className="image-count">
                        {selectedImages.length}/5 images selected
                      </span>
                    </label>
                  </div>

                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="image-previews">
                      <h4>Selected Images:</h4>
                      <div className="preview-grid">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview">
                            <img src={preview} alt={`Preview ${index + 1}`} />
                            <button
                              type="button"
                              className="remove-image"
                              onClick={() => removeImage(index)}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Existing Images for Editing */}
                  {editingRoom && editingRoom.images && editingRoom.images.length > 0 && (
                    <div className="existing-images">
                      <h4>Current Images:</h4>
                      <div className="preview-grid">
                        {editingRoom.images.map((image, index) => (
                          <div key={index} className="image-preview existing">
                            <img 
                              src={`https://relaxee.onrender.com${image}`} 
                              alt={`Room ${index + 1}`}
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150/2c5530/white?text=Image';
                              }}
                            />
                            <span className="existing-badge">Current</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="amenities-grid">
                  {commonAmenities.map(amenity => (
                    <label key={amenity} className="amenity-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={() => handleAmenityToggle(amenity)}
                      />
                      <span className="checkmark"></span>
                      {amenity}
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-save" disabled={uploading}>
                  {uploading ? 'Uploading...' : (editingRoom ? 'Update Room' : 'Add Room')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      <div className="rooms-grid">
        {rooms.length === 0 ? (
          <div className="no-rooms">
            <p>No rooms found. Add your first room to get started!</p>
          </div>
        ) : (
          rooms.map(room => (
            <div key={room._id} className={`room-card ${room.featured ? 'featured' : ''}`}>
              {room.featured && <div className="featured-badge">⭐ Featured</div>}
              
              <div className="room-image">
                {room.images && room.images.length > 0 ? (
                  <img 
                    src={`https://relaxee.onrender.com${room.images[0]}`}
                    alt={room.name}
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x250/2c5530/white?text=Room+Image';
                    }}
                  />
                ) : (
                  <div className="no-image">No Image</div>
                )}
                
                {/* Image count badge */}
                {room.images && room.images.length > 1 && (
                  <div className="image-count-badge">
                    +{room.images.length - 1} more
                  </div>
                )}
              </div>

              <div className="room-info">
                <div className="room-header">
                  <h3>{room.name}</h3>
                  <span className="room-type">{roomTypes.find(rt => rt.value === room.type)?.label}</span>
                </div>

                <p className="room-description">
                  {room.description.length > 100 
                    ? `${room.description.substring(0, 100)}...` 
                    : room.description
                  }
                </p>

                <div className="room-details">
                  <div className="detail">
                    <span className="label">Price:</span>
                    <span className="value price">₹{room.pricePerNight}/night</span>
                  </div>
                  <div className="detail">
                    <span className="label">Capacity:</span>
                    <span className="value">
                      {room.maxAdults} Adult{room.maxAdults > 1 ? 's' : ''}
                      {room.maxChildren > 0 && `, ${room.maxChildren} Child${room.maxChildren > 1 ? 'ren' : ''}`}
                    </span>
                  </div>
                </div>

                <div className="room-amenities">
                  <strong>Amenities:</strong>
                  <div className="amenities-list">
                    {room.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="amenity-tag more">+{room.amenities.length - 3} more</span>
                    )}
                  </div>
                </div>

                <div className="room-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEdit(room)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className={`btn-feature ${room.featured ? 'featured' : ''}`}
                    onClick={() => toggleFeatured(room._id, room.featured)}
                  >
                    {room.featured ? '⭐ Featured' : '⭐ Feature'}
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDelete(room._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RoomsManagement;