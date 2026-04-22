
const WhereToWatch = ({ providers }) => {
  if (!providers || !providers.results) return null;

  const countryData =
    providers.results['US'] ||
    providers.results['IN'] ||
    Object.values(providers.results)[0];

  if (!countryData) return null;

  const { flatrate, rent, buy, free } = countryData;

  const Section = ({ title, items, color }) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4">
        <p className={`text-xs font-bold mb-2 ${color}`}>{title}</p>
        <div className="flex flex-wrap gap-3">
          {items.map(provider => (
            <div
              key={provider.provider_id}
              className="flex items-center space-x-2 bg-gray-800 rounded-lg px-3 py-2"
              title={provider.provider_name}
            >
              <img
                src={`https://image.tmdb.org/t/p/w45${provider.logo_path}`}
                alt={provider.provider_name}
                className="w-8 h-8 rounded-md"
              />
              <span className="text-xs text-gray-300 hidden md:block">
                {provider.provider_name}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-900 rounded-xl p-6 mt-6">
      <h3 className="text-white font-bold text-lg mb-4 flex items-center space-x-2">
        <span>📺</span>
        <span>Where to Watch</span>
      </h3>
      <Section title="▶ STREAM" items={flatrate} color="text-green-400" />
      <Section title="🎬 FREE" items={free} color="text-blue-400" />
      <Section title="🛒 RENT" items={rent} color="text-yellow-400" />
      <Section title="💰 BUY" items={buy} color="text-orange-400" />
      {!flatrate && !rent && !buy && !free && (
        <p className="text-gray-500 text-sm">
          Not available for streaming in your region.
        </p>
      )}
    </div>
  );
};

export default WhereToWatch;
