// // client/src/pages/customer/VisitorPass.jsx
// import React, { useState, useEffect } from 'react';
// //import { visitorApi } from '../../api/visitor.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const VisitorPass = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [passes, setPasses] = useState([]);
//   const [showRequestModal, setShowRequestModal] = useState(false);
//   const [formData, setFormData] = useState({
//     visitorName: '',
//     visitorPhone: '',
//     visitorEmail: '',
//     vehicleNumber: '',
//     visitDate: new Date().toISOString().split('T')[0],
//     visitTime: '10:00',
//     purpose: '',
//     duration: 2
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedPass, setSelectedPass] = useState(null);

//   useEffect(() => {
//     fetchVisitorPasses();
//   }, []);

//   const fetchVisitorPasses = async () => {
//     setLoading(true);
//     try {
//       const response = await visitorApi.getMyVisitorPasses();
//       if (response.data.success) {
//         setPasses(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch visitor passes error:', error);
//       showToast('Failed to load visitor passes', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await visitorApi.requestPass(formData);
//       if (response.data.success) {
//         showToast('Visitor pass requested successfully', 'success');
//         setShowRequestModal(false);
//         setFormData({
//           visitorName: '',
//           visitorPhone: '',
//           visitorEmail: '',
//           vehicleNumber: '',
//           visitDate: new Date().toISOString().split('T')[0],
//           visitTime: '10:00',
//           purpose: '',
//           duration: 2
//         });
//         fetchVisitorPasses();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to request pass', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancelPass = async (passId) => {
//     if (window.confirm('Are you sure you want to cancel this visitor pass?')) {
//       try {
//         const response = await visitorApi.cancelPass(passId);
//         if (response.data.success) {
//           showToast('Visitor pass cancelled', 'success');
//           fetchVisitorPasses();
//         }
//       } catch (error) {
//         showToast('Failed to cancel pass', 'error');
//       }
//     }
//   };

//   const downloadPass = async (passId) => {
//     try {
//       const response = await visitorApi.downloadPass(passId);
//       const blob = new Blob([response.data], { type: 'application/pdf' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `visitor_pass_${passId}.pdf`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast('Pass downloaded', 'success');
//     } catch (error) {
//       showToast('Failed to download pass', 'error');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       expired: 'bg-gray-100 text-gray-800'
//     };
//     return badges[status] || badges.pending;
//   };

//   const formatDateTime = (date, time) => {
//     if (!date) return 'N/A';
//     return `${new Date(date).toLocaleDateString()} at ${time || 'N/A'}`;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Visitor Pass</h1>
//           <p className="text-gray-500 mt-1">Manage visitor passes for your property</p>
//         </div>
//         <Button onClick={() => setShowRequestModal(true)}>+ Request Visitor Pass</Button>
//       </div>

//       {/* Active Passes */}
//       {passes.filter(p => p.status === 'approved' && new Date(p.visitDate) >= new Date()).length > 0 && (
//         <div>
//           <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Passes</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {passes.filter(p => p.status === 'approved' && new Date(p.visitDate) >= new Date()).map(pass => (
//               <Card key={pass._id} className="p-4 border-l-4 border-l-green-500">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h3 className="font-semibold text-gray-900">{pass.visitorName}</h3>
//                     <p className="text-sm text-gray-500">{pass.visitorPhone}</p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       📅 {formatDateTime(pass.visitDate, pass.visitTime)}
//                     </p>
//                     {pass.vehicleNumber && (
//                       <p className="text-xs text-gray-400">🚗 {pass.vehicleNumber}</p>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(pass.status)}`}>
//                       {pass.status}
//                     </span>
//                     <button
//                       onClick={() => downloadPass(pass._id)}
//                       className="block text-blue-600 text-sm mt-2"
//                     >
//                       Download Pass
//                     </button>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* All Passes */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Pass History</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visit Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {passes.length > 0 ? (
//                 passes.map((pass) => (
//                   <tr key={pass._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {pass.visitorName}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {pass.visitorPhone}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(pass.visitDate, pass.visitTime)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(pass.status)}`}>
//                         {pass.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       {pass.status === 'pending' && (
//                         <button
//                           onClick={() => handleCancelPass(pass._id)}
//                           className="text-red-600 hover:text-red-800"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                       {pass.status === 'approved' && (
//                         <button
//                           onClick={() => downloadPass(pass._id)}
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           Download
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
//                     No visitor passes found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Request Pass Modal */}
//       <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Visitor Pass">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Visitor Name *</label>
//             <input
//               type="text"
//               value={formData.visitorName}
//               onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
//             <input
//               type="tel"
//               value={formData.visitorPhone}
//               onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
//             <input
//               type="email"
//               value={formData.visitorEmail}
//               onChange={(e) => setFormData({ ...formData, visitorEmail: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number (Optional)</label>
//             <input
//               type="text"
//               value={formData.vehicleNumber}
//               onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//               placeholder="e.g., A12345"
//             />
//           </div>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date *</label>
//               <input
//                 type="date"
//                 value={formData.visitDate}
//                 onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Visit Time *</label>
//               <input
//                 type="time"
//                 value={formData.visitTime}
//                 onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
//             <textarea
//               value={formData.purpose}
//               onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
//               rows={2}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Brief description of visit purpose"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Hours)</label>
//             <select
//               value={formData.duration}
//               onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value={1}>1 hour</option>
//               <option value={2}>2 hours</option>
//               <option value={3}>3 hours</option>
//               <option value={4}>4 hours</option>
//               <option value={6}>6 hours</option>
//               <option value={8}>8 hours</option>
//               <option value={12}>12 hours</option>
//               <option value={24}>24 hours</option>
//             </select>
//           </div>
//           <div className="flex justify-end gap-3 pt-4">
//             <Button type="button" variant="secondary" onClick={() => setShowRequestModal(false)}>
//               Cancel
//             </Button>
//             <Button type="submit" isLoading={submitting}>
//               Request Pass
//             </Button>
//           </div>
//         </form>
//       </Modal>
//     </div>
//   );
// };

// export default VisitorPass;


// client/src/pages/customer/VisitorPass.jsx
import React, { useState, useEffect } from 'react';
import { visitorPassApi } from '../../api/visitorPass.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const VisitorPass = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [passes, setPasses] = useState([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [formData, setFormData] = useState({
    visitorName: '',
    visitorPhone: '',
    purpose: '',
    visitDate: new Date().toISOString().split('T')[0],
    visitTime: '10:00',
    vehicleNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedPass, setSelectedPass] = useState(null);

  useEffect(() => {
    fetchVisitorPasses();
  }, []);

  const fetchVisitorPasses = async () => {
    setLoading(true);
    try {
      // Fetch active passes, pending requests, and history
      const [activeRes, pendingRes, historyRes] = await Promise.all([
        visitorPassApi.getActivePasses(),
        visitorPassApi.getPendingRequests(),
        visitorPassApi.getVisitorHistory({ limit: 50 })
      ]);
      
      let allPasses = [];
      
      if (activeRes.data?.success && Array.isArray(activeRes.data.data)) {
        allPasses = [...allPasses, ...activeRes.data.data];
      }
      if (pendingRes.data?.success && Array.isArray(pendingRes.data.data)) {
        allPasses = [...allPasses, ...pendingRes.data.data];
      }
      if (historyRes.data?.success && Array.isArray(historyRes.data.data)) {
        allPasses = [...allPasses, ...historyRes.data.data];
      }
      
      // Remove duplicates and sort by date
      const uniquePasses = allPasses.filter((pass, index, self) => 
        index === self.findIndex(p => p._id === pass._id)
      );
      
      uniquePasses.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setPasses(uniquePasses);
    } catch (error) {
      console.error('Fetch visitor passes error:', error);
      console.log('Error details:', error.response?.status, error.response?.data);
      showToast('Failed to load visitor passes', 'error');
      // Use mock data for development
      setPasses([
        {
          _id: '1',
          visitorName: 'John Smith',
          visitorPhone: '+971501234567',
          purpose: 'Guest Visit',
          visitDate: new Date(),
          visitTime: '14:00',
          vehicleNumber: 'A12345',
          status: 'approved',
          createdAt: new Date()
        },
        {
          _id: '2',
          visitorName: 'Mary Johnson',
          visitorPhone: '+971507654321',
          purpose: 'Delivery',
          visitDate: new Date(Date.now() + 86400000),
          visitTime: '10:00',
          vehicleNumber: '',
          status: 'pending',
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await visitorPassApi.requestPass(formData);
      if (response.data.success) {
        showToast('Visitor pass requested successfully', 'success');
        setShowRequestModal(false);
        setFormData({
          visitorName: '',
          visitorPhone: '',
          purpose: '',
          visitDate: new Date().toISOString().split('T')[0],
          visitTime: '10:00',
          vehicleNumber: ''
        });
        fetchVisitorPasses();
      } else {
        showToast(response.data.error || 'Failed to request pass', 'error');
      }
    } catch (error) {
      console.error('Request pass error:', error);
      showToast(error.response?.data?.error || 'Failed to request pass', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelPass = async (passId) => {
    if (window.confirm('Are you sure you want to cancel this visitor pass?')) {
      try {
        const response = await visitorPassApi.cancelPass(passId);
        if (response.data.success) {
          showToast('Visitor pass cancelled', 'success');
          fetchVisitorPasses();
        } else {
          showToast(response.data.error || 'Failed to cancel pass', 'error');
        }
      } catch (error) {
        console.error('Cancel pass error:', error);
        showToast(error.response?.data?.error || 'Failed to cancel pass', 'error');
      }
    }
  };

  const downloadPass = async (passId) => {
    try {
      const response = await visitorPassApi.downloadPassPDF(passId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `visitor_pass_${passId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Pass downloaded successfully', 'success');
    } catch (error) {
      console.error('Download pass error:', error);
      showToast('Failed to download pass', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-gray-100 text-gray-800',
      expired: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.pending;
  };

  const formatDateTime = (date, time) => {
    if (!date) return 'N/A';
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();
    if (time) {
      return `${formattedDate} at ${time}`;
    }
    return formattedDate;
  };

  const isPassActive = (pass) => {
    if (pass.status !== 'approved') return false;
    const visitDate = new Date(pass.visitDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return visitDate >= today;
  };

  const activePasses = passes.filter(pass => isPassActive(pass));
  const pendingPasses = passes.filter(pass => pass.status === 'pending');
  const historyPasses = passes.filter(pass => pass.status !== 'pending' && !isPassActive(pass));

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visitor Pass</h1>
          <p className="text-gray-500 mt-1">Manage visitor passes for your property</p>
        </div>
        <Button onClick={() => setShowRequestModal(true)} className="bg-purple-600 hover:bg-purple-700">
          + Request Visitor Pass
        </Button>
      </div>

      {/* Active Passes Section */}
      {activePasses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Active Passes ({activePasses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activePasses.map(pass => (
              <Card key={pass._id} className="p-4 border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{pass.visitorName}</h3>
                      {pass.vehicleNumber && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
                          🚗 {pass.vehicleNumber}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{pass.visitorPhone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      📅 {formatDateTime(pass.visitDate, pass.visitTime)}
                    </p>
                    {pass.purpose && (
                      <p className="text-xs text-gray-400 mt-1">📝 {pass.purpose}</p>
                    )}
                    <div className="mt-2 flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(pass.status)}`}>
                        {pass.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <button
                      onClick={() => downloadPass(pass._id)}
                      className="text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                    >
                      📄 Download
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests Section */}
      {pendingPasses.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
            Pending Requests ({pendingPasses.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingPasses.map(pass => (
              <Card key={pass._id} className="p-4 border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{pass.visitorName}</h3>
                    <p className="text-sm text-gray-500">{pass.visitorPhone}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      📅 {formatDateTime(pass.visitDate, pass.visitTime)}
                    </p>
                    {pass.purpose && (
                      <p className="text-xs text-gray-400 mt-1">📝 {pass.purpose}</p>
                    )}
                    <div className="mt-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(pass.status)}`}>
                        {pass.status}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancelPass(pass._id)}
                    className="text-red-600 text-sm hover:text-red-800"
                  >
                    Cancel
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pass History Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Pass History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visitor Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visit Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purpose</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {historyPasses.length > 0 ? (
                historyPasses.map((pass) => (
                  <tr key={pass._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {pass.visitorName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {pass.visitorPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(pass.visitDate, pass.visitTime)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {pass.purpose || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(pass.status)}`}>
                        {pass.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {pass.status === 'approved' && (
                        <button
                          onClick={() => downloadPass(pass._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2z" />
                      </svg>
                      <p>No visitor passes found</p>
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="mt-2 text-purple-600 hover:text-purple-800"
                      >
                        Request your first visitor pass
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Request Pass Modal */}
      <Modal isOpen={showRequestModal} onClose={() => setShowRequestModal(false)} title="Request Visitor Pass" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.visitorName}
                onChange={(e) => setFormData({ ...formData, visitorName: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                placeholder="Enter visitor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={formData.visitorPhone}
                onChange={(e) => setFormData({ ...formData, visitorPhone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Visit <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            >
              <option value="">Select purpose</option>
              <option value="delivery">Delivery</option>
              <option value="guest">Guest Visit</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.visitDate}
                onChange={(e) => setFormData({ ...formData, visitDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Time
              </label>
              <input
                type="time"
                value={formData.visitTime}
                onChange={(e) => setFormData({ ...formData, visitTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number (Optional)
            </label>
            <input
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="e.g., A12345 (for parking access)"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting} className="bg-purple-600 hover:bg-purple-700">
              Request Pass
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default VisitorPass;