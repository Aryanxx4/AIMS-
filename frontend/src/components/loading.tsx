export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      {/* Spinner */}
      <div
        className="w-16 h-16 border-8 border-t-transparent border-primary rounded-full animate-spin"
        aria-label="Loading"
        role="status"
      ></div>

      {/* Loading Text */}
      {/* <p className="text-lg font-medium text-primary/90 animate-pulse">
        Loading, please wait...
      </p> */}
    </div>
  );
}
