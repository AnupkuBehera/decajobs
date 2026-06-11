import { Skeleton } from "@/components/ui/loading";

export default function CandidateLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4 sm:p-6">
      {/* Page title skeleton */}
      <Skeleton height="2rem" width="12rem" rounded="md" />

      {/* Content cards skeleton */}
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
          <Skeleton height="1.25rem" width="60%" rounded="md" className="mb-4" />
          <Skeleton height="1rem" width="80%" rounded="md" className="mb-2" />
          <Skeleton height="1rem" width="70%" rounded="md" className="mb-2" />
          <Skeleton height="1rem" width="50%" rounded="md" />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
          <Skeleton height="1.25rem" width="40%" rounded="md" className="mb-4" />
          <Skeleton height="1rem" width="90%" rounded="md" className="mb-2" />
          <Skeleton height="1rem" width="75%" rounded="md" />
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
          <Skeleton height="1.25rem" width="55%" rounded="md" className="mb-4" />
          <Skeleton height="1rem" width="85%" rounded="md" className="mb-2" />
          <Skeleton height="1rem" width="65%" rounded="md" />
        </div>
      </div>
    </div>
  );
}
