import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/contacts');
        if (response.data.success) {
          setContactInfo(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching contact info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContactInfo();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll simulate a successful submission
      setTimeout(() => {
        setFormStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
        
        // Reset status after 3 seconds
        setTimeout(() => setFormStatus(''), 3000);
      }, 1000);

    } catch (error) {
      setFormStatus('error');
      console.error('Error sending message:', error);
    }
  };

  if (loading) return <div className="loading">Loading contact information...</div>;
  if (!contactInfo) return <div className="loading">Contact information not found</div>;

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-header">
          <h2>Get In Touch</h2>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div className="contact-content">
          {/* Contact Information */}
          <div className="contact-info">
            <h3>Contact Information</h3>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-details">
                <h4>Phone</h4>
                <p>{contactInfo.phone}</p>
                {contactInfo.emergencyContact && (
                  <p className="emergency-contact">
                    <strong>Emergency:</strong> {contactInfo.emergencyContact}
                  </p>
                )}
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-details">
                <h4>Email</h4>
                <p>{contactInfo.email}</p>
                {contactInfo.reservationEmail && (
                  <p>
                    <strong>Reservations:</strong> {contactInfo.reservationEmail}
                  </p>
                )}
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">🏖️</div>
              <div className="contact-details">
                <h4>Address</h4>
                <p>{contactInfo.address}</p>
                {contactInfo.mapLink && (
                  <a 
                    href={contactInfo.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="map-link"
                  >
                    View on Google Maps →
                  </a>
                )}
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">⏰</div>
              <div className="contact-details">
                <h4>Operating Hours</h4>
                <p>{contactInfo.operatingHours}</p>
              </div>
            </div>

            {/* Social Media */}
            {contactInfo.socialMedia && (
              <div className="social-media">
                <h4>Follow Us</h4>
                <div className="social-links">
                  {contactInfo.socialMedia.facebook && (
                    <a href={contactInfo.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <span className="social-icon">📘</span>
                      Facebook
                    </a>
                  )}
                  {contactInfo.socialMedia.instagram && (
                    <a href={contactInfo.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <span className="social-icon">📷</span>
                      Instagram
                    </a>
                  )}
                  {contactInfo.socialMedia.twitter && (
                    <a href={contactInfo.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <span className="social-icon">🐦</span>
                      Twitter
                    </a>
                  )}
                  {contactInfo.socialMedia.youtube && (
                    <a href={contactInfo.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                      <span className="social-icon">📺</span>
                      YouTube
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Form */}
          <div className="contact-form">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Room Reservation</option>
                    <option value="package">Package Inquiry</option>
                    <option value="event">Event Planning</option>
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows="6"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Please describe your inquiry in detail..."
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="submit-btn"
                disabled={formStatus === 'sending'}
              >
                {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
              </button>

              {formStatus === 'success' && (
                <div className="form-success">
                  ✅ Thank you! Your message has been sent successfully.
                </div>
              )}

              {formStatus === 'error' && (
                <div className="form-error">
                  ❌ Sorry, there was an error sending your message. Please try again.
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="map-section">
          <h3>Find Us</h3>
          <div className="map-placeholder">
            <div className="map-content">
              <span className="map-icon">🗺️</span>
              <h4>Google Maps Integration</h4>
              <p>Map would be displayed here with your resort location</p>
              {contactInfo.mapLink && (
                <a 
                  href={contactInfo.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-button"
                >
                  Open in Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;