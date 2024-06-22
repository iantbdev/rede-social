import React from 'react';

const MusicPlayer = ({playlist_src}) => {

  return (
    <div>
      <audio controls>
        <source src={playlist_src} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio> 
    </div>
  );
};

export default MusicPlayer;