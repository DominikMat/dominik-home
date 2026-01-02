import Navigation from './Navigation';
import PlanetSimulation from './planet-sim/Planet';
import * as planetSimulationSettings from './planet-sim/SimulationSettings';

function App() {
  return (
    <div className="App">
      
      <Navigation />

      <PlanetSimulation 
        size={planetSimulationSettings.CANVAS_SIDE_LEN}
        positionX="25vw"
        positionY="0vh"
      />

    </div>
  );
}

export default App;