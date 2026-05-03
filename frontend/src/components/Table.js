import React from 'react';

const Table = ({ columns, data, actions }) => {
  if (!data || data.length === 0) return <p style={{ color: 'var(--text-muted)' }}>No records found.</p>;

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((col, index) => <th key={index}>{col.label}</th>)}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="actions">
                    {actions(row)}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
