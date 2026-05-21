// server/src/seeders/seed-db.js
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/user.model');
const Role = require('../models/role.model');
const Permission = require('../models/permission.model');
const Building = require('../models/building.model');
const Unit = require('../models/unit.model');
const Customer = require('../models/customer.model');

// Constants
const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  ACCOUNTANT: 'accountant',
  SUPERVISOR: 'supervisor',
  TECHNICIAN: 'technician',
  CUSTOMER: 'customer',
};

const DEPARTMENTS = {
  OPERATIONS: 'operations',
  TECHNICAL: 'technical',
  HOUSEKEEPING: 'housekeeping',
  SECURITY: 'security',
  MANAGEMENT: 'management',
  HR: 'hr',
  FINANCE: 'finance',
};

const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
};

const EMPLOYMENT_TYPES = {
  FULL_TIME: 'full_time',
  PART_TIME: 'part_time',
  CONTRACT: 'contract',
  INTERN: 'intern',
};

// Default roles
const defaultRoles = [
  { name: ROLES.SUPER_ADMIN, displayName: 'Super Administrator', description: 'Full system access', level: 100, isSystemRole: true },
  { name: ROLES.ADMIN, displayName: 'Administrator', description: 'Operational management', level: 90, isSystemRole: true },
  { name: ROLES.HR, displayName: 'HR Manager', description: 'Employee and payroll management', level: 85, isSystemRole: true },
  { name: ROLES.MANAGER, displayName: 'Manager', description: 'Team management', level: 80, isSystemRole: true },
  { name: ROLES.ACCOUNTANT, displayName: 'Accountant', description: 'Finance and billing', level: 75, isSystemRole: true },
  { name: ROLES.SUPERVISOR, displayName: 'Supervisor', description: 'Field supervision', level: 70, isSystemRole: true },
  { name: ROLES.TECHNICIAN, displayName: 'Technician', description: 'Task execution', level: 50, isSystemRole: true },
  { name: ROLES.CUSTOMER, displayName: 'Customer', description: 'Resident portal access', level: 10, isSystemRole: true },
];

// Default permissions
const defaultPermissions = [
  { name: 'user.create', module: 'users', action: 'create', description: 'Create users' },
  { name: 'user.read', module: 'users', action: 'read', description: 'View users' },
  { name: 'user.update', module: 'users', action: 'update', description: 'Update users' },
  { name: 'user.delete', module: 'users', action: 'delete', description: 'Delete users' },
  { name: 'user.export', module: 'users', action: 'export', description: 'Export users' },
  { name: 'role.create', module: 'roles', action: 'create', description: 'Create roles' },
  { name: 'role.read', module: 'roles', action: 'read', description: 'View roles' },
  { name: 'role.update', module: 'roles', action: 'update', description: 'Update roles' },
  { name: 'role.delete', module: 'roles', action: 'delete', description: 'Delete roles' },
  { name: 'building.create', module: 'buildings', action: 'create', description: 'Create buildings' },
  { name: 'building.read', module: 'buildings', action: 'read', description: 'View buildings' },
  { name: 'building.update', module: 'buildings', action: 'update', description: 'Update buildings' },
  { name: 'building.delete', module: 'buildings', action: 'delete', description: 'Delete buildings' },
  { name: 'complaint.create', module: 'complaints', action: 'create', description: 'Create complaints' },
  { name: 'complaint.read', module: 'complaints', action: 'read', description: 'View complaints' },
  { name: 'complaint.update', module: 'complaints', action: 'update', description: 'Update complaints' },
  { name: 'complaint.delete', module: 'complaints', action: 'delete', description: 'Delete complaints' },
  { name: 'complaint.assign', module: 'complaints', action: 'assign', description: 'Assign complaints' },
  { name: 'task.create', module: 'tasks', action: 'create', description: 'Create tasks' },
  { name: 'task.read', module: 'tasks', action: 'read', description: 'View tasks' },
  { name: 'task.update', module: 'tasks', action: 'update', description: 'Update tasks' },
  { name: 'task.delete', module: 'tasks', action: 'delete', description: 'Delete tasks' },
  { name: 'task.assign', module: 'tasks', action: 'assign', description: 'Assign tasks' },
  { name: 'task.approve', module: 'tasks', action: 'approve', description: 'Approve tasks' },
  { name: 'attendance.read', module: 'attendance', action: 'read', description: 'View attendance' },
  { name: 'attendance.approve', module: 'attendance', action: 'approve', description: 'Approve attendance' },
  { name: 'leave.create', module: 'leaves', action: 'create', description: 'Apply leave' },
  { name: 'leave.read', module: 'leaves', action: 'read', description: 'View leaves' },
  { name: 'leave.approve', module: 'leaves', action: 'approve', description: 'Approve leaves' },
  { name: 'payroll.read', module: 'payroll', action: 'read', description: 'View payroll' },
  { name: 'payroll.create', module: 'payroll', action: 'create', description: 'Process payroll' },
  { name: 'payroll.approve', module: 'payroll', action: 'approve', description: 'Approve payroll' },
  { name: 'payroll.export', module: 'payroll', action: 'export', description: 'Export payroll' },
  { name: 'report.read', module: 'reports', action: 'read', description: 'View reports' },
  { name: 'report.export', module: 'reports', action: 'export', description: 'Export reports' },
  { name: 'settings.read', module: 'settings', action: 'read', description: 'View settings' },
  { name: 'settings.update', module: 'settings', action: 'update', description: 'Update settings' },
  { name: 'notification.send', module: 'notifications', action: 'create', description: 'Send notifications' },
  { name: 'notification.read', module: 'notifications', action: 'read', description: 'View notifications' },
];

// Demo Buildings
const demoBuildings = [
  { name: 'Downtown Tower', code: 'DTT001', type: 'commercial', address: { street: '123 Business Avenue', city: 'Dubai', country: 'UAE' }, statistics: { totalFloors: 20, totalUnits: 200 }, status: 'active' },
  { name: 'Riverside Residences', code: 'RVR002', type: 'residential', address: { street: '45 Creek Road', city: 'Dubai', country: 'UAE' }, statistics: { totalFloors: 15, totalUnits: 150 }, status: 'active' },
  { name: 'Tech Hub', code: 'TCH003', type: 'office', address: { street: '88 Innovation Street', city: 'Dubai', country: 'UAE' }, statistics: { totalFloors: 25, totalUnits: 250 }, status: 'active' }
];

// Demo Customers - WITHOUT customerId (will be auto-generated)
const demoCustomers = [
  { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', phone: '+971501234567', isRegistered: false, registrationMethod: 'admin' },
  { firstName: 'Sarah', lastName: 'Johnson', email: 'sarah.johnson@example.com', phone: '+971502345678', isRegistered: false, registrationMethod: 'admin' },
  { firstName: 'Mike', lastName: 'Chen', email: 'mike.chen@example.com', phone: '+971503456789', isRegistered: false, registrationMethod: 'admin' },
  { firstName: 'Emily', lastName: 'Brown', email: 'emily.brown@example.com', phone: '+971504567890', isRegistered: false, registrationMethod: 'admin' },
];

// Demo Users
const demoUsers = [
  { firstName: 'Super', lastName: 'Admin', email: 'superadmin@fms.com', phone: '+971500000001', role: ROLES.SUPER_ADMIN, designation: 'System Administrator', department: DEPARTMENTS.MANAGEMENT, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'Admin', lastName: 'User', email: 'admin@fms.com', phone: '+971500000002', role: ROLES.ADMIN, designation: 'Facility Manager', department: DEPARTMENTS.OPERATIONS, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'HR', lastName: 'Manager', email: 'hr@fms.com', phone: '+971500000003', role: ROLES.HR, designation: 'HR Manager', department: DEPARTMENTS.HR, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'Finance', lastName: 'Manager', email: 'accountant@fms.com', phone: '+971500000004', role: ROLES.ACCOUNTANT, designation: 'Finance Manager', department: DEPARTMENTS.FINANCE, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'John', lastName: 'Manager', email: 'manager@fms.com', phone: '+971500000005', role: ROLES.MANAGER, designation: 'Operations Manager', department: DEPARTMENTS.OPERATIONS, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'Mike', lastName: 'Supervisor', email: 'supervisor@fms.com', phone: '+971500000006', role: ROLES.SUPERVISOR, designation: 'Field Supervisor', department: DEPARTMENTS.TECHNICAL, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'David', lastName: 'Technician', email: 'technician1@fms.com', phone: '+971500000007', role: ROLES.TECHNICIAN, designation: 'Lead Technician', department: DEPARTMENTS.TECHNICAL, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
  { firstName: 'Lisa', lastName: 'Wong', email: 'technician2@fms.com', phone: '+971500000008', role: ROLES.TECHNICIAN, designation: 'Junior Technician', department: DEPARTMENTS.TECHNICAL, employeeType: EMPLOYMENT_TYPES.FULL_TIME, status: USER_STATUS.ACTIVE, password: 'Admin@123', emailVerified: true, phoneVerified: true },
];

const hashPassword = async (password) => bcrypt.hash(password, 10);

const seedDatabase = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI not found in .env file');
    }
    
    console.log('🔄 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB Atlas');
    console.log('📊 Database:', mongoose.connection.name);

    console.log('🗑️ Clearing existing data...');
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
    await Building.deleteMany({});
    await Unit.deleteMany({});
    await Customer.deleteMany({});
    console.log('✅ Cleared all collections');

    console.log('🔐 Seeding permissions...');
    const permissions = await Permission.insertMany(defaultPermissions);
    console.log(`✅ Seeded ${permissions.length} permissions`);

    console.log('👥 Seeding roles...');
    const roles = await Role.insertMany(defaultRoles);
    console.log(`✅ Seeded ${roles.length} roles`);

    console.log('🏢 Seeding buildings...');
    const buildings = await Building.insertMany(demoBuildings);
    console.log(`✅ Seeded ${buildings.length} buildings`);

    console.log('👤 Seeding customers...');
    // Insert customers without customerId (will be auto-generated if needed)
    const customers = await Customer.insertMany(demoCustomers);
    console.log(`✅ Seeded ${customers.length} customers`);

    console.log('🏠 Seeding units...');
    let allUnits = [];
    let customerIndex = 0;
    
    for (const building of buildings) {
      for (let floor = 1; floor <= 3; floor++) {
        for (let unitNum = 1; unitNum <= 3; unitNum++) {
          const customer = customers[customerIndex % customers.length];
          const unit = new Unit({
            buildingId: building._id,
            floorNumber: floor,
            unitNumber: `${floor}0${unitNum}`,
            unitType: building.type === 'residential' ? 'apartment' : 'office',
            ownership: {
              ownerId: customer._id,
              ownerName: `${customer.firstName} ${customer.lastName}`,
              ownerEmail: customer.email,
              ownerPhone: customer.phone,
              ownershipStartDate: new Date(),
            },
            occupancy: { status: 'owner_occupied' },
            status: 'active'
          });
          await unit.save();
          allUnits.push(unit);
          customerIndex++;
        }
      }
    }
    console.log(`✅ Seeded ${allUnits.length} units`);

    console.log('👨‍💼 Seeding users...');
    for (const userData of demoUsers) {
      const hashedPassword = await hashPassword(userData.password);
      const user = new User({ 
        ...userData, 
        password: hashedPassword, 
        joiningDate: new Date(),
        shiftTiming: { start: '09:00', end: '18:00' },
        assignedBuildings: buildings.map(b => b._id),
        emailVerified: true,
        phoneVerified: true
      });
      await user.save();
    }
    console.log(`✅ Seeded ${demoUsers.length} users`);

    // Update customers with owned units
    console.log('🔄 Updating customer owned units...');
    for (const customer of customers) {
      const customerUnits = allUnits.filter(unit => unit.ownership.ownerId?.toString() === customer._id.toString());
      if (customerUnits.length > 0) {
        customer.ownedUnits = customerUnits.map(unit => ({
          unitId: unit._id,
          buildingId: unit.buildingId,
          unitNumber: unit.unitNumber,
          buildingName: buildings.find(b => b._id.toString() === unit.buildingId.toString())?.name,
          ownershipStartDate: new Date(),
          isActive: true,
        }));
        await customer.save();
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ DATABASE SEEDING COMPLETED!');
    console.log('='.repeat(60));
    console.log('\n📊 SUMMARY:');
    console.log(`   - Permissions: ${permissions.length}`);
    console.log(`   - Roles: ${roles.length}`);
    console.log(`   - Buildings: ${buildings.length}`);
    console.log(`   - Units: ${allUnits.length}`);
    console.log(`   - Customers: ${customers.length}`);
    console.log(`   - Users: ${demoUsers.length}`);

    console.log('\n👥 USER LOGIN CREDENTIALS:');
    console.log('-'.repeat(40));
    const uniqueUsers = [...new Map(demoUsers.map(u => [u.role, u])).values()];
    uniqueUsers.forEach(user => {
      console.log(`   ${user.role.toUpperCase()}:`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Password: ${user.password}`);
    });

    console.log('\n👤 CUSTOMERS:');
    console.log('-'.repeat(40));
    customers.forEach(customer => {
      console.log(`   ${customer.firstName} ${customer.lastName}:`);
      console.log(`     Email: ${customer.email}`);
      console.log(`     Units: ${customer.ownedUnits.length}`);
    });

    console.log('\n🔐 MongoDB Atlas Data Created Successfully!');
    console.log('='.repeat(60));
    
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Atlas');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 11000) {
      console.error('Duplicate key error. Please drop the database and try again.');
      console.error('You can drop the database from MongoDB Atlas UI.');
    }
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedDatabase();