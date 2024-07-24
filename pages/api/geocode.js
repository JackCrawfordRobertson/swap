// pages/api/geocode.js

import fetch from 'node-fetch';

const apiKey = process.env.GOOGLE_MAPS_GEOCODE_API_KEY;

export default async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ error: 'Address is required' });
  }

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`);
    const data = await response.json();

    if (data.status === 'OK') {
      const cityComponent = data.results[0].address_components.find(component =>
        component.types.includes('locality')
      );
      const city = cityComponent ? cityComponent.long_name : null;

      if (!city) {
        // Sometimes, the city might be under the 'administrative_area_level_2' type
        const altCityComponent = data.results[0].address_components.find(component =>
          component.types.includes('administrative_area_level_2')
        );
        const altCity = altCityComponent ? altCityComponent.long_name : null;
        return res.status(200).json({ city: altCity });
      }

      return res.status(200).json({ city });
    } else {
      console.error('Geocoding API error:', data.error_message || data.status);
      return res.status(500).json({ error: 'Geocoding API error: ' + (data.error_message || data.status) });
    }
  } catch (error) {
    console.error('Geocoding API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
