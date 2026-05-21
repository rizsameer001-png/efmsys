// client/src/constants/complaintCategories.js
export const COMPLAINT_CATEGORIES = [
  { value: 'electrical', label: '⚡ Electrical', icon: '⚡', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'plumbing', label: '💧 Plumbing', icon: '💧', color: 'bg-blue-100 text-blue-800' },
  { value: 'cleaning', label: '🧹 Cleaning', icon: '🧹', color: 'bg-green-100 text-green-800' },
  { value: 'security', label: '🔒 Security', icon: '🔒', color: 'bg-red-100 text-red-800' },
  { value: 'hvac', label: '❄️ HVAC', icon: '❄️', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'internet', label: '🌐 Internet', icon: '🌐', color: 'bg-purple-100 text-purple-800' },
  { value: 'parking', label: '🅿️ Parking', icon: '🅿️', color: 'bg-gray-100 text-gray-800' },
  { value: 'lift', label: '🛗 Lift/Elevator', icon: '🛗', color: 'bg-orange-100 text-orange-800' },
  { value: 'water_leakage', label: '💦 Water Leakage', icon: '💦', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'other', label: '📝 Other', icon: '📝', color: 'bg-gray-100 text-gray-800' }
];

export const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 Low', color: 'bg-green-100 text-green-800', sla: '48 hours' },
  { value: 'medium', label: '🟡 Medium', color: 'bg-yellow-100 text-yellow-800', sla: '24 hours' },
  { value: 'high', label: '🟠 High', color: 'bg-orange-100 text-orange-800', sla: '8 hours' },
  { value: 'urgent', label: '🔴 Urgent', color: 'bg-red-100 text-red-800', sla: '4 hours' }
];

export const COMPLAINT_STATUS = [
  { value: 'open', label: 'Open', color: 'bg-blue-100 text-blue-800', icon: '📋' },
  { value: 'assigned', label: 'Assigned', color: 'bg-purple-100 text-purple-800', icon: '👤' },
  { value: 'in_progress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800', icon: '🔄' },
  { value: 'waiting_parts', label: 'Waiting Parts', color: 'bg-orange-100 text-orange-800', icon: '⏳' },
  { value: 'completed', label: 'Completed', color: 'bg-green-100 text-green-800', icon: '✅' },
  { value: 'verified', label: 'Verified', color: 'bg-teal-100 text-teal-800', icon: '✓' },
  { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800', icon: '🔒' }
];