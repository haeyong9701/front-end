import React, { useState } from 'react';
import GooglePlacesAutocomplete, { geocodeByAddress } from 'react-google-places-autocomplete';

type Option = {
  label: string;
  value: string;
};

const AutoComplete = () => {
  const [value, setValue] = useState<Option | null>(null);
  const [geolocation, setGeolocation] = useState<google.maps.LatLng | null>(null);
  const googleMapApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || '';

  const handleSelect = async (address: Option) => {
    setValue(address);
    console.log(address);

    try {
      const results = await geocodeByAddress(address.label); // label을 주소로 사용
      setGeolocation(results[0].geometry.location);
    } catch (error) {
      console.error('Error fetching geolocation:', error);
    }
  };

  return (
    <div>
      <GooglePlacesAutocomplete
        selectProps={{
          value,
          onChange: (newValue) => {
            setValue(newValue ? newValue.value : null);

            if (newValue) {
              handleSelect(newValue);
            }
          },
        }}
        apiKey={googleMapApiKey}
      />
      {geolocation && (
        <p>
          Latitude: {geolocation.lat()}, Longitude: {geolocation.lng()}
        </p>
      )}
    </div>
  );
};

export default AutoComplete;
