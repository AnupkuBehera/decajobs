import { Skeleton } from "@/components/ui/loading";

export default function EmployerLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Page title skeleton */}
      <Skeleton height="2rem" width="14rem" rounded="md" />

      {/* Job listing cards skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <Skeleton height="1.25rem" width="50%" rounded="md" />
              <Skeleton height="1.5rem" width="4rem" rounded="full" />
            </div>
            <Skeleton height="1rem" width="85%" rounded="md" className="mb-2" />
            <Skeleton height="1rem" width="60%" rounded="md" className="mb-3" />
            <div className="flex gap-2">
              <Skeleton height="2rem" width="5rem" rounded="md" />
              <Skeleton height="2rem" width="5rem" rounded="md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
