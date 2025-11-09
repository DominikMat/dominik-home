import Navigation from './components/Navigation';
import Planet from './components/Planet';
import * as settings from './components/SimulationSettings';

function App() {
  return (
    <div className="App">
      
      <Navigation />

      <Planet 
        size={settings.CANVAS_SIDE_LEN}
        positionX="25vw"
        positionY="0vh"
      />

    </div>
  );
}

export default App;