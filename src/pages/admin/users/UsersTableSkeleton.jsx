import { Skeleton } from '../../../components';

const UsersTableSkeleton = () => {
  return (
    <div className="bg-(--card) rounded-xl border border-(--border) shadow-sm overflow-hidden flex flex-col h-full">
      <div className="border-b border-(--border) bg-(--secondary)/5 px-6 py-4 flex gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-4 w-24" />
        ))}
      </div>

      <div className="divide-y divide-(--border)">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4 w-1/3">
              <Skeleton className="w-10 h-10 rounded-full shrink-0" />{' '}
              {/* Avatar */}
              <div className="space-y-2 w-full">
                <Skeleton className="h-4 w-3/4" /> {/* Name */}
                <Skeleton className="h-3 w-1/2" /> {/* Email */}
              </div>
            </div>

            <div className="w-1/6">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>

            <div className="w-1/6">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            <div className="w-1/6 flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersTableSkeleton;
