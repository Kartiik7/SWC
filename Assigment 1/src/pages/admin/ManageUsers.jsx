import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Table from '../../components/common/Table';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { Eye, ShieldAlert, Trash2, Ban } from 'lucide-react';

const ManageUsers = () => {
  const { users, blockUser, deleteUser } = useAuth();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenView = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const headers = ['Full Name', 'Email Address', 'Account Role', 'Active Status', 'Actions'];

  const renderRow = (user) => (
    <React.Fragment key={user.id}>
      <td className="px-6 py-4 font-bold text-white text-sm">{user.name}</td>
      <td className="px-6 py-4 text-xs text-gray-300">{user.email}</td>
      <td className="px-6 py-4 text-xs font-semibold">
        <Badge variant={user.role === 'admin' ? 'danger' : user.role === 'owner' ? 'gold' : 'primary'}>
          {user.role}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs">
        <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
          {user.status}
        </Badge>
      </td>
      <td className="px-6 py-4 text-xs">
        <div className="flex items-center space-x-2">
          {/* View Details */}
          <button
            onClick={() => handleOpenView(user)}
            className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-blue-500 text-blue-500 transition-colors"
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </button>
          
          {/* Block User (Cannot block admins) */}
          {user.role !== 'admin' && (
            <button
              onClick={() => blockUser(user.id)}
              className={`p-1.5 bg-gray-900 border border-gray-800 rounded-lg transition-colors ${
                user.status === 'Blocked' 
                  ? 'hover:border-emerald-500 text-emerald-400' 
                  : 'hover:border-amber-500 text-amber-500'
              }`}
              title={user.status === 'Blocked' ? 'Unblock User' : 'Block User'}
            >
              <Ban className="h-4 w-4" />
            </button>
          )}

          {/* Delete User (Cannot delete admins) */}
          {user.role !== 'admin' && (
            <button
              onClick={() => deleteUser(user.id)}
              className="p-1.5 bg-gray-900 border border-gray-800 rounded-lg hover:border-red-500 text-red-500 transition-colors"
              title="Delete User"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </React.Fragment>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Manage Users</h1>
        <p className="text-xs text-gray-500">Monitor registered user profiles, audit role credentials, and update statuses</p>
      </div>

      {/* Table grid */}
      <Table
        headers={headers}
        data={users}
        renderRow={renderRow}
      />

      {/* View User Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="User Account Details"
        footerActions={
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
        }
      >
        {selectedUser && (
          <div className="space-y-4 text-sm text-gray-300">
            <div className="grid grid-cols-2 gap-4 border-b border-gray-800/60 pb-3">
              <div>
                <span className="text-xs text-gray-500 block uppercase">Reference ID</span>
                <span className="font-semibold text-white font-mono">{selectedUser.id}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Account Role</span>
                <Badge variant={selectedUser.role === 'admin' ? 'danger' : selectedUser.role === 'owner' ? 'gold' : 'primary'} className="mt-0.5">
                  {selectedUser.role}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-xs text-gray-500 block uppercase">Full Name</span>
                <span className="font-bold text-white text-base">{selectedUser.name}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Email Address</span>
                <span className="font-semibold text-white">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Phone Number</span>
                <span className="font-semibold text-white">{selectedUser.phone || 'Not provided'}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block uppercase">Mailing Address</span>
                <span className="font-semibold text-white">{selectedUser.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageUsers;
