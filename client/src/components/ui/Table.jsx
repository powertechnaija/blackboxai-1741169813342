import React from 'react';
import Badge from './Badge';

const Table = ({
  columns,
  data,
  onRowClick,
  selectable,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  sortable = false,
  sortColumn,
  sortDirection,
  onSort,
  loading = false,
  emptyMessage = 'No data available',
  className = ''
}) => {
  // Handle row click
  const handleRowClick = (row, index) => {
    if (onRowClick) {
      onRowClick(row, index);
    }
  };

  // Handle row selection
  const handleSelectRow = (e, row, index) => {
    e.stopPropagation();
    if (onSelectRow) {
      onSelectRow(row, index);
    }
  };

  // Handle select all
  const handleSelectAll = (e) => {
    if (onSelectAll) {
      onSelectAll(e.target.checked);
    }
  };

  // Handle sort
  const handleSort = (column) => {
    if (sortable && column.sortable !== false && onSort) {
      onSort(column.key);
    }
  };

  // Get sort icon
  const getSortIcon = (column) => {
    if (!sortable || column.sortable === false) return null;
    
    if (sortColumn === column.key) {
      return sortDirection === 'asc' 
        ? <i className="fas fa-sort-up ml-1"></i>
        : <i className="fas fa-sort-down ml-1"></i>;
    }
    return <i className="fas fa-sort ml-1 text-gray-400"></i>;
  };

  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* Header */}
        <thead className="bg-gray-50">
          <tr>
            {/* Checkbox column */}
            {selectable && (
              <th scope="col" className="w-12 px-6 py-3">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  checked={selectedRows.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}

            {/* Data columns */}
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={`
                  px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                  ${sortable && column.sortable !== false ? 'cursor-pointer hover:text-gray-700' : ''}
                  ${column.className || ''}
                `}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center">
                  {column.label}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Loading...</span>
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                onClick={() => handleRowClick(row, rowIndex)}
                className={`
                  ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  ${selectedRows.includes(row.id || rowIndex) ? 'bg-primary-50' : ''}
                `}
              >
                {/* Checkbox column */}
                {selectable && (
                  <td className="w-12 px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={selectedRows.includes(row.id || rowIndex)}
                      onChange={(e) => handleSelectRow(e, row, rowIndex)}
                    />
                  </td>
                )}

                {/* Data columns */}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-4 whitespace-nowrap text-sm ${column.className || ''}`}
                  >
                    {column.render ? (
                      column.render(row[column.key], row)
                    ) : column.type === 'badge' ? (
                      <Badge variant={row[column.key].variant || 'primary'}>
                        {row[column.key].label}
                      </Badge>
                    ) : column.type === 'image' ? (
                      <img
                        src={row[column.key]}
                        alt=""
                        className="h-10 w-10 rounded-full"
                      />
                    ) : (
                      row[column.key]
                    )}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Example usage:
// const columns = [
//   {
//     key: 'id',
//     label: 'ID',
//     sortable: true
//   },
//   {
//     key: 'name',
//     label: 'Name',
//     sortable: true
//   },
//   {
//     key: 'status',
//     label: 'Status',
//     type: 'badge',
//     sortable: true
//   },
//   {
//     key: 'actions',
//     label: 'Actions',
//     sortable: false,
//     render: (_, row) => (
//       <button onClick={() => handleAction(row)}>
//         Edit
//       </button>
//     )
//   }
// ];
//
// <Table
//   columns={columns}
//   data={data}
//   sortable
//   sortColumn="name"
//   sortDirection="asc"
//   onSort={handleSort}
//   selectable
//   selectedRows={selectedRows}
//   onSelectRow={handleSelectRow}
//   onSelectAll={handleSelectAll}
//   onRowClick={handleRowClick}
// />

export default Table;
