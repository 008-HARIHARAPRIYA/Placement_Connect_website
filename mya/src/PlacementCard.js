// PlacementCard.js
import React from 'react';
import './PlacementCard.css';

const PlacementCard = () => {
  return (
    <div className="placement-card-container">
      <div className="video-background">
        <video autoPlay loop muted>
          <source src="/videos/background.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="placement-card-content">
        <h2>Placement Opportunity</h2>
        <p>Some details about the placement...</p>
        <button>Apply Now</button>
      </div>
    </div>
  );
};

export default PlacementCard;
