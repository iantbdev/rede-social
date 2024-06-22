import React from 'react';

const MusicPlayer = ({music_src}) => {

  return (
    <audio controls>
      <source src={music_src} type="audio/ogg" />
      <source src={music_src} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio> 
  );
};

export default MusicPlayer;