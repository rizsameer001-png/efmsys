// client/src/pages/customer/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import { paymentApi } from '../../api/payment.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const PaymentHistory = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPaid: 0,
    pendingAmount: 0,
    lastPayment: null,
    nextDue: null
  });
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    status: 'all'
  });

  const years = [2023, 2024, 2025, 2026];
  const statusOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' }
  ];

  useEffect(() => {
    fetchPaymentHistory();
  }, [filters.year, filters.status]);

  const fetchPaymentHistory = async () => {
    setLoading(true);
    try {
      const response = await paymentApi.getMyPayments({
        year: filters.year,
        status: filters.status !== 'all' ? filters.status : undefined
      });
      if (response.data.success) {
        setPayments(response.data.data.payments || []);
        setSummary(response.data.data.summary);
      }
    } catch (error) {
      console.error('Fetch payment history error:', error);
      showToast('Failed to load payment history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.pending;
  };

  const downloadReceipt = async (paymentId) => {
    try {
      const response = await paymentApi.downloadReceipt(paymentId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${paymentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Receipt downloaded', 'success');
    } catch (error) {
      showToast('Failed to download receipt', 'error');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-500 mt-1">Track your payments and dues</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalPaid)}</p>
          <p className="text-sm text-gray-500">Total Paid</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.pendingAmount)}</p>
          <p className="text-sm text-gray-500">Pending Amount</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Last Payment</p>
          <p className="font-medium">{summary.lastPayment ? formatCurrency(summary.lastPayment.amount) : '-'}</p>
          <p className="text-xs text-gray-400">{summary.lastPayment ? formatDate(summary.lastPayment.date) : '-'}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-sm text-gray-500">Next Due Date</p>
          <p className="font-medium">{summary.nextDue ? formatDate(summary.nextDue) : '-'}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <Button onClick={fetchPaymentHistory}>Apply Filters</Button>
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(payment.date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {payment.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.method || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {payment.status === 'paid' && (
                        <button
                          onClick={() => downloadReceipt(payment._id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Receipt
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No payment records found
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

export default PaymentHistory;