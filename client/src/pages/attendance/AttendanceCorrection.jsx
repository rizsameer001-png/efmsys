// // client/src/pages/attendance/AttendanceCorrection.jsx
// import React, { useState, useEffect } from 'react';
// import { attendanceApi } from '../../api/attendance.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Input from '../../components/common/Input';
// import Select from '../../components/common/Select';

// const AttendanceCorrection = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [myRequests, setMyRequests] = useState([]);
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [formData, setFormData] = useState({
//     date: '',
//     expectedCheckIn: '',
//     actualCheckIn: '',
//     expectedCheckOut: '',
//     actualCheckOut: '',
//     reason: '',
//     attachment: null
//   });
//   const [selectedRequest, setSelectedRequest] = useState(null);
//   const [reviewComment, setReviewComment] = useState('');

//   const isManager = ['manager', 'supervisor', 'hr', 'admin', 'super_admin'].includes(user?.role);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       if (isManager) {
//         const response = await attendanceApi.getPendingCorrections();
//         if (response.data.success) {
//           setPendingRequests(response.data.data);
//         }
//       }
      
//       const myResponse = await attendanceApi.getMyCorrectionRequests();
//       if (myResponse.data.success) {
//         setMyRequests(myResponse.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch correction data error:', error);
//       showToast('Failed to load correction requests', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
//   };

//   const handleSubmitRequest = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const submitData = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (formData[key]) {
//           submitData.append(key, formData[key]);
//         }
//       });
      
//       const response = await attendanceApi.requestCorrection(submitData);
//       if (response.data.success) {
//         showToast('Correction request submitted successfully', 'success');
//         setShowRequestForm(false);
//         setFormData({
//           date: '',
//           expectedCheckIn: '',
//           actualCheckIn: '',
//           expectedCheckOut: '',
//           actualCheckOut: '',
//           reason: '',
//           attachment: null
//         });
//         fetchData();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to submit request', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleApprove = async (requestId) => {
//     try {
//       const response = await attendanceApi.approveCorrection(requestId, reviewComment);
//       if (response.data.success) {
//         showToast('Correction request approved', 'success');
//         setSelectedRequest(null);
//         setReviewComment('');
//         fetchData();
//       }
//     } catch (error) {
//       showToast('Failed to approve request', 'error');
//     }
//   };

//   const handleReject = async (requestId) => {
//     if (!reviewComment) {
//       showToast('Please provide a rejection reason', 'error');
//       return;
//     }
//     try {
//       const response = await attendanceApi.rejectCorrection(requestId, reviewComment);
//       if (response.data.success) {
//         showToast('Correction request rejected', 'warning');
//         setSelectedRequest(null);
//         setReviewComment('');
//         fetchData();
//       }
//     } catch (error) {
//       showToast('Failed to reject request', 'error');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Attendance Correction</h1>
//           <p className="text-gray-500 mt-1">Request corrections for your attendance records</p>
//         </div>
//         <Button onClick={() => setShowRequestForm(true)}>+ Request Correction</Button>
//       </div>

//       {/* Request Form Modal */}
//       {showRequestForm && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-4">
//                 <h3 className="text-lg font-semibold">Request Attendance Correction</h3>
//                 <button onClick={() => setShowRequestForm(false)} className="text-gray-400 hover:text-gray-600">
//                   ✕
//                 </button>
//               </div>
//               <form onSubmit={handleSubmitRequest} className="space-y-4">
//                 <Input
//                   label="Date"
//                   type="date"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleInputChange}
//                   required
//                 />
//                 <div className="grid grid-cols-2 gap-4">
//                   <Input
//                     label="Expected Check In"
//                     type="time"
//                     name="expectedCheckIn"
//                     value={formData.expectedCheckIn}
//                     onChange={handleInputChange}
//                   />
//                   <Input
//                     label="Actual Check In"
//                     type="time"
//                     name="actualCheckIn"
//                     value={formData.actualCheckIn}
//                     onChange={handleInputChange}
//                   />
//                   <Input
//                     label="Expected Check Out"
//                     type="time"
//                     name="expectedCheckOut"
//                     value={formData.expectedCheckOut}
//                     onChange={handleInputChange}
//                   />
//                   <Input
//                     label="Actual Check Out"
//                     type="time"
//                     name="actualCheckOut"
//                     value={formData.actualCheckOut}
//                     onChange={handleInputChange}
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//                   <textarea
//                     name="reason"
//                     rows={3}
//                     value={formData.reason}
//                     onChange={handleInputChange}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="Please explain why you need this correction..."
//                     required
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Supporting Document (Optional)</label>
//                   <input
//                     type="file"
//                     onChange={handleFileChange}
//                     className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//                   />
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button type="button" variant="secondary" onClick={() => setShowRequestForm(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" isLoading={submitting}>
//                     Submit Request
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Manager View - Pending Approvals */}
//       {isManager && pendingRequests.length > 0 && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Pending Approval Requests</h3>
//           <div className="space-y-4">
//             {pendingRequests.map(request => (
//               <div key={request._id} className="border rounded-lg p-4 hover:bg-gray-50">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <p className="font-medium">{request.employeeName}</p>
//                     <p className="text-sm text-gray-500">Date: {new Date(request.date).toLocaleDateString()}</p>
//                     <p className="text-sm text-gray-500">Reason: {request.reason}</p>
//                     {request.expectedCheckIn && (
//                       <p className="text-xs text-gray-400">
//                         Expected: {request.expectedCheckIn} | Actual: {request.actualCheckIn}
//                       </p>
//                     )}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button size="sm" variant="secondary" onClick={() => setSelectedRequest(request)}>
//                       Review
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </Card>
//       )}

//       {/* Review Modal */}
//       {selectedRequest && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold mb-4">Review Correction Request</h3>
//               <div className="space-y-3 mb-4">
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Employee:</span>
//                   <span className="font-medium">{selectedRequest.employeeName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-500">Date:</span>
//                   <span>{new Date(selectedRequest.date).toLocaleDateString()}</span>
//                 </div>
//                 {selectedRequest.expectedCheckIn && (
//                   <>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Expected Check In:</span>
//                       <span>{selectedRequest.expectedCheckIn}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span className="text-gray-500">Actual Check In:</span>
//                       <span>{selectedRequest.actualCheckIn}</span>
//                     </div>
//                   </>
//                 )}
//                 <div>
//                   <span className="text-gray-500">Reason:</span>
//                   <p className="mt-1 text-gray-700">{selectedRequest.reason}</p>
//                 </div>
//               </div>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Comments / Reason</label>
//                 <textarea
//                   value={reviewComment}
//                   onChange={(e) => setReviewComment(e.target.value)}
//                   rows={3}
//                   className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Add approval comments or rejection reason..."
//                 />
//               </div>
//               <div className="flex justify-end gap-3">
//                 <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
//                   Cancel
//                 </Button>
//                 <Button variant="danger" onClick={() => handleReject(selectedRequest._id)}>
//                   Reject
//                 </Button>
//                 <Button variant="success" onClick={() => handleApprove(selectedRequest._id)}>
//                   Approve
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* My Requests */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">My Correction Requests</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {myRequests.length > 0 ? (
//                 myRequests.map(request => (
//                   <tr key={request._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {new Date(request.date).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(request.createdAt).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{request.reason}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
//                         {request.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
//                     No correction requests found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AttendanceCorrection;




// client/src/pages/attendance/AttendanceCorrection.jsx
import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';

const AttendanceCorrection = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    expectedCheckIn: '',
    actualCheckIn: '',
    expectedCheckOut: '',
    actualCheckOut: '',
    reason: '',
    attachment: null
  });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewComment, setReviewComment] = useState('');

  const isManager = ['manager', 'supervisor', 'hr', 'admin', 'super_admin'].includes(user?.role);

  useEffect(() => {
    fetchData();
  }, []);

  // 🔴 FIXED: Updated fetchData function with better error handling
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch my correction requests - handle missing method gracefully
      let myRequestsData = [];
      try {
        // Check if method exists before calling
        if (attendanceApi.getMyCorrectionRequests) {
          const myResponse = await attendanceApi.getMyCorrectionRequests();
          if (myResponse.data.success) {
            myRequestsData = myResponse.data.data || [];
          }
        } else {
          console.warn('getMyCorrectionRequests method not available, using fallback');
          // Fallback to empty array or try alternative endpoint
          try {
            const fallbackResponse = await attendanceApi.getPendingCorrections();
            if (fallbackResponse.data.success) {
              // Filter only current user's requests
              myRequestsData = fallbackResponse.data.data.filter(
                req => req.employeeId === user?._id
              ) || [];
            }
          } catch (fallbackError) {
            console.log('No correction requests endpoint available');
          }
        }
        setMyRequests(myRequestsData);
      } catch (myError) {
        console.error('Error fetching my correction requests:', myError);
        setMyRequests([]);
      }

      // Fetch pending corrections (for managers)
      if (isManager) {
        try {
          const pendingResponse = await attendanceApi.getPendingCorrections();
          if (pendingResponse.data.success) {
            setPendingRequests(pendingResponse.data.data || []);
          } else {
            setPendingRequests([]);
          }
        } catch (pendingError) {
          console.error('Error fetching pending corrections:', pendingError);
          setPendingRequests([]);
        }
      }
    } catch (error) {
      console.error('Fetch correction data error:', error);
      showToast('Failed to load correction requests', 'error');
      setMyRequests([]);
      setPendingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });
      
      const response = await attendanceApi.requestCorrection(submitData);
      if (response.data.success) {
        showToast('Correction request submitted successfully', 'success');
        setShowRequestForm(false);
        setFormData({
          date: '',
          expectedCheckIn: '',
          actualCheckIn: '',
          expectedCheckOut: '',
          actualCheckOut: '',
          reason: '',
          attachment: null
        });
        fetchData();
      }
    } catch (error) {
      console.error('Submit correction error:', error);
      showToast(error.response?.data?.error || 'Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      const response = await attendanceApi.approveCorrection(requestId, reviewComment);
      if (response.data.success) {
        showToast('Correction request approved', 'success');
        setSelectedRequest(null);
        setReviewComment('');
        fetchData();
      }
    } catch (error) {
      console.error('Approve error:', error);
      showToast(error.response?.data?.error || 'Failed to approve request', 'error');
    }
  };

  const handleReject = async (requestId) => {
    if (!reviewComment) {
      showToast('Please provide a rejection reason', 'error');
      return;
    }
    try {
      const response = await attendanceApi.rejectCorrection(requestId, reviewComment);
      if (response.data.success) {
        showToast('Correction request rejected', 'warning');
        setSelectedRequest(null);
        setReviewComment('');
        fetchData();
      }
    } catch (error) {
      console.error('Reject error:', error);
      showToast(error.response?.data?.error || 'Failed to reject request', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Correction</h1>
          <p className="text-gray-500 mt-1">Request corrections for your attendance records</p>
        </div>
        <Button onClick={() => setShowRequestForm(true)}>+ Request Correction</Button>
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Request Attendance Correction</h3>
                <button onClick={() => setShowRequestForm(false)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmitRequest} className="space-y-4">
                <Input
                  label="Date *"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Expected Check In"
                    type="time"
                    name="expectedCheckIn"
                    value={formData.expectedCheckIn}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Actual Check In"
                    type="time"
                    name="actualCheckIn"
                    value={formData.actualCheckIn}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Expected Check Out"
                    type="time"
                    name="expectedCheckOut"
                    value={formData.expectedCheckOut}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Actual Check Out"
                    type="time"
                    name="actualCheckOut"
                    value={formData.actualCheckOut}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason *
                  </label>
                  <textarea
                    name="reason"
                    rows={3}
                    value={formData.reason}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Please explain why you need this correction..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supporting Document (Optional)
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 Note: Please provide accurate information. False requests may be rejected.
                  </p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowRequestForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={submitting}>
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Manager View - Pending Approvals */}
      {isManager && pendingRequests.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Pending Approval Requests</h3>
          <div className="space-y-4">
            {pendingRequests.map(request => (
              <div key={request._id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{request.employeeName || request.employeeId?.name || 'Employee'}</p>
                    <p className="text-sm text-gray-500">Date: {new Date(request.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Reason: {request.reason}</p>
                    {request.expectedCheckIn && (
                      <p className="text-xs text-gray-400 mt-1">
                        Expected: {request.expectedCheckIn} | Actual: {request.actualCheckIn}
                      </p>
                    )}
                    {request.createdAt && (
                      <p className="text-xs text-gray-400">Requested: {new Date(request.createdAt).toLocaleString()}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setSelectedRequest(request)}>
                      Review
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Pending Requests Message */}
      {isManager && pendingRequests.length === 0 && (
        <Card className="p-6 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No pending correction requests</p>
          <p className="text-sm text-gray-400 mt-1">All requests have been processed</p>
        </Card>
      )}

      {/* Review Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Review Correction Request</h3>
                <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">
                  ✕
                </button>
              </div>
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee:</span>
                  <span className="font-medium">{selectedRequest.employeeName || selectedRequest.employeeId?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{new Date(selectedRequest.date).toLocaleDateString()}</span>
                </div>
                {selectedRequest.expectedCheckIn && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Check In:</span>
                      <span>{selectedRequest.expectedCheckIn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual Check In:</span>
                      <span>{selectedRequest.actualCheckIn}</span>
                    </div>
                  </>
                )}
                {selectedRequest.expectedCheckOut && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Expected Check Out:</span>
                      <span>{selectedRequest.expectedCheckOut}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Actual Check Out:</span>
                      <span>{selectedRequest.actualCheckOut}</span>
                    </div>
                  </>
                )}
                <div>
                  <span className="text-gray-500">Reason:</span>
                  <p className="mt-1 text-gray-700 bg-gray-50 p-2 rounded">{selectedRequest.reason}</p>
                </div>
                {selectedRequest.attachment && (
                  <div>
                    <span className="text-gray-500">Attachment:</span>
                    <a 
                      href={selectedRequest.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline mt-1"
                    >
                      View Document
                    </a>
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {selectedRequest.status === 'pending' ? 'Approval Comments / Rejection Reason' : 'Review Comments'}
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={selectedRequest.status === 'pending' 
                    ? "Add approval comments or rejection reason..."
                    : "Add review comments..."}
                />
              </div>
              {selectedRequest.status === 'pending' && (
                <div className="flex justify-end gap-3">
                  <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={() => handleReject(selectedRequest._id)}>
                    Reject
                  </Button>
                  <Button variant="success" onClick={() => handleApprove(selectedRequest._id)}>
                    Approve
                  </Button>
                </div>
              )}
              {selectedRequest.status !== 'pending' && (
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={() => setSelectedRequest(null)}>
                    Close
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* My Requests Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">My Correction Requests</h3>
          <p className="text-xs text-gray-500 mt-1">Track your submitted requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Request Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Changes Requested</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviewed By</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {myRequests.length > 0 ? (
                myRequests.map(request => (
                  <tr key={request._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {request.expectedCheckIn && (
                        <span className="block text-xs">
                          Check In: {request.expectedCheckIn} → {request.actualCheckIn}
                        </span>
                      )}
                      {request.expectedCheckOut && (
                        <span className="block text-xs">
                          Check Out: {request.expectedCheckOut} → {request.actualCheckOut}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={request.reason}>
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {request.reviewedBy?.name || request.approvedBy?.name || '-'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No correction requests found</p>
                      <button
                        onClick={() => setShowRequestForm(true)}
                        className="mt-2 text-blue-600 hover:text-blue-800"
                      >
                        Submit your first correction request
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceCorrection;