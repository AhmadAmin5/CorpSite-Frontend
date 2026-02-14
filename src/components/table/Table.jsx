import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Skeleton } from '../';

// --- Internal Mobile Components ---

const MobileCardSkeleton = () => (
  <div className="bg-(--card) border border-(--border) rounded-xl p-4 shadow-sm space-y-4">
    <div className="flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
    <div className="space-y-2 border-t border-(--border) pt-3">
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  </div>
);

const MobileDataCard = ({ row, columns }) => {
  // Strategy:
  // 1. Column[0] is the "Card Identity" (Header)
  // 2. The last column is "Actions" (Footer) IF its header is "Actions"
  // 3. All other columns are Key-Value pairs in the body

  const primaryCol = columns[0];
  const lastCol = columns[columns.length - 1];
  const hasActions =
    lastCol?.header === 'Actions' || lastCol?.className?.includes('text-right');

  const actionCol = hasActions ? lastCol : null;
  // Slice out the body columns (Excluding first and optional last)
  const bodyCols = columns.slice(1, hasActions ? -1 : undefined);

  return (
    <div className="bg-(--card) border border-(--border) rounded-xl p-4 shadow-sm flex flex-col gap-3">
      {/* 1. Card Header (Primary Column) */}
      <div className="pb-1">
        {primaryCol.render ? (
          primaryCol.render(row)
        ) : (
          <span className="font-semibold text-(--foreground)">
            {row[primaryCol.accessor]}
          </span>
        )}
      </div>

      {/* 2. Card Body (Key-Value Grid) */}
      {bodyCols.length > 0 && (
        <div className="space-y-2 border-t border-(--border) pt-3">
          {bodyCols.map((col, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center text-sm"
            >
              <span className="text-(--secondary) font-medium">
                {col.header}
              </span>
              <div className="text-right text-(--foreground)">
                {col.render ? col.render(row) : row[col.accessor]}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Card Footer (Actions) */}
      {actionCol && (
        <div className="border-t border-(--border) pt-3 flex justify-end">
          {actionCol.render ? actionCol.render(row) : row[actionCol.accessor]}
        </div>
      )}
    </div>
  );
};

// --- Main Component ---

const Table = ({
  columns = [],
  data = [],
  keyExtractor = (item) => item._id,
  isLoading = false,
  isFetching = false,
  emptyMessage = 'No data found.',
  pagination = null,
  className = '',
}) => {
  // Common Pagination Component
  const PaginationControl = () =>
    pagination && (
      <div className="p-4 border-t border-(--border) flex justify-between items-center bg-(--background) md:bg-(--card)">
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
            disabled={isLoading || pagination.currentPage <= 1}
            onClick={() =>
              pagination.onPageChange(Math.max(1, pagination.currentPage - 1))
            }
            text="Prev"
            icon={<ChevronLeft />}
          />

          <Button
            size="sm"
            variant="ghost"
            disabled={pagination.currentPage >= pagination.totalPages}
            isButtonLoading={isLoading || isFetching}
            onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
            text="Next"
            icon={<ChevronRight />}
            iconPosition="right"
          />
        </div>
      </div>
    );

  if (data.length === 0 && !isLoading) {
    return (
      <div
        className={`bg-(--card) rounded-xl border border-(--border) shadow-sm p-8 text-center text-(--secondary) ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* --- DESKTOP VIEW --- */}
      <div className="hidden md:flex bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden flex-col">
        <div className="px-3 overflow-x-auto grow">
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
              className={`divide-y divide-(--border) ${isFetching ? 'opacity-50 transition-opacity' : ''}`}
            >
              {isLoading
                ? Array.from({ length: 5 }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex} className="px-6 py-4">
                          <Skeleton className="h-4 w-full max-w-[80%] rounded-md" />
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((row, rowIndex) => (
                    <tr
                      key={keyExtractor(row) || rowIndex}
                      className="group hover:bg-(--secondary)/5 transition-colors"
                    >
                      {columns.map((col, colIndex) => (
                        <td
                          key={colIndex}
                          className={`px-1 py-4 align-middle ${col.className || ''}`}
                        >
                          {col.render ? col.render(row) : row[col.accessor]}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <PaginationControl />
      </div>

      {/* --- MOBILE VIEW --- */}
      <div className="md:hidden flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <MobileCardSkeleton key={i} />
          ))
        ) : (
          <>
            <div
              className={`flex flex-col gap-4 ${isFetching ? 'opacity-50' : ''}`}
            >
              {data.map((row) => (
                <MobileDataCard
                  key={keyExtractor(row)}
                  row={row}
                  columns={columns}
                />
              ))}
            </div>

            <div className="bg-(--card) border border-(--border) rounded-xl shadow-sm mt-2">
              <PaginationControl />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Table;
