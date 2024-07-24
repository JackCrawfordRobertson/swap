// src/utils/geocode.js

export const getCityFromAddress = async (address) => {
  const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
  const data = await response.json();

  if (data.city) {
    return data.city;
  } else {
    throw new Error('Geocoding API error: ' + data.error);
  }
};
