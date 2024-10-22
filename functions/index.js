// functions/index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { Client } = require('@googlemaps/google-maps-services-js');

admin.initializeApp();

const client = new Client({});

exports.addOrUpdateCity = functions.firestore
  .document('venues/{venueId}')
  .onWrite(async (change, context) => {
    const data = change.after.exists ? change.after.data() : null;
    const previousData = change.before.exists ? change.before.data() : null;
    const venueId = context.params.venueId;

    // Exit if there's no data (document deleted)
    if (!data) {
      return null;
    }

    // Check if location has changed or if it's a new document
    if (!previousData || data.location !== previousData.location) {
      try {
        const response = await client.geocode({
          params: {
            address: data.location,
            key: 'GOOGLE_MAPS_GEOCODE_API_KEY',
          },
        });

        const addressComponents = response.data.results[0].address_components;
        const cityComponent = addressComponents.find((component) =>
          component.types.includes('locality')
        );

        const city = cityComponent ? cityComponent.long_name : null;

        if (city) {
          await admin.firestore().collection('venues').doc(venueId).update({
            city,
          });
          console.log(`City updated to ${city} for venue ${venueId}`);
        } else {
          console.warn(`City not found for venue ${venueId}`);
        }
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    }

    return null;
  });