const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  action: { type: String, required: true },
  module: { type: String, required: true },
  description: { type: String, required: true },
  resourceId: { type: String },
  resourceType: { type: String },
  oldValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  status: { type: String, enum: ['success', 'failure'], default: 'success' },
  errorMessage: { type: String },
  requestMethod: { type: String },
  requestUrl: { type: String },
  responseTime: { type: Number }, // in milliseconds
  createdAt: { type: Date, default: Date.now, index: true }
});

// Create indexes for better query performance
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1, module: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ username: 1 });

// Static method to get stats
auditLogSchema.statics.getStats = async function(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = new Date(startDate);
    if (endDate) match.createdAt.$lte = new Date(endDate);
  }

  const stats = await this.aggregate([
    { $match: match },
    {
      $facet: {
        totalCount: [{ $count: 'count' }],
        byAction: [
          { $group: { _id: '$action', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        byModule: [
          { $group: { _id: '$module', count: { $sum: 1 } } },
          { $sort: { count: -1 } }
        ],
        byUser: [
          { $group: { _id: '$username', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ],
        byStatus: [
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ],
        dailyActivity: [
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              count: { $sum: 1 }
            }
          },
          { $sort: { _id: -1 } },
          { $limit: 30 }
        ]
      }
    }
  ]);

  return {
    totalLogs: stats[0].totalCount[0]?.count || 0,
    byAction: stats[0].byAction,
    byModule: stats[0].byModule,
    byUser: stats[0].byUser,
    byStatus: stats[0].byStatus,
    dailyActivity: stats[0].dailyActivity
  };
};

module.exports = mongoose.model('AuditLog', auditLogSchema);