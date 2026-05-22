const AuditLog = require('../models/AuditLog');

// Get audit logs with filters
exports.getAuditLogs = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      action,
      user,
      module,
      page = 1,
      limit = 50,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query = {};

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Action filter
    if (action) query.action = action;

    // Module filter
    if (module) query.module = module;

    // User filter
    if (user) query.username = { $regex: user, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('userId', 'username email avatar'),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        filters: { startDate, endDate, action, user, module }
      }
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit logs'
    });
  }
};

// Get audit statistics
exports.getAuditStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const stats = await AuditLog.getStats(startDate, endDate);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get audit stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit statistics'
    });
  }
};

// Get available actions (for filter dropdown)
exports.getAvailableActions = async (req, res) => {
  try {
    const actions = await AuditLog.distinct('action');
    const modules = await AuditLog.distinct('module');
    
    res.json({
      success: true,
      data: { actions, modules }
    });
  } catch (error) {
    console.error('Get available actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch available filters'
    });
  }
};

// Export audit logs
exports.exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    
    const query = {};
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'username email');

    if (format === 'csv') {
      // Generate CSV
      const fields = ['timestamp', 'username', 'email', 'action', 'module', 'description', 'ipAddress', 'status'];
      const csvRows = [fields.join(',')];
      
      for (const log of logs) {
        const row = fields.map(field => {
          let value = '';
          switch(field) {
            case 'timestamp': value = log.createdAt; break;
            case 'username': value = log.username; break;
            case 'email': value = log.email; break;
            default: value = log[field] || '';
          }
          // Escape quotes and wrap in quotes if contains comma
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvRows.push(row.join(','));
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      return res.send(csvRows.join('\n'));
    } else {
      // Default JSON format
      res.json({
        success: true,
        data: logs,
        total: logs.length
      });
    }
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs'
    });
  }
};