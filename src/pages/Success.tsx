import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Download, IdCard } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const applicationNumber = location.state?.applicationNumber || 'APP-XXXXX';
  const membershipId = location.state?.membershipId;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-custom border border-omk-line p-10 text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-black text-gray-900 mb-2">Registration Successful!</h1>
        <p className="text-gray-600 mb-8">Welcome to OMK Tamil Nadu. Your membership has been automatically approved.</p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500 mb-1 uppercase font-bold tracking-wide">Application Number</p>
            <div className="text-lg font-black text-gray-900">{applicationNumber}</div>
          </div>
          <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
            <p className="text-xs text-primary/80 mb-1 uppercase font-bold tracking-wide">Membership ID</p>
            <div className="text-lg font-black text-primary">{membershipId || 'Generating...'}</div>
          </div>
        </div>

        {membershipId && (
          <div className="mb-8">
            <Link 
              to={`/member/${membershipId}`}
              className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-xl shadow-lg transition-all hover:-translate-y-1"
            >
              <IdCard className="w-6 h-6" />
              View & Download ID Card
            </Link>
          </div>
        )}

        <Link to="/" className="inline-block text-gray-500 hover:text-gray-900 font-bold underline transition-colors">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default Success;
