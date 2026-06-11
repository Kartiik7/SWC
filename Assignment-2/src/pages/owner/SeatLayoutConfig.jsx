import React, { useState, useEffect } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Seat from '../../components/booking/Seat';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { Grid3X3, Save, MapPin, Clapperboard, HelpCircle } from 'lucide-react';

const SeatLayoutConfig = () => {
  const { theatres, screens, updateScreen } = useBooking();
  const { currentUser } = useAuth();

  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [selectedScreenId, setSelectedScreenId] = useState('');
  
  // Layout bounds
  const [rows, setRows] = useState(['A', 'B', 'C', 'D', 'E', 'F']);
  const [columnsCount, setColumnsCount] = useState(10);

  // Category mapping per row (Row Letter -> Category Name)
  const [rowCategories, setRowCategories] = useState({
    A: 'Premium', B: 'Premium',
    C: 'Gold', D: 'Gold',
    E: 'Silver', F: 'Silver'
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!currentUser) return null;

  // Filter approved theatres
  const myTheatres = theatres.filter(t => t.ownerId === currentUser.id && t.status === 'Approved');
  
  // Set default selections
  useEffect(() => {
    if (myTheatres.length > 0 && !selectedTheatreId) {
      setSelectedTheatreId(myTheatres[0].id);
    }
  }, [myTheatres, selectedTheatreId]);

  // Screens for selected theatre
  const activeScreens = screens.filter(s => s.theatreId === selectedTheatreId);

  useEffect(() => {
    if (activeScreens.length > 0 && !selectedScreenId) {
      setSelectedScreenId(activeScreens[0].id);
    }
  }, [activeScreens, selectedScreenId]);

  // Load screen configuration when screen changes
  useEffect(() => {
    const screen = screens.find(s => s.id === selectedScreenId);
    if (screen) {
      setRows(screen.rows);
      setColumnsCount(screen.columns);
      
      const newCats = {};
      screen.rows.forEach(row => {
        if (screen.categories?.Premium?.includes(row)) newCats[row] = 'Premium';
        else if (screen.categories?.Gold?.includes(row)) newCats[row] = 'Gold';
        else newCats[row] = 'Silver';
      });
      setRowCategories(newCats);
    }
  }, [selectedScreenId, screens]);

  const handleTheatreChange = (e) => {
    const tId = e.target.value;
    setSelectedTheatreId(tId);
    const firstScreen = screens.find(s => s.theatreId === tId);
    setSelectedScreenId(firstScreen ? firstScreen.id : '');
  };

  const handleCategoryCycle = (row) => {
    setRowCategories(prev => {
      const current = prev[row] || 'Silver';
      let next = 'Silver';
      if (current === 'Silver') next = 'Gold';
      else if (current === 'Gold') next = 'Premium';
      return { ...prev, [row]: next };
    });
  };

  const handleSaveLayout = () => {
    if (!selectedScreenId) return;

    // Package categories lists
    const premiumRows = [];
    const goldRows = [];
    const silverRows = [];

    rows.forEach(row => {
      const cat = rowCategories[row] || 'Silver';
      if (cat === 'Premium') premiumRows.push(row);
      else if (cat === 'Gold') goldRows.push(row);
      else silverRows.push(row);
    });

    const screenDetails = {
      rows,
      columns: columnsCount,
      capacity: rows.length * columnsCount,
      categories: {
        Premium: premiumRows,
        Gold: goldRows,
        Silver: silverRows
      }
    };

    updateScreen(selectedScreenId, screenDetails);
    
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Seat Layout Configuration</h1>
          <p className="text-xs text-gray-500 font-normal">
            Click row letters on the left to toggle between Premium, Gold, and Silver seat tiers
          </p>
        </div>

        {saveSuccess && (
          <Badge variant="success" className="animate-fadeIn">Layout Saved Successfully!</Badge>
        )}
      </div>

      {myTheatres.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl">
          <p className="text-gray-500 text-sm">No approved theatres registered to configure layouts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Controls Panel */}
          <div className="bg-brand-card border border-gray-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-800 pb-3">
              <Grid3X3 className="h-4.5 w-4.5 text-brand-accent" />
              Layout Settings
            </h3>

            {/* Select Theatre */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-xs font-semibold text-gray-400">Select Cinema</label>
              <select
                value={selectedTheatreId}
                onChange={handleTheatreChange}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {myTheatres.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Select Screen */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-xs font-semibold text-gray-400">Select Screen (Audi)</label>
              <select
                value={selectedScreenId}
                onChange={(e) => setSelectedScreenId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {activeScreens.length === 0 ? (
                  <option value="">No screens created</option>
                ) : (
                  activeScreens.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                  ))
                )}
              </select>
            </div>

            <div className="border-t border-gray-800/60 pt-4 text-xs text-gray-400 space-y-2">
              <p className="font-semibold text-white flex items-center gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-brand-gold" />
                Row Color Coding:
              </p>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded border border-brand-gold" />
                <span>Premium Tiers (+₹100)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded border border-amber-500" />
                <span>Gold Tiers (+₹50)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3.5 h-3.5 rounded border border-gray-600" />
                <span>Silver Tiers (+₹0)</span>
              </div>
            </div>

            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={handleSaveLayout}
              disabled={!selectedScreenId}
              className="font-bold shadow-md"
            >
              <Save className="h-4 w-4 mr-1.5" />
              Save Config
            </Button>
          </div>

          {/* Interactive Preview Panel */}
          <div className="lg:col-span-3 bg-brand-card/40 border border-gray-900 rounded-2xl p-6 md:p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center mb-8 border-b border-gray-800 w-full pb-4">
              <h3 className="text-base font-bold text-white">Auditorium Screen Preview</h3>
              <p className="text-xs text-gray-500 mt-1">Click the letters on the left/right to toggle row categories</p>
            </div>

            {/* Curvature Screen */}
            <div className="w-full max-w-md mb-12 flex flex-col items-center">
              <div className="w-full h-2 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700 rounded-lg shadow-inner"></div>
              <p className="text-[9px] uppercase text-gray-500 tracking-widest mt-1.5 font-bold">Screen Center Line</p>
            </div>

            {/* Matrix */}
            <div className="flex flex-col space-y-3 overflow-x-auto max-w-full pb-4 scrollbar-thin">
              {rows.map((row) => {
                const category = rowCategories[row] || 'Silver';
                return (
                  <div key={row} className="flex items-center space-x-4 min-w-max">
                    {/* Row click label */}
                    <button
                      onClick={() => handleCategoryCycle(row)}
                      className={`w-6 h-6 rounded-full text-xs font-black transition-colors ${
                        category === 'Premium' 
                          ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30' 
                          : category === 'Gold' 
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                      title={`Cycle category for Row ${row}`}
                    >
                      {row}
                    </button>

                    <div className="flex space-x-2">
                      {Array.from({ length: columnsCount }, (_, idx) => (
                        <Seat
                          key={idx}
                          row={row}
                          col={idx + 1}
                          category={category}
                          status="Available"
                          onClick={() => handleCategoryCycle(row)}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => handleCategoryCycle(row)}
                      className={`w-6 h-6 rounded-full text-xs font-black transition-colors ${
                        category === 'Premium' 
                          ? 'bg-brand-gold/15 text-brand-gold border border-brand-gold/30' 
                          : category === 'Gold' 
                          ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30' 
                          : 'bg-gray-800 text-gray-400 border border-gray-700'
                      }`}
                      title={`Cycle category for Row ${row}`}
                    >
                      {row}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
          
        </div>
      )}
    </div>
  );
};

export default SeatLayoutConfig;
