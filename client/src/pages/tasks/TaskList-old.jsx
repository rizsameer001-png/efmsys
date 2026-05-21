// client/src/pages/tasks/TaskList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import SearchBar from '../../components/common/SearchBar';
import TaskFilters from '../../components/tasks/TaskFilters';  // ← Import from components
import SLAMonitor from '../../components/tasks/SLAMonitor';    // ← Import from components

const TaskList = () => {
  const navigate = useNavigate();
  // ... rest of the page component code
};

export default TaskList;