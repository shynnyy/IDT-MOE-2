import React from 'react';
import NewtonLab from './components/simulations/ch3_simulation_1/NewtonLab';

const App: React.FC = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <NewtonLab />
    </div>
  );
};

export default App;