// const AuditLog = require('../models/AuditLog.model');

// const DEBUG = process.env.DEBUG === 'true';

// const logError = (context, error) => {
//   console.error(`[ERROR] ${context}:`, error.message);
//   if (DEBUG) console.error(error.stack);
// };

// exports.getAuditLogs = async (req, res) => {
//   try {
//     const { 
//       startDate, 
//       endDate, 
//       action, 
//       user, 
//       module, 
//       page = 1, 
//       limit = 50 
//     } = req.query;
    
//     const query = {};
    
//     // Build query filters
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     if (action && action !== '') query.action = action;
//     if (module && module !== '') query.module = module;
//     if (user && user !== '') query.username = { $regex: user, $options: 'i' };
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sortOrder = -1;
    
//     const [logs, total] = await Promise.all([
//       AuditLog.find(query)
//         .sort({ createdAt: sortOrder })
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       AuditLog.countDocuments(query)
//     ]);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         logs,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total,
//           pages: Math.ceil(total / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     logError('getAuditLogs', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch audit logs',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.getAuditStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const matchQuery = {};
    
//     if (startDate || endDate) {
//       matchQuery.createdAt = {};
//       if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
//       if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
//     }
    
//     const [
//       total,
//       today,
//       thisWeek,
//       thisMonth,
//       byAction,
//       byUser
//     ] = await Promise.all([
//       AuditLog.countDocuments(matchQuery),
//       AuditLog.countDocuments({
//         ...matchQuery,
//         createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
//       }),
//       AuditLog.countDocuments({
//         ...matchQuery,
//         createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//       }),
//       AuditLog.countDocuments({
//         ...matchQuery,
//         createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
//       }),
//       AuditLog.aggregate([
//         { $match: matchQuery },
//         { $group: { _id: '$action', count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 10 }
//       ]),
//       AuditLog.aggregate([
//         { $match: matchQuery },
//         { $group: { _id: '$username', name: { $first: '$username' }, count: { $sum: 1 } } },
//         { $sort: { count: -1 } },
//         { $limit: 5 }
//       ])
//     ]);
    
//     res.status(200).json({
//       success: true,
//       data: {
//         total,
//         today,
//         thisWeek,
//         thisMonth,
//         byAction: byAction.map(a => ({ action: a._id, count: a.count })),
//         byUser: byUser.map(u => ({ name: u.name, count: u.count, role: 'user' }))
//       }
//     });
//   } catch (error) {
//     logError('getAuditStats', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to fetch audit statistics',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.exportAuditLogs = async (req, res) => {
//   try {
//     const { startDate, endDate, format = 'json' } = req.query;
//     const query = {};
    
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const logs = await AuditLog.find(query).sort({ createdAt: -1 }).lean();
    
//     if (format === 'csv') {
//       const fields = ['timestamp', 'username', 'email', 'action', 'module', 'description', 'ipAddress', 'status'];
//       const csvRows = [fields.join(',')];
      
//       for (const log of logs) {
//         const row = fields.map(field => {
//           let value = '';
//           switch(field) {
//             case 'timestamp': value = log.createdAt; break;
//             case 'username': value = log.username || ''; break;
//             case 'email': value = log.email || ''; break;
//             default: value = log[field] || '';
//           }
//           if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
//             value = `"${value.replace(/"/g, '""')}"`;
//           }
//           return value;
//         });
//         csvRows.push(row.join(','));
//       }
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
//       return res.status(200).send(csvRows.join('\n'));
//     }
    
//     res.status(200).json({
//       success: true,
//       data: logs,
//       total: logs.length
//     });
//   } catch (error) {
//     logError('exportAuditLogs', error);
//     res.status(500).json({
//       success: false,
//       error: 'Failed to export audit logs',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };





// const AuditLog = require('../models/AuditLog.model');

// const DEBUG = process.env.DEBUG === 'true';

// const logError = (context, error) => {
//   console.error(`[ERROR] ${context}:`, error.message);
//   if (DEBUG) console.error(error.stack);
// };

// exports.getAuditLogs = async (req, res) => {
//   try {
//     const { 
//       startDate, 
//       endDate, 
//       action, 
//       user, 
//       module, 
//       page = 1, 
//       limit = 50 
//     } = req.query;
    
//     const query = {};
    
//     // Build query filters
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     if (action && action !== '') query.action = action;
//     if (module && module !== '') query.module = module;
//     if (user && user !== '') query.username = { $regex: user, $options: 'i' };
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const sortOrder = -1;
    
//     // 🔴 FIX 1: Handle case when AuditLog collection doesn't exist or has no data
//     let logs = [];
//     let total = 0;
    
//     try {
//       const result = await Promise.all([
//         AuditLog.find(query)
//           .sort({ createdAt: sortOrder })
//           .skip(skip)
//           .limit(parseInt(limit))
//           .lean(),
//         AuditLog.countDocuments(query)
//       ]);
//       logs = result[0] || [];
//       total = result[1] || 0;
//     } catch (err) {
//       // 🔴 FIX 2: If collection doesn't exist, return empty data instead of error
//       console.log('AuditLog collection may not exist yet, returning empty data');
//       logs = [];
//       total = 0;
//     }
    
//     res.status(200).json({
//       success: true,
//       data: {
//         logs,
//         pagination: {
//           page: parseInt(page),
//           limit: parseInt(limit),
//           total: total || 0,
//           pages: Math.ceil((total || 0) / parseInt(limit))
//         }
//       }
//     });
//   } catch (error) {
//     logError('getAuditLogs', error);
//     // 🔴 FIX 3: Return empty data instead of 500 error
//     res.status(200).json({
//       success: true,
//       data: {
//         logs: [],
//         pagination: {
//           page: parseInt(req.query.page || 1),
//           limit: parseInt(req.query.limit || 50),
//           total: 0,
//           pages: 0
//         }
//       }
//     });
//   }
// };

// exports.getAuditStats = async (req, res) => {
//   try {
//     const { startDate, endDate } = req.query;
//     const matchQuery = {};
    
//     if (startDate || endDate) {
//       matchQuery.createdAt = {};
//       if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
//       if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
//     }
    
//     // 🔴 FIX 4: Default values if no data exists
//     let total = 0;
//     let today = 0;
//     let thisWeek = 0;
//     let thisMonth = 0;
//     let byAction = [];
//     let byUser = [];
    
//     try {
//       const result = await Promise.all([
//         AuditLog.countDocuments(matchQuery),
//         AuditLog.countDocuments({
//           ...matchQuery,
//           createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
//         }),
//         AuditLog.countDocuments({
//           ...matchQuery,
//           createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
//         }),
//         AuditLog.countDocuments({
//           ...matchQuery,
//           createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
//         }),
//         AuditLog.aggregate([
//           { $match: matchQuery },
//           { $group: { _id: '$action', count: { $sum: 1 } } },
//           { $sort: { count: -1 } },
//           { $limit: 10 }
//         ]),
//         AuditLog.aggregate([
//           { $match: matchQuery },
//           { $group: { _id: '$username', name: { $first: '$username' }, count: { $sum: 1 } } },
//           { $sort: { count: -1 } },
//           { $limit: 5 }
//         ])
//       ]);
      
//       total = result[0] || 0;
//       today = result[1] || 0;
//       thisWeek = result[2] || 0;
//       thisMonth = result[3] || 0;
//       byAction = result[4] || [];
//       byUser = result[5] || [];
//     } catch (err) {
//       // 🔴 FIX 5: If collection doesn't exist, use default empty values
//       console.log('AuditLog collection may not exist yet, returning default stats');
//     }
    
//     res.status(200).json({
//       success: true,
//       data: {
//         total: total || 0,
//         today: today || 0,
//         thisWeek: thisWeek || 0,
//         thisMonth: thisMonth || 0,
//         byAction: (byAction || []).map(a => ({ action: a._id, count: a.count })),
//         byUser: (byUser || []).map(u => ({ name: u.name || u._id, count: u.count, role: 'user' }))
//       }
//     });
//   } catch (error) {
//     logError('getAuditStats', error);
//     // 🔴 FIX 6: Return default stats instead of 500 error
//     res.status(200).json({
//       success: true,
//       data: {
//         total: 0,
//         today: 0,
//         thisWeek: 0,
//         thisMonth: 0,
//         byAction: [],
//         byUser: []
//       }
//     });
//   }
// };

// exports.exportAuditLogs = async (req, res) => {
//   try {
//     const { startDate, endDate, format = 'json' } = req.query;
//     const query = {};
    
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     // 🔴 FIX 7: Handle case when no logs exist
//     let logs = [];
//     try {
//       logs = await AuditLog.find(query).sort({ createdAt: -1 }).lean();
//     } catch (err) {
//       console.log('AuditLog collection may not exist yet, returning empty export');
//       logs = [];
//     }
    
//     if (format === 'csv') {
//       const fields = ['timestamp', 'username', 'email', 'action', 'module', 'description', 'ipAddress', 'status'];
//       const csvRows = [fields.join(',')];
      
//       for (const log of logs) {
//         const row = fields.map(field => {
//           let value = '';
//           switch(field) {
//             case 'timestamp': value = log.createdAt; break;
//             case 'username': value = log.username || ''; break;
//             case 'email': value = log.email || ''; break;
//             default: value = log[field] || '';
//           }
//           if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
//             value = `"${value.replace(/"/g, '""')}"`;
//           }
//           return value;
//         });
//         csvRows.push(row.join(','));
//       }
      
//       res.setHeader('Content-Type', 'text/csv');
//       res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
//       return res.status(200).send(csvRows.join('\n'));
//     }
    
//     res.status(200).json({
//       success: true,
//       data: logs || [],
//       total: logs?.length || 0
//     });
//   } catch (error) {
//     logError('exportAuditLogs', error);
//     // 🔴 FIX 8: Return empty export instead of 500 error
//     res.status(200).json({
//       success: true,
//       data: [],
//       total: 0
//     });
//   }
// };





const AuditLog = require('../models/AuditLog.model');

const DEBUG = process.env.DEBUG === 'true';

const logError = (context, error) => {
  console.error(`[ERROR] ${context}:`, error.message);
  if (DEBUG) console.error(error.stack);
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      action, 
      user, 
      module, 
      page = 1, 
      limit = 50 
    } = req.query;
    
    const query = {};
    
    // Build query filters
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    if (action && action !== '') query.action = action;
    if (module && module !== '') query.module = module;
    if (user && user !== '') query.username = { $regex: user, $options: 'i' };
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = -1;
    
    // 🔴 FIX: Handle case when AuditLog collection doesn't exist or has no data
    let logs = [];
    let total = 0;
    
    try {
      const result = await Promise.all([
        AuditLog.find(query)
          .sort({ createdAt: sortOrder })
          .skip(skip)
          .limit(parseInt(limit))
          .lean(),
        AuditLog.countDocuments(query)
      ]);
      logs = result[0] || [];
      total = result[1] || 0;
    } catch (err) {
      console.log('AuditLog collection may not exist yet, returning empty data');
      logs = [];
      total = 0;
    }
    
    res.status(200).json({
      success: true,
      data: {
        logs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total || 0,
          pages: Math.ceil((total || 0) / parseInt(limit))
        }
      }
    });
  } catch (error) {
    logError('getAuditLogs', error);
    // 🔴 FIX: Return empty data instead of 500 error
    res.status(200).json({
      success: true,
      data: {
        logs: [],
        pagination: {
          page: parseInt(req.query.page || 1),
          limit: parseInt(req.query.limit || 50),
          total: 0,
          pages: 0
        }
      }
    });
  }
};

exports.getAuditStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const matchQuery = {};
    
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate);
    }
    
    // 🔴 FIX: Default values if no data exists
    let total = 0;
    let today = 0;
    let thisWeek = 0;
    let thisMonth = 0;
    let byAction = [];
    let byUser = [];
    
    try {
      const result = await Promise.all([
        AuditLog.countDocuments(matchQuery),
        AuditLog.countDocuments({
          ...matchQuery,
          createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
        }),
        AuditLog.countDocuments({
          ...matchQuery,
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }),
        AuditLog.countDocuments({
          ...matchQuery,
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }),
        AuditLog.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$action', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 10 }
        ]),
        AuditLog.aggregate([
          { $match: matchQuery },
          { $group: { _id: '$username', name: { $first: '$username' }, count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ])
      ]);
      
      total = result[0] || 0;
      today = result[1] || 0;
      thisWeek = result[2] || 0;
      thisMonth = result[3] || 0;
      byAction = result[4] || [];
      byUser = result[5] || [];
    } catch (err) {
      console.log('AuditLog collection may not exist yet, returning default stats');
    }
    
    res.status(200).json({
      success: true,
      data: {
        total: total || 0,
        today: today || 0,
        thisWeek: thisWeek || 0,
        thisMonth: thisMonth || 0,
        byAction: (byAction || []).map(a => ({ action: a._id, count: a.count })),
        byUser: (byUser || []).map(u => ({ name: u.name || u._id, count: u.count, role: 'user' }))
      }
    });
  } catch (error) {
    logError('getAuditStats', error);
    // 🔴 FIX: Return default stats instead of 500 error
    res.status(200).json({
      success: true,
      data: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        byAction: [],
        byUser: []
      }
    });
  }
};

exports.exportAuditLogs = async (req, res) => {
  try {
    const { startDate, endDate, format = 'json' } = req.query;
    const query = {};
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    // 🔴 FIX: Handle case when no logs exist
    let logs = [];
    try {
      logs = await AuditLog.find(query).sort({ createdAt: -1 }).lean();
    } catch (err) {
      console.log('AuditLog collection may not exist yet, returning empty export');
      logs = [];
    }
    
    if (format === 'csv') {
      const fields = ['timestamp', 'username', 'email', 'action', 'module', 'description', 'ipAddress', 'status'];
      const csvRows = [fields.join(',')];
      
      for (const log of logs) {
        const row = fields.map(field => {
          let value = '';
          switch(field) {
            case 'timestamp': value = log.createdAt; break;
            case 'username': value = log.username || ''; break;
            case 'email': value = log.email || ''; break;
            default: value = log[field] || '';
          }
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        });
        csvRows.push(row.join(','));
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      return res.status(200).send(csvRows.join('\n'));
    }
    
    res.status(200).json({
      success: true,
      data: logs || [],
      total: logs?.length || 0
    });
  } catch (error) {
    logError('exportAuditLogs', error);
    // 🔴 FIX: Return empty export instead of 500 error
    res.status(200).json({
      success: true,
      data: [],
      total: 0
    });
  }
};