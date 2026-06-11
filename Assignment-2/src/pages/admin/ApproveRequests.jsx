import React from 'react';
import { useBooking } from '../../hooks/useBooking';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { Check, X, ShieldAlert, MapPin, Briefcase } from 'lucide-react';

const ApproveRequests = () => {
  const { theatres, approveTheatre, rejectTheatre } = useBooking();
  const { users } = useAuth();

  // Filter pending theatre owner registration requests
  const pendingRequests = theatres.filter(t => t.status === 'Pending');

  const getOwnerName = (ownerId) => {
    return users.find(u => u.id === ownerId)?.name || 'Unknown Owner';
  };
  
  const getOwnerEmail = (ownerId) => {
    return users.find(u => u.id === ownerId)?.email || 'No email';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h1 className="text-2xl font-extrabold text-white tracking-wide">Pending Approvals</h1>
        <p className="text-xs text-gray-500">Review, approve, or reject new theatre registration requests submitted by owners</p>
      </div>

      {/* Requests Grid */}
      {pendingRequests.length === 0 ? (
        <div className="text-center py-20 bg-brand-card/40 border border-gray-800/80 rounded-2xl space-y-2">
          <p className="text-gray-500 text-sm">All registration requests have been cleared.</p>
          <p className="text-xs text-gray-600">The approvals queue is currently empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingRequests.map((req) => (
            <div 
              key={req.id} 
              className="bg-brand-card border border-gray-800 rounded-2xl p-6 shadow-lg space-y-4 hover:border-gray-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Title */}
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
                  <h3 className="font-extrabold text-white text-base leading-tight">{req.name}</h3>
                  <Badge variant="warning">Pending Review</Badge>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-2 text-xs text-gray-400">
                  <MapPin className="h-4 w-4 text-brand-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-300">{req.city}</p>
                    <p className="text-[10px] text-gray-500 leading-normal">{req.address}</p>
                  </div>
                </div>

                {/* Owner details */}
                <div className="flex items-start space-x-2 text-xs text-gray-400 bg-gray-900/60 p-3 rounded-lg border border-gray-900">
                  <Briefcase className="h-4 w-4 text-brand-gold flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[9px] text-gray-500 uppercase font-semibold">Submitted By Owner</p>
                    <p className="font-bold text-white mt-0.5">{getOwnerName(req.ownerId)}</p>
                    <p className="text-[10px] text-gray-500">{getOwnerEmail(req.ownerId)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-800/60">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => rejectTheatre(req.id)}
                  className="py-2.5 font-bold border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <X className="h-4 w-4 mr-1.5" />
                  Reject
                </Button>
                
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => approveTheatre(req.id)}
                  className="py-2.5 font-bold bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500 border-transparent shadow-md hover:shadow-lg hover:shadow-emerald-950/20"
                >
                  <Check className="h-4 w-4 mr-1.5" />
                  Approve
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ApproveRequests;
