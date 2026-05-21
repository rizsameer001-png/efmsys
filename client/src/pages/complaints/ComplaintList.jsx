// // client/src/pages/complaints/ComplaintList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { complaintApi } from '../../api/complaint.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Table from '../../components/common/Table';
// import Pagination from '../../components/common/Pagination';
// import SearchBar from '../../components/common/SearchBar';
// import Spinner from '../../components/common/Spinner';
// import { COMPLAINT_STATUS, PRIORITY_OPTIONS } from '../../constants/complaintCategories';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';
// import { formatDate, formatDateTime } from '../../utils/formatters';

// const ComplaintList = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState(null);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
//   const [filters, setFilters] = useState({ search: '', status: '', priority: '', category: '' });

//   useEffect(() => {
//     fetchComplaints();
//     fetchStats();
//   }, [pagination.page, filters]);

//   const fetchComplaints = async () => {
//     setLoading(true);
//     try {
//       const response = await complaintApi.getComplaints({
//         page: pagination.page,
//         limit: pagination.limit,
//         ...filters
//       });
//       setComplaints(response.data.data.complaints);
//       setPagination(response.data.data.pagination);
//     } catch (error) {
//       showToast('Failed to load complaints', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await complaintApi.getDashboardStats();
//       setStats(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch stats:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusConfig = COMPLAINT_STATUS.find(s => s.value === status);
//     return statusConfig || { label: status, color: 'bg-gray-100 text-gray-800' };
//   };

//   const getPriorityBadge = (priority) => {
//     const priorityConfig = PRIORITY_OPTIONS.find(p => p.value === priority);
//     return priorityConfig || { label: priority, color: 'bg-gray-100 text-gray-800' };
//   };

//   const columns = [
//     { key: 'ticketNumber', header: 'Ticket #', width: '120px' },
//     { key: 'title', header: 'Title', width: '250px' },
//     { 
//       key: 'category', 
//       header: 'Category', 
//       width: '120px',
//       render: (cat) => <span className="capitalize">{cat}</span>
//     },
//     { 
//       key: 'priority', 
//       header: 'Priority', 
//       width: '100px',
//       render: (p) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(p).color}`}>
//           {p?.toUpperCase()}
//         </span>
//       )
//     },
//     { 
//       key: 'status', 
//       header: 'Status', 
//       width: '130px',
//       render: (s) => (
//         <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(s).color}`}>
//           {getStatusBadge(s).label}
//         </span>
//       )
//     },
//     { key: 'customerName', header: 'Customer', width: '150px' },
//     { 
//       key: 'createdAt', 
//       header: 'Created', 
//       width: '120px',
//       render: (date) => formatDate(date)
//     },
//     {
//       key: 'actions',
//       header: 'Actions',
//       width: '100px',
//       render: (_, row) => (
//         <button onClick={() => navigate(`/complaints/${row._id}`)} className="text-blue-600 hover:text-blue-800">
//           View
//         </button>
//       )
//     }
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
//           <p className="text-gray-500 mt-1">Manage customer complaints and issues</p>
//         </div>
//         {user?.role === 'customer' && (
//           <Button onClick={() => navigate('/complaints/new')}>+ Raise Complaint</Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       {stats && (
//         <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-blue-600">{stats.total || 0}</p>
//             <p className="text-xs text-gray-500">Total</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-orange-600">{stats.open || 0}</p>
//             <p className="text-xs text-gray-500">Open</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-purple-600">{stats.assigned || 0}</p>
//             <p className="text-xs text-gray-500">Assigned</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-yellow-600">{stats.inProgress || 0}</p>
//             <p className="text-xs text-gray-500">In Progress</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-green-600">{stats.completed || 0}</p>
//             <p className="text-xs text-gray-500">Completed</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-teal-600">{stats.verified || 0}</p>
//             <p className="text-xs text-gray-500">Verified</p>
//           </Card>
//           <Card className="p-3 text-center">
//             <p className="text-xl font-bold text-red-600">{stats.slaBreached || 0}</p>
//             <p className="text-xs text-gray-500">SLA Breached</p>
//           </Card>
//         </div>
//       )}

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
//               placeholder="Search by ticket #, title, or customer..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
//             className="px-3 py-2 border rounded-lg"
//           >
//             <option value="">All Status</option>
//             {COMPLAINT_STATUS.map(s => (
//               <option key={s.value} value={s.value}>{s.label}</option>
//             ))}
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
//             className="px-3 py-2 border rounded-lg"
//           >
//             <option value="">All Priority</option>
//             {PRIORITY_OPTIONS.map(p => (
//               <option key={p.value} value={p.value}>{p.label}</option>
//             ))}
//           </select>
//         </div>
//       </Card>

//       {/* Complaints Table */}
//       <Card className="overflow-hidden">
//         <Table
//           columns={columns}
//           data={complaints}
//           isLoading={loading}
//           onRowClick={(row) => navigate(`/complaints/${row._id}`)}
//           emptyMessage="No complaints found"
//         />
//         <Pagination
//           currentPage={pagination.page}
//           totalPages={pagination.pages}
//           totalItems={pagination.total}
//           itemsPerPage={pagination.limit}
//           onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
//         />
//       </Card>
//     </div>
//   );
// };

// export default ComplaintList;



// client/src/pages/complaints/ComplaintList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi } from '../../api/complaint.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import SearchBar from '../../components/common/SearchBar';

const ComplaintList = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [complaints, setComplaints] = useState([]);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchComplaints();
    fetchStats();
  }, [filters.page, filters.status, filters.priority, filters.search]);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        search: filters.search || undefined
      };
      
      const response = await complaintApi.getComplaints(params);
      
      if (response.data && response.data.success) {
        setComplaints(response.data.data?.complaints || []);
        setPagination(response.data.data?.pagination || pagination);
      }
    } catch (error) {
      console.error('Fetch complaints error:', error);
      showToast('Failed to load complaints', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await complaintApi.getDashboardStats();
      if (response.data && response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      verified: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return badges[priority] || badges.medium;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaints</h1>
          <p className="text-gray-500 mt-1">Manage customer complaints and issues</p>
        </div>
        <Link to="/complaints/new">
          <Button>+ Raise Complaint</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-yellow-600">{stats.open || 0}</p>
          <p className="text-xs text-gray-500">Open</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{stats.assigned || 0}</p>
          <p className="text-xs text-gray-500">Assigned</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-green-600">{stats.completed || 0}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-red-600">{stats.slaBreached || 0}</p>
          <p className="text-xs text-gray-500">SLA Breached</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(value) => setFilters(prev => ({ ...prev, search: value, page: 1 }))}
              placeholder="Search by ticket number, title, or customer..."
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value, page: 1 }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* Complaints Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticket #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {complaint.ticketNumber}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                      <div className="text-xs text-gray-500 truncate max-w-xs">{complaint.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(complaint.status)}`}>
                        {complaint.status?.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {complaint.customerName || complaint.customerId?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link 
                        to={`/complaints/${complaint._id}`} 
                        className="text-blue-600 hover:text-blue-800"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No complaints found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">Page {pagination.page} of {pagination.pages}</span>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComplaintList;