// client/src/pages/buildings/BulkUnitImport.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import { useToast } from '../../hooks/useToast';

const BulkUnitImport = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [csvData, setCsvData] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setCsvData(text);
      parseCSV(text);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, idx) => {
        obj[header.trim()] = values[idx]?.trim();
      });
      return obj;
    });
    setPreview(data.slice(0, 5));
  };

  const handleImport = async () => {
    const units = parseCSVForImport(csvData);
    setLoading(true);
    try {
      const response = await buildingApi.bulkImportUnits(buildingId, units);
      showToast(`Imported ${response.data.data.success.length} units, ${response.data.data.failed.length} failed`, 'success');
      navigate(`/buildings/${buildingId}/units`);
    } catch (error) {
      showToast('Import failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const parseCSVForImport = (csv) => {
    const lines = csv.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
      const values = line.split(',');
      const unit = {};
      headers.forEach((header, idx) => {
        unit[header.trim()] = values[idx]?.trim();
      });
      return {
        floorNumber: parseInt(unit.floorNumber),
        unitNumber: unit.unitNumber,
        unitType: unit.unitType || 'apartment',
        ownerName: unit.ownerName,
        ownerEmail: unit.ownerEmail,
        ownerPhone: unit.ownerPhone,
        area: parseInt(unit.area),
        bedrooms: parseInt(unit.bedrooms),
        bathrooms: parseInt(unit.bathrooms)
      };
    });
  };

  const downloadTemplate = () => {
    const template = `floorNumber,unitNumber,unitType,ownerName,ownerEmail,ownerPhone,area,bedrooms,bathrooms
1,101,apartment,John Smith,john@example.com,+971501234567,1200,2,2
1,102,apartment,Jane Doe,jane@example.com,+971502345678,1100,1,1
2,201,office,ABC Corp,info@abccorp.com,+971503456789,2000,0,0`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'unit_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Unit Import</h1>
          <p className="text-gray-500">Import multiple units at once using CSV</p>
        </div>
        <Button variant="secondary" onClick={downloadTemplate}>
          Download Template
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📁</div>
            <p className="text-gray-600">Click to upload CSV file</p>
            <p className="text-sm text-gray-400">or drag and drop</p>
          </label>
        </div>
      </div>

      {preview.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Preview (First 5 rows)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(preview[0]).map(key => (
                    <th key={key} className="px-4 py-2 text-left text-xs font-medium text-gray-500">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val, i) => (
                      <td key={i} className="px-4 py-2 text-sm text-gray-900">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
        <Button onClick={handleImport} isLoading={loading} disabled={!csvData}>
          Import Units
        </Button>
      </div>
    </div>
  );
};

export default BulkUnitImport;