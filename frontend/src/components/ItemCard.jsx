import { Link } from "react-router-dom";

import { getImageUrl } from "../utils/getImageUrl";

const ItemCard = ({ item }) => {
  const imageUrl = getImageUrl(item.images?.[0], item.category);

  return (
    <Link
      to={`/items/${item._id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
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
        <span className="absolute bottom-4 right-4 rounded-xl bg-primary px-4 py-2 font-headline text-sm font-bold text-white shadow-md">
          ₹ {item.pricePerDay} / day
        </span>
      </div>

      <div className="p-6">
        <div className="mb-2">
          <h2 className="line-clamp-1 font-headline text-xl font-bold text-textMain">
            {item.title}
          </h2>
        </div>
        <p className="mb-6 line-clamp-2 text-sm leading-relaxed text-textMain/70">
          {item.description}
        </p>

        <button
          type="button"
          className="w-full rounded-xl border border-border bg-background py-3 font-semibold text-textMain transition-all duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white"
        >
          Rent Now
        </button>
      </div>
    </Link>
  );
};

export default ItemCard;
