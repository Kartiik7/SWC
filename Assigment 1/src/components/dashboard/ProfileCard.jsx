import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Edit2, Check, X } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';

const ProfileCard = ({ user, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Name is required');
      return;
    }
    setError('');
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || ''
    });
    setError('');
    setIsEditing(false);
  };

  // Extract initials for user avatar
  const getInitials = (name) => {
    if (!name) return 'CV';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-brand-card border border-gray-800 rounded-2xl p-6 md:p-8 shadow-xl max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-start md:space-x-8 gap-6">
        
        {/* Avatar */}
        <div className="flex-shrink-0 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-accent to-brand-gold flex items-center justify-center text-white text-3xl font-bold border-4 border-gray-900 shadow-xl">
            {getInitials(user?.name)}
          </div>
        </div>

        {/* Info or Edit Form */}
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Profile Details</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-1 text-xs text-brand-accent hover:text-brand-hover font-semibold transition-colors"
              >
                <Edit2 className="h-3.5 w-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={error}
                required
              />
              <Input
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="City, State"
              />
              
              <div className="flex space-x-2 pt-2 justify-end">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                >
                  <Check className="h-4 w-4 mr-1" />
                  Save Changes
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <User className="h-5 w-5 text-brand-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Name</p>
                  <p className="text-base font-semibold text-white">{user?.name}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Mail className="h-5 w-5 text-brand-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-white">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm text-gray-300">
                <Phone className="h-5 w-5 text-brand-accent flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Phone</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.phone || <span className="text-gray-500 italic">Not provided</span>}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3 text-sm text-gray-300">
                <MapPin className="h-5 w-5 text-brand-accent flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Address</p>
                  <p className="text-sm font-semibold text-white">
                    {user?.address || <span className="text-gray-500 italic">Not provided</span>}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
