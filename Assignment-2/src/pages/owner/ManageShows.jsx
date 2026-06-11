import React, { useState } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useMovie } from '../../hooks/useMovie';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const ManageShows = () => {
  const { theatres, screens, shows, addShow, updateShow, deleteShow } = useBooking();
  const { movies } = useMovie();
  const { currentUser } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShow, setEditingShow] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    movieId: '',
    theatreId: '',
    screenId: '',
    date: '',
    time: '09:00 AM',
    price: ''
  });
  const [errors, setErrors] = useState({});

  if (!currentUser) return null;

  // Filter approved theatres of this owner
  const myTheatres = theatres.filter(t => t.ownerId === currentUser.id && t.status === 'Approved');
  const myTheatreIds = myTheatres.map(t => t.id);

  // Filter shows running in owner's theatres
  const myShows = shows.filter(s => myTheatreIds.includes(s.theatreId));

  // Get screens for the currently selected theatre in the form
  const formScreens = screens.filter(s => s.theatreId === formData.theatreId);

  const handleOpenAdd = () => {
    setEditingShow(null);
    setFormData({
      movieId: movies[0]?.id || '',
      theatreId: myTheatres[0]?.id || '',
      screenId: screens.find(s => s.theatreId === myTheatres[0]?.id)?.id || '',
      date: new Date().toISOString().split('T')[0],
      time: '09:00 AM',
      price: '200'
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (show) => {
    setEditingShow(show);
    setFormData({
      movieId: show.movieId,
      theatreId: show.theatreId,
      screenId: show.screenId,
      date: show.date,
      time: show.time,
      price: show.price.toString()
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleTheatreChange = (e) => {
    const tId = e.target.value;
    const defaultScreen = screens.find(s => s.theatreId === tId);
    setFormData(prev => ({
      ...prev,
      theatreId: tId,
      screenId: defaultScreen ? defaultScreen.id : ''
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.movieId) errs.movieId = 'Please select a movie';
    if (!formData.theatreId) errs.theatreId = 'Please select a theatre';
    if (!formData.screenId) errs.screenId = 'Please select a screen';
    if (!formData.date) errs.date = 'Date is required';
    if (!formData.time) errs.time = 'Time is required';
    if (!formData.price || isNaN(formData.price) || parseInt(formData.price) <= 0) {
      errs.price = 'Please provide a valid ticket price';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const showData = {
      movieId: formData.movieId,
      theatreId: formData.theatreId,
      screenId: formData.screenId,
      date: formData.date,
      time: formData.time,
      price: parseInt(formData.price)
    };

    if (editingShow) {
      updateShow(editingShow.id, showData);
    } else {
      addShow(showData);
    }

    setIsModalOpen(false);
  };

  // Helper names
  const getMovieName = (mId) => movies.find(m => m.id === mId)?.name || 'Unknown Movie';
  const getTheatreName = (tId) => theatres.find(t => t.id === tId)?.name || 'Unknown Cinema';
  const getScreenName = (sId) => screens.find(s => s.id === sId)?.name || 'Unknown Screen';

  const timeOptions = ['09:00 AM', '12:30 PM', '03:00 PM', '06:00 PM', '09:00 PM'];

  const headers = ['Movie', 'Cinema Hall', 'Screen (Audi)', 'Date', 'Time Slot', 'Base Price', 'Actions'];

  const renderRow = (show) => (
    <React.Fragment key={show.id}>
      <td className="px-6 py-4 font-bold text-white text-sm">{getMovieName(show.movieId)}</td>
      <td className="px-6 py-4 text-xs text-gray-300">{getTheatreName(show.theatreId)}</td>
      <td className="px-6 py-4 text-xs">
        <Badge variant="default">{getScreenName(show.screenId)}</Badge>
      </td>
      <td className="px-6 py-4 text-xs text-gray-300">{show.date}</td>
      <td className="px-6 py-4 text-xs font-semibold text-white">{show.time}</td>
      <td className="px-6 py-4 text-xs text-brand-gold font-bold">₹{show.price}</td>
      <td className="px-6 py-4 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenEdit(show)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-gold text-brand-gold transition-colors"
            title="Edit Show"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteShow(show.id)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500 text-red-500 transition-colors"
            title="Cancel Show"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </React.Fragment>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Manage Shows</h1>
          <p className="text-xs text-gray-500">Schedule movie screen timings, audis, and set pricing models</p>
        </div>
        
        {myTheatres.length === 0 ? (
          <Badge variant="warning">Request a cinema approval first</Badge>
        ) : (
          <Button
            onClick={handleOpenAdd}
            variant="primary"
            size="sm"
            className="shadow-md"
          >
            <PlusCircle className="h-4 w-4 mr-1.5" />
            Schedule Show
          </Button>
        )}
      </div>

      {/* Shows table */}
      <Table
        headers={headers}
        data={myShows}
        renderRow={renderRow}
        emptyMessage="No active shows scheduled in your cinemas. Click Schedule Show to start."
      />

      {/* Show scheduling Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingShow ? 'Edit Show Specifications' : 'Schedule New Screening'}
        footerActions={
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              {editingShow ? 'Save Changes' : 'Schedule Show'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Movie Selection */}
          <div className="flex flex-col space-y-1 w-full">
            <label className="text-sm font-medium text-gray-300">Select Movie</label>
            <select
              value={formData.movieId}
              onChange={(e) => setFormData(prev => ({ ...prev, movieId: e.target.value }))}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
            >
              {movies.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.language})</option>
              ))}
            </select>
            {errors.movieId && <span className="text-xs text-red-500 mt-1">{errors.movieId}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Theatre Selection */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Select Cinema Hall</label>
              <select
                value={formData.theatreId}
                onChange={handleTheatreChange}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {myTheatres.map(t => (
                  <option key={t.id} value={t.id}>{t.name} ({t.city})</option>
                ))}
              </select>
              {errors.theatreId && <span className="text-xs text-red-500 mt-1">{errors.theatreId}</span>}
            </div>

            {/* Screen Selection */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Select Screen (Audi)</label>
              <select
                value={formData.screenId}
                onChange={(e) => setFormData(prev => ({ ...prev, screenId: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {formScreens.length === 0 ? (
                  <option value="">No screens created for this cinema</option>
                ) : (
                  formScreens.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.type})</option>
                  ))
                )}
              </select>
              {errors.screenId && <span className="text-xs text-red-500 mt-1">{errors.screenId}</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Show Date */}
            <Input
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              error={errors.date}
              required
            />

            {/* Showtime Slot */}
            <div className="flex flex-col space-y-1 w-full">
              <label className="text-sm font-medium text-gray-300">Time Slot</label>
              <select
                value={formData.time}
                onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white text-xs focus:ring-brand-accent focus:outline-none"
              >
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Ticket pricing */}
          <Input
            label="Base Ticket Price (₹)"
            type="number"
            name="price"
            placeholder="250"
            value={formData.price}
            onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
            error={errors.price}
            required
          />

        </form>
      </Modal>
    </div>
  );
};

export default ManageShows;
