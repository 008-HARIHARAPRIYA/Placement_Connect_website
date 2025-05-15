
import React, { useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

// Sample Data
const rows = [
  { id: 1, name: 'Alice', age: 25, role: 'Developer' , cgpa:'8.5'},
  { id: 2, name: 'Bob', age: 30, role: 'Designer', cgpa:'9.5' },
  { id: 3, name: 'Charlie', age: 35, role: 'Manager', cgpa:'7.5' },
  { id: 4, name: 'David', age: 28, role: 'Developer', cgpa:'8.1' },
  { id: 5, name: 'Eve', age: 22, role: 'Intern', cgpa:'8.9' },
];

// Columns for DataGrid
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'age', headerName: 'Age', width: 100, type: 'number' },
  { field: 'role', headerName: 'Role', width: 150 },
  { field: 'cgpa', headerName: 'CGPA', width: 150 },
];

const DataGridWithFiltering = () => {
  const [data, setData] = useState(rows);

  // Custom filter logic
  const handleFilter = (query) => {
    const filteredData = rows.filter(
      (row) =>
        row.name.toLowerCase().includes(query.toLowerCase()) ||
        row.role.toLowerCase().includes(query.toLowerCase())||row.cgpa.toLowerCase().includes(query.toLowerCase())
    );
    setData(filteredData);
  };

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Employee Data
      </Typography>

      {/* Filter Input */}
      <Box sx={{ marginBottom: 2 }}>
        <input
          type="text"
          placeholder="Search by Name or Role..."
          onChange={(e) => handleFilter(e.target.value)}
          style={{
            padding: '8px',
            width: '100%',
            borderRadius: '4px',
            border: '1px solid #ccc',
          }}
        />
      </Box>

      {/* Data Grid */}
      <DataGrid
        rows={data}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        components={{
          Toolbar: GridToolbar, // Optional: Toolbar for built-in filtering/sorting
        }}
        checkboxSelection
        disableSelectionOnClick
      />
    </Box>
  );
};

export default DataGridWithFiltering;