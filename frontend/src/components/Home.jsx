// components/Home.js
import React from 'react';
import Welcome from './Welcome';
import RoomsPreview from './RoomsPreview'; // Brief rooms preview
import Gallery from './Gallery';
import Amenities from './Amenities';
import Packages from './Packages';
import Reviews from './Reviews';
import Contact from './Contact';

const Home = () => {
  return (
    <>
      <Welcome />
      <RoomsPreview />  {/* Only shows 3 rooms + "View All" button */}
      <Gallery />
      <Amenities />
      <Packages />
      <Reviews />
      <Contact />
    </>
  );
};

export default Home;