import React, { useState } from 'react';
import { useMovie } from '../../hooks/useMovie';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';

const AddEditMovie = () => {
  const { movies, addMovie, updateMovie, deleteMovie } = useMovie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    genre: '',
    duration: '',
    language: '',
    synopsis: '',
    posterUrl: '',
    bannerUrl: ''
  });
  
  const [formErrors, setFormErrors] = useState({});

  const handleOpenAdd = () => {
    setEditingMovie(null);
    setFormData({
      name: '',
      genre: '',
      duration: '',
      language: '',
      synopsis: '',
      posterUrl: '',
      bannerUrl: ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (movie) => {
    setEditingMovie(movie);
    setFormData({
      name: movie.name,
      genre: movie.genre.join(', '),
      duration: movie.duration,
      language: movie.language,
      synopsis: movie.synopsis,
      posterUrl: movie.posterUrl,
      bannerUrl: movie.bannerUrl || ''
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Movie Name is required';
    if (!formData.genre.trim()) errors.genre = 'Genre is required';
    if (!formData.duration.trim()) errors.duration = 'Duration is required';
    if (!formData.language.trim()) errors.language = 'Language is required';
    if (!formData.synopsis.trim()) errors.synopsis = 'Synopsis description is required';
    if (!formData.posterUrl.trim()) errors.posterUrl = 'Poster image URL is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert comma separated genres to array
    const genreArray = formData.genre.split(',').map(g => g.trim()).filter(Boolean);
    const movieData = {
      name: formData.name,
      genre: genreArray,
      duration: formData.duration,
      language: formData.language,
      synopsis: formData.synopsis,
      posterUrl: formData.posterUrl,
      bannerUrl: formData.bannerUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200'
    };

    if (editingMovie) {
      updateMovie(editingMovie.id, movieData);
    } else {
      addMovie(movieData);
    }
    
    setIsModalOpen(false);
  };

  const headers = ['Poster', 'Movie Name', 'Genre', 'Duration', 'Language', 'Actions'];

  const renderRow = (movie) => (
    <React.Fragment key={movie.id}>
      <td className="px-6 py-4">
        <img 
          src={movie.posterUrl} 
          alt={movie.name} 
          className="w-10 h-14 object-cover rounded-md border border-gray-800" 
        />
      </td>
      <td className="px-6 py-4 font-bold text-white text-sm">{movie.name}</td>
      <td className="px-6 py-4 text-xs">
        <div className="flex flex-wrap gap-1">
          {movie.genre.map(g => (
            <Badge key={g} variant="default">{g}</Badge>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-xs text-gray-300">{movie.duration}</td>
      <td className="px-6 py-4 text-xs text-gray-300">{movie.language}</td>
      <td className="px-6 py-4 text-xs">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleOpenEdit(movie)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-gold text-brand-gold transition-colors"
            title="Edit Details"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => deleteMovie(movie.id)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500 text-red-500 transition-colors"
            title="Delete Movie"
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
          <h1 className="text-2xl font-extrabold text-white tracking-wide">Manage Movies</h1>
          <p className="text-xs text-gray-500">Add, edit, or delete movie catalog listings</p>
        </div>
        
        <Button
          onClick={handleOpenAdd}
          variant="primary"
          size="sm"
          className="shadow-md"
        >
          <PlusCircle className="h-4 w-4 mr-1.5" />
          Add Movie
        </Button>
      </div>

      {/* Movies Table */}
      <Table
        headers={headers}
        data={movies}
        renderRow={renderRow}
        emptyMessage="No movies listed. Please click Add Movie to add one."
      />

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMovie ? 'Update Movie Details' : 'Add New Movie'}
        footerActions={
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleSave}>
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Movie Name"
            name="name"
            placeholder="e.g. Inception"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={formErrors.name}
            required
          />
          <Input
            label="Genre (comma separated)"
            name="genre"
            placeholder="Sci-Fi, Action, Thriller"
            value={formData.genre}
            onChange={(e) => setFormData(prev => ({ ...prev, genre: e.target.value }))}
            error={formErrors.genre}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (e.g. 148 mins)"
              name="duration"
              placeholder="148 mins"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              error={formErrors.duration}
              required
            />
            <Input
              label="Language"
              name="language"
              placeholder="English"
              value={formData.language}
              onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
              error={formErrors.language}
              required
            />
          </div>
          <Input
            label="Poster Image URL"
            name="posterUrl"
            placeholder="https://images.unsplash.com/..."
            value={formData.posterUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
            error={formErrors.posterUrl}
            required
          />
          <Input
            label="Landscape Banner Image URL (Optional)"
            name="bannerUrl"
            placeholder="https://images.unsplash.com/..."
            value={formData.bannerUrl}
            onChange={(e) => setFormData(prev => ({ ...prev, bannerUrl: e.target.value }))}
          />
          
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-300">Synopsis</label>
            <textarea
              className={`w-full px-4 py-2 bg-gray-900 border ${
                formErrors.synopsis ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-brand-accent'
              } rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 h-24`}
              placeholder="Provide a detailed movie synopsis..."
              value={formData.synopsis}
              onChange={(e) => setFormData(prev => ({ ...prev, synopsis: e.target.value }))}
              required
            />
            {formErrors.synopsis && <span className="text-xs text-red-500 mt-1">{formErrors.synopsis}</span>}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddEditMovie;
