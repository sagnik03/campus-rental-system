import { Link } from "react-router-dom";

import { getImageUrl } from "../utils/getImageUrl";

const ItemCard = ({ item }) => {
  const imageUrl = getImageUrl(item.images?.[0], item.category);

  return (
    <Link
      to={`/items/${item._id}`}
      className="group block overflow-hidden rounded-2xl bg-surface-container-lowest shadow-[0_24px_48px_rgba(25,28,30,0.06)] transition-all duration-300 hover:shadow-[0_32px_64px_rgba(25,28,30,0.12)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md">
          {item.category}
        </span>
        <span className="absolute bottom-4 right-4 rounded-xl bg-indigo-700 px-4 py-2 font-headline text-sm font-bold text-white shadow-lg shadow-indigo-900/25">
          ₹ {item.pricePerDay} / day
        </span>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <h2 className="line-clamp-1 font-headline text-xl font-bold text-on-surface">
            {item.title}
          </h2>
        </div>
        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-on-surface-variant">
          {item.description}
        </p>

        <button
          type="button"
          className="w-full rounded-xl border border-indigo-200 bg-indigo-50 py-3 font-semibold text-indigo-800 transition-colors group-hover:border-indigo-700 group-hover:bg-indigo-700 group-hover:text-white"
        >
          Rent Now
        </button>
      </div>
    </Link>
  );
};

export default ItemCard;
