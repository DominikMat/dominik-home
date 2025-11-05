import React from 'react';
import Navigation from './components/Navigation';
import Planet from './components/Planet';

function App() {
  return (
    <div className="App">
      
      <Navigation />

      <Planet 
        size={2000}
        positionX="25vw"
        positionY="0vh"
        scale={1.5}
      />

    </div>
  );
}

export default App;