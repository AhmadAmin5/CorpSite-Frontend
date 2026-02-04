import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Skeleton } from '../';

const Table = ({
  columns = [],
  data = [],
  keyExtractor = (item) => item._id,
  isLoading = false,
  isFetching = false,
  emptyMessage = 'No data found.',
  pagination = null, // { currentPage, totalPages, onPageChange }
}) => {
  return (
    <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden flex flex-col h-full">
      <div className="overflow-x-auto grow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-(--secondary)/5 border-b border-(--border) text-xs uppercase text-(--secondary)">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-4 font-semibold whitespace-nowrap ${col.className || ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody
            className={`divide-y divide-(--border) ${isFetching ? 'opacity-50 transition-opacity duration-200' : ''}`}
          >
            {isLoading ? (
              // Skeleton Loading State
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 align-middle ${col.className || ''}`}
                    >
                      <Skeleton className="h-4 w-full max-w-[80%] rounded-md" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-(--secondary)"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              // Data Rows
              data.map((row, rowIndex) => (
                <tr
                  key={keyExtractor(row) || rowIndex}
                  className={`group hover:bg-(--secondary)/5 transition-colors`}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 align-middle ${col.className || ''}`}
                    >
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="p-4 border-t border-(--border) flex justify-between items-center bg-(--background)">
          <span className="text-sm text-(--secondary)">
            Page{' '}
            <span className="font-medium text-(--foreground)">
              {pagination.currentPage}
            </span>{' '}
            of{' '}
            <span className="font-medium text-(--foreground)">
              {pagination.totalPages || 1}
            </span>
          </span>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="ghost"
              disabled={pagination.currentPage <= 1 || isLoading || isFetching}
              onClick={() =>
                pagination.onPageChange(Math.max(1, pagination.currentPage - 1))
              }
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={
                pagination.currentPage >= pagination.totalPages ||
                isLoading ||
                isFetching
              }
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
