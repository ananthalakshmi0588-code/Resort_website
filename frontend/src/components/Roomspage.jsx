// components/RoomsPage.js
import React from 'react';
import Rooms from './Rooms'; // Your existing Rooms component

const RoomsPage = () => {
  return (
    <div className="rooms-page">
      <Rooms />  {/* Shows ALL rooms with full details */}
    </div>
  );
};

export default RoomsPage;