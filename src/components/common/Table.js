import React, { useMemo, useEffect } from 'react';
import { useTable, useSortBy, usePagination, useGlobalFilter } from 'react-table';
import { TODO_URL } from '../../constants/common';
import axios from "axios"
import { useQuery } from 'react-query';

const Table = ({ columns, data, onEdit, onDelete, onIsAdding, header='' }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state,
    setGlobalFilter,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );
  const { pageIndex, pageSize, globalFilter } = state;
  const pKey="_id";

  const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
  };

  const handlePageChange = (e) => {
    const page = e.target.value ? Number(e.target.value) - 1 : 0;
    gotoPage(page);
  };

  const tableColumns = useMemo(() => columns, [columns]);
  const tableData = useMemo(() => page, [page]);

  // const fetchData = async () => {
  //   const response = await  axios.get(TODO_URL , {
  //     params: {
  //       page: pageIndex + 1,
  //       per_page: pageSize,
  //     },
  //   });
  //   const data = await response.json();
  //   console.log("data", data)
  //   return data;
  // };

  // const { newData, isLoading, error } = useQuery('newData', fetchData);
  // console.log("newData", newData);

  useEffect(() => {
    // fetchData();
  }, [pageIndex, pageSize]);


  return (
    <div>
    <div className='d-flex justify-content-between align-items-center'>
      <div className='d-flex align-items-center'>
        {onIsAdding && <button onClick={() => onIsAdding(true)} disabled={!canNextPage} className="btn btn-outline-dark m-1">
          +
        </button>}
      </div>
      <h1>{header}</h1>
      <input
        type="text"
        value={globalFilter || ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Search..."
        className='w-25'
      />
    </div>
    <table {...getTableProps()} style={{ borderCollapse: 'collapse' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} style={{ borderBottom: '1px solid #ccc' }}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                {column.render('Header')}
                <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
              </th>
            ))}
            <th style={{ padding: '8px', cursor: 'pointer' }}
            >Actions</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {tableData.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} style={{ borderBottom: '1px solid #ccc' }}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()} style={{ padding: '8px' }}>
                  {cell.render('Cell')}
                </td>
              ))}
              <td {...row.cells[0].getCellProps()} style={{ padding: '8px' }}
              >
                <button
                    onClick={() => onEdit(row._id)}
                    className="btn btn-primary m-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(row._id)}
                    className="btn btn-danger m-1"
                  >
                    Delete
                  </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <div className='d-flex justify-content-between align-items-center'>
      <select value={pageSize} onChange={handlePageSizeChange} className='w-25'>
          {[5, 10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
      </select>
      <div className='d-flex align-items-center'>
        Page&nbsp;
        <input
          type="number"
          value={pageIndex + 1}
          onChange={handlePageChange}
          style={{ width: '50px', textAlign: 'center' }}
        />{' '}
        &nbsp;of {pageOptions.length}
      </div>
      <span>
      <button onClick={() => previousPage()} disabled={!canPreviousPage} className="btn btn-outline-dark m-1">
        &lt;
      </button>
      <button onClick={() => nextPage()} disabled={!canNextPage} className="btn btn-outline-dark m-1">
        &gt;
      </button>
      </span>
    </div>
  </div>
  );
};

export default Table;