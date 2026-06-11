import React from 'react';
import { MapPin, Info, ArrowRight } from 'lucide-react';
import Badge from '../common/Badge';
import Button from '../common/Button';

const TheatreCard = ({ theatre, onSelect, selected = false }) => {
  const { name, address, facilities = [] } = theatre;

  return (
    <div className={`p-5 rounded-xl border transition-all duration-200 ${
      selected 
        ? 'bg-brand-accent/5 border-brand-accent glow-red' 
        : 'bg-brand-card border-gray-800 hover:border-gray-700'
    }`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{name}</h3>
          
          <div className="flex items-start space-x-2 text-xs text-gray-400 mb-3">
            <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
            <span>{address}</span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {facilities.map((fac) => (
              <Badge key={fac} variant="default" className="text-[10px] bg-gray-900 border-gray-800 text-gray-400">
                {fac}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center">
          <Button
            variant={selected ? 'primary' : 'outline'}
            onClick={() => onSelect(theatre)}
            className="w-full md:w-auto"
          >
            <span>{selected ? 'Selected' : 'Select Theatre'}</span>
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TheatreCard;
