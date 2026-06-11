import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../hooks/useBooking';
import { MapPin, Check } from 'lucide-react';
import Button from '../../components/common/Button';

const LocationSelection = () => {
  const { selectedLocation, selectLocation, selectedMovie } = useBooking();
  const navigate = useNavigate();

  const cities = [
    { name: 'Jaipur', description: 'The Pink City' },
    { name: 'Delhi', description: 'National Capital Region' },
    { name: 'Mumbai', description: 'City of Dreams' },
    { name: 'Bangalore', description: 'Silicon Valley of India' },
    { name: 'Hyderabad', description: 'City of Pearls' }
  ];

  const handleSelectCity = (cityName) => {
    selectLocation(cityName);
    // Dynamic navigation: if they are booking a movie, proceed to Theatre selection
    if (selectedMovie) {
      navigate('/user/theatre');
    } else {
      navigate('/user/dashboard');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-wide">Select Location</h1>
        <p className="text-sm text-gray-400">Choose your city to explore screens and showtimes near you</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cities.map((city) => {
          const isSelected = selectedLocation === city.name;
          return (
            <div
              key={city.name}
              onClick={() => handleSelectCity(city.name)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between items-center text-center ${
                isSelected
                  ? 'bg-brand-accent/5 border-brand-accent glow-red'
                  : 'bg-brand-card border-gray-800 hover:border-gray-700'
              }`}
            >
              <div className={`p-4 rounded-full mb-4 ${
                isSelected ? 'bg-brand-accent/10 text-brand-accent' : 'bg-gray-950 text-gray-500'
              }`}>
                <MapPin className="h-8 w-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">{city.name}</h3>
                <p className="text-xs text-gray-500 mb-4">{city.description}</p>
              </div>

              <Button
                variant={isSelected ? 'primary' : 'secondary'}
                size="sm"
                className="w-full pointer-events-none"
              >
                {isSelected ? (
                  <>
                    <Check className="h-4 w-4 mr-1.5" />
                    Active Location
                  </>
                ) : (
                  'Select City'
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LocationSelection;
