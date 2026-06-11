import { Spinner } from "@/components/ui/loading";

export default function AuthLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <Spinner size="lg" label="Loading authentication" />
        <p className="mt-4 text-sm text-neutral-500">Loading...</p>
      </div>
    </div>
  );
}
