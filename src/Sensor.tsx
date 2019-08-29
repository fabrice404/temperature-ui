import React from 'react';
import {
  faTemperatureFrigid,
  faTemperatureHot,
  faThermometerEmpty,
  faThermometerFull,
  faThermometerHalf,
  faThermometerQuarter,
  faThermometerThreeQuarters,
} from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import * as types from './types';

const getIconAndColor = (temperature: number) => {
  let icon;
  let color;
  if (temperature >= 30) {
    icon = faTemperatureHot;
    color = '#EF5350';
  } else if (temperature >= 27) {
    icon = faThermometerFull;
    color = '#EF9A9A';
  } else if (temperature >= 23) {
    icon = faThermometerThreeQuarters;
    color = '#FFEBEE';
  } else if (temperature >= 20) {
    icon = faThermometerHalf;
    color = '#FFFFFF';
  } else if (temperature >= 17) {
    icon = faThermometerQuarter;
    color = '#E3F2FD';
  } else if (temperature >= 13) {
    icon = faThermometerEmpty;
    color = '#90CAF9';
  } else {
    icon = faTemperatureFrigid;
    color = '#42A5F5';
  }
  return { icon, color };
};

const Sensor = ({
  name, value,
}: types.Sensor) => {
  const [number, fractional] = value.toString().split(/\./);

  const { icon, color } = getIconAndColor(value);

  return (
    <div className="sensor box">
      <div className="name">
        {name}
      </div>
      <div>
        <div className="temperature">
          <div className="thermometer">
            <FontAwesomeIcon icon={icon} size="3x" color={color} />
          </div>
          <div className="number">
            {number}
          </div>
          <div className="fractional">
            .
            {fractional || '0'}
            {' '}
            °C
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sensor;
