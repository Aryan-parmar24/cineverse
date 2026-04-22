
const LoadingSkeleton = ({ type = 'card' }) => {
  if (type === 'card') {
    return (
      <div className="rounded-lg overflow-hidden">
        <div className="skeleton aspect-[2/3] w-full bg-gray-800 animate-pulse" />
        <div className="p-3 bg-gray-900">
          <div className="h-4 w-3/4 rounded bg-gray-800 animate-pulse mb-2" />
          <div className="h-3 w-1/2 rounded bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (type === 'detail') {
    return (
      <div className="pt-20 px-8">
        <div className="h-96 w-full rounded-xl bg-gray-800 animate-pulse mb-8" />
        <div className="h-10 w-1/2 rounded bg-gray-800 animate-pulse mb-4" />
        <div className="h-6 w-1/4 rounded bg-gray-800 animate-pulse mb-6" />
        <div className="h-24 w-full rounded bg-gray-800 animate-pulse" />
      </div>
    );
  }

  return <div className="w-full h-full rounded bg-gray-800 animate-pulse" />;
};

export default LoadingSkeleton;
