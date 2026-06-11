import React, { useState } from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import { Eye, Edit, Trash2 } from 'lucide-react';

const ManageTheatres = () => {
  const { theatres, deleteTheatre, updateTheatre } = useBooking();
  const { users } = useAuth();
  
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Edit form states
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    address: '',
    facilities: ''
  });
  const [errors, setErrors] = useState({});

  const handleOpenView = (theatre) => {
    setSelectedTheatre(theatre);
    setIsViewModalOpen(true);
  };

  const handleOpenEdit = (theatre) => {
    setSelectedTheatre(theatre);
    setFormData({
      name: theatre.name,
      city: theatre.city,
      address: theatre.address,
      facilities: theatre.facilities.join(', ')
    });
    setErrors({});
    setIsEditModalOpen(true);
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Theatre name is required';
    if (!formData.city.trim()) errs.city = 'City location is required';
    if (!formData.address.trim()) errs.address = 'Mailing address is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const facArray = formData.facilities.split(',').map(f => f.trim()).filter(Boolean);
    const updatedDetails = {
      name: formData.name,
      city: formData.city,
      address: formData.address,
      facilities: facArray
    };

    updateTheatre(selectedTheatre.id, updatedDetails);
    setIsEditModalOpen(false);
  };

  const getOwnerName = (ownerId) => {
    return users.find(u => u.id === ownerId)?.name || 'Unknown Owner';
  };

  const headers = ['Theatre Name', 'Cinema Owner', 'City Location', 'Registration Status', 'Actions'];

  const renderRow = (theatre) => (
    <React.Fragment key={theatre.id}>
      <td className="px-6 py-4 font-bold text-white text-sm">{theatre.name}</td>
      <td className="px-6 py-4 text-xs text-gray-300">{getOwnerName(theatre.ownerId)}</td>
      <td className="px-6 py-4 text-xs">
        <Badge variant="default" className="bg-gray-950 text-gray-300">{theatre.city}</Badge>
      </td>
      <td className="px-6 py-4 text-xs">
        <Badge 
          variant={
            theatre.status === 'Approved' 
              ? 'success' 
              : theatre.status === 'Rejected' 
              ? 'danger' 
              : 'warning'
          }
        >
          {theatre.status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs">
        <div className="flex items-center space-x-2">
          {/* View Details */}
          <button
            onClick={() => handleOpenView(theatre)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500 text-blue-500 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {/* Edit Details */}
          <button
            onClick={() => handleOpenEdit(theatre)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-brand-gold text-brand-gold transition-colors"
            title="Edit Details"
          >
            <Edit className="h-4 w-4" />
          </button>

          {/* Delete Theatre */}
          <button
            onClick={() => deleteTheatre(theatre.id)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500 text-red-500 transition-colors"
            title="Deregister Theatre"
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
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Manage Theatres</h1>
        <p className="text-xs text-gray-500">Monitor all registered cinema halls, assign ownerships, and review specifications</p>
      </div>

      {/* Grid listing */}
      <Table
        headers={headers}
        data={theatres}
        renderRow={renderRow}
      />

      {/* View Details Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Theatre Profile Details"
        footerActions={
          <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>Close</Button>
        }
      >
        {selectedTheatre && (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-800/60 pb-3">
              <div>
                <span className="text-xs text-gray-500 block uppercase">Reference ID</span>
                <span className="font-semibold text-white font-mono">{selectedTheatre.id}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Approval Status</span>
                <Badge 
                  variant={
                    selectedTheatre.status === 'Approved' 
                      ? 'success' 
                      : selectedTheatre.status === 'Rejected' 
                      ? 'danger' 
                      : 'warning'
                  }
                  className="mt-0.5"
                >
                  {selectedTheatre.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 block uppercase">Cinema Hall Name</span>
                <span className="font-bold text-white text-base">{selectedTheatre.name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Assigned Owner</span>
                <span className="font-semibold text-white">{getOwnerName(selectedTheatre.ownerId)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">City Location</span>
                <span className="font-semibold text-white">{selectedTheatre.city}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Address Location</span>
                <span className="font-semibold text-white">{selectedTheatre.address}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Facilities</span>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedTheatre.facilities.map(fac => (
                    <Badge key={fac} variant="default" className="text-[10px] bg-gray-900 border-gray-800 text-gray-400">
                      {fac}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Details Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Theatre Profile"
        footerActions={
          <div className="flex space-x-2">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleUpdate}>Update Details</Button>
          </div>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Theatre Name"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            error={errors.name}
            required
          />
          <Input
            label="City Location"
            name="city"
            value={formData.city}
            onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            error={errors.city}
            required
          />
          <Input
            label="Mailing Address"
            name="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            error={errors.address}
            required
          />
          <Input
            label="Facilities (comma separated)"
            name="facilities"
            value={formData.facilities}
            onChange={(e) => setFormData(prev => ({ ...prev, facilities: e.target.value }))}
            placeholder="IMAX, Dolby Atmos, Luxury Loungers"
          />
        </form>
      </Modal>
    </div>
  );
};

export default ManageTheatres;
