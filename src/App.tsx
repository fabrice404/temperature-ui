import React, { useEffect, useState } from 'react';

import Sensor from './Sensor';
import * as types from './types';

const App = () => {
  const [sensors, setSensors] = useState<types.Sensor[]>([]);

  const loadSensors = () => {
    fetch('http://meteo-api.lamant.io/sensors')
      .then(response => response.json())
      .then(response => {
        const s: types.Sensor[] = [];
        Object.keys(response)
          .forEach(key => {
            s.push({
              name: key,
              ...response[key],
            });
          });
        setSensors(s);
      });
    setTimeout(() => loadSensors(), 60000);
  };

  useEffect(() => {
    loadSensors();
  }, []);

  return (
    <div>
      <div className="sensors">
        {sensors.map(sensor => <Sensor {...sensor} key={sensor.name} />)}
      </div>
    </div>
  );
};

export default App;
