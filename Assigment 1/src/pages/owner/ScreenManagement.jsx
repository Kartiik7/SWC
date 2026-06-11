import React, { useState } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { PlusCircle, Edit, Trash2, Clapperboard, MapPin } from 'lucide-react';

const ScreenManagement = () => {
  const { theatres, screens, addScreen, updateScreen, deleteScreen } = useBooking();
  const { currentUser } = useAuth();
  
  const [selectedTheatreId, setSelectedTheatreId] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    type: 'Standard 2D',
    capacity: '60',
    rowsCount: 6,
    colsCount: 10
  });
  const [errors, setErrors] = useState({});

  if (!currentUser) return null;

  // Filter approved theatres of this owner
  const myTheatres = theatres.filter(t => t.ownerId === currentUser.id && t.status === 'Approved');

  // Auto-select first theatre if not set
  if (myTheatres.length > 0 && !selectedTheatreId) {
    setSelectedTheatreId(myTheatres[0].id);
  }

  // Filter screens belonging to selected theatre
  const activeScreens = screens.filter(s => s.theatreId === selectedTheatreId);

  const handleOpenAdd = () => {
    setEditingScreen(null);
    setFormData({
      name: '',
      type: 'Standard 2D',
      capacity: '60',
      rowsCount: 6,
      colsCount: 10
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (screen) => {
    setEditingScreen(screen);
    setFormData({
      name: screen.name,
      type: screen.type,
      capacity: screen.capacity.toString(),
      rowsCount: screen.rows.length,
      colsCount: screen.columns
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Screen Name is required';
    if (!formData.capacity || isNaN(formData.capacity) || parseInt(formData.capacity) <= 0) {
      errs.capacity = 'Please specify a valid seat capacity';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Generate rows letters based on rowsCount (e.g. 6 -> A, B, C, D, E, F)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const rowsArray = alphabet.slice(0, formData.rowsCount);

    const screenData = {
      theatreId: selectedTheatreId,
      name: formData.name,
      type: formData.type,
      capacity: parseInt(formData.capacity),
      rows: rowsArray,
      columns: parseInt(formData.colsCount)
    };

    if (editingScreen) {
      updateScreen(editingScreen.id, screenData);
    } else {
      addScreen(screenData);
    }

    setIsModalOpen(false);
  };

  const headers = ['Screen Name', 'Type', 'Rows', 'Cols', 'Capacity', 'Actions'];
  const screenTypes = ['IMAX', 'Dolby Atmos', 'Standard 3D', 'Standard 2D'];

  const renderRow = (screen) => (
    <React.Fragment key={screen.id}>
      <td className="px-6 py-4 font-bold text-white text-sm">{screen.name}</td>
      <td className="px-6 py-4 text-xs">
        <Badge variant={screen.type === 'IMAX' ? 'gold' : screen.type === 'Dolby Atmos' ? 'primary' : 'default'}>
          {screen.type}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs text-gray-300">{screen.rows.length} ({screen.rows.join(',')})</td>
      <td className="px-6 py-4 text-xs text-gray-300">{screen.columns}</td>
      <td className="px-6 py-4 text-xs font-bold text-white">{screen.capacity} seats</td>
      <td className="px-6 py-4 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenEdit(screen)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-gold text-brand-gold transition-colors"
            title="Edit Screen"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteScreen(screen.id)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500 text-red-500 transition-colors"
            title="Delete Screen"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </React.Fragment>
  );

  return (
    <div className="space-y-8">
      {/* Header / Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Screen Management</h1>
          <p className="text-xs text-gray-500">Configure auditoriums, structural rows/columns, and projection types</p>
        </div>

        {myTheatres.length > 0 && (
          <div className="flex items-center space-x-3 bg-gray-900/60 border border-gray-800 rounded-xl px-4 py-2 text-sm text-gray-300">
            <MapPin className="h-4 w-4 text-brand-accent" />
            <select
              value={selectedTheatreId}
              onChange={(e) => setSelectedTheatreId(e.target.value)}
              className="bg-transparent focus:outline-none border-none pr-4 text-white text-xs cursor-pointer"
            >
              {myTheatres.map((t) => (
                <option key={t.id} value={t.id} className="bg-brand-bg">{t.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {myTheatres.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl">
          <p className="text-gray-500 text-sm">
            You don't have any approved theatres yet. Please contact the administrator.
          </p>
        </div>
      ) : (
        <>
          {/* Action button */}
          <div className="flex justify-end">
            <Button
              onClick={handleOpenAdd}
              variant="primary"
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-1.5" />
              Create Screen
            </Button>
          </div>

          {/* Table */}
          <Table
            headers={headers}
            data={activeScreens}
            renderRow={renderRow}
            emptyMessage="No screens registered for this theatre yet. Click Create Screen to add one."
          />
        </>
      )}

      {/* Screen config Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingScreen ? 'Edit Screen Configuration' : 'Create New Screen (Audi)'}
        footerActions={
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              {editingScreen ? 'Update Screen' : 'Create Screen'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Screen Name"
            name="name"
            placeholder="e.g. Screen 1 (IMAX)"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            {/* Screen Type */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Projection Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {screenTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <Input
              label="Total Capacity"
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: e.target.value }))}
              error={errors.capacity}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-gray-800/60 pt-4">
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Layout Rows Count</label>
              <select
                value={formData.rowsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, rowsCount: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {[4, 5, 6, 7, 8, 9, 10].map(r => (
                  <option key={r} value={r}>{r} Rows (Letters A to {String.fromCharCode(64+r)})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Layout Columns Count</label>
              <select
                value={formData.colsCount}
                onChange={(e) => setFormData(prev => ({ ...prev, colsCount: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {[6, 8, 10, 12, 14, 16].map(c => (
                  <option key={c} value={c}>{c} Columns</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ScreenManagement;
