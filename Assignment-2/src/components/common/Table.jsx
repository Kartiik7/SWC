import React from 'react';
import Loader from './Loader';

const Table = ({
  headers = [],
  data = [],
  renderRow,
  loading = false,
  emptyMessage = 'No data available',
}) => {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-gray-800 bg-brand-card">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-800 bg-gray-900/60">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {loading ? (
            <tr>
              <td colSpan={headers.length} className="py-12">
                <Loader message="Fetching table data..." />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-12 text-center text-sm text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr 
                key={idx} 
                className="hover:bg-gray-800/30 transition-colors"
              >
                {renderRow(item, idx)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
