import { useEffect, useRef, useState } from "react";

import ItemCard from "../components/ItemCard";
import api from "../services/api";

const HomePage = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const listingsRef = useRef(null);
  const howItWorksRef = useRef(null);

  const scrollToListings = () => {
    listingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    let isMounted = true;

    const fetchItems = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/items");
        const data = response?.data?.data || [];

        if (isMounted) {
          setItems(Array.isArray(data) ? data : []);
        }
      } catch (apiError) {
        if (isMounted) {
          const message =
            apiError?.response?.data?.message || "Failed to fetch items";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-20 px-2">
      <div className="rounded-3xl bg-surface-container-lowest px-6 py-14 text-center shadow-sm ring-1 ring-slate-200/60 md:px-10 md:py-20">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface md:text-6xl">
          Campus Item Rental <span className="text-primary">Marketplace</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-on-surface-variant">
          Borrow what you need, lend what you do not. A curated exchange for the
          modern university student ecosystem.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={scrollToListings}
            className="rounded-full bg-indigo-700 px-8 py-3.5 font-headline font-semibold text-white shadow-lg shadow-indigo-700/25 transition-all hover:bg-indigo-800 hover:shadow-xl"
          >
            Explore Marketplace
          </button>
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="rounded-full border border-slate-300 bg-white px-8 py-3.5 font-headline font-semibold text-slate-800 transition-all hover:border-indigo-300 hover:bg-indigo-50"
          >
            How it works
          </button>
        </div>
      </div>

      <div ref={listingsRef}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-on-surface">
              Featured Listings
            </h2>
            <p className="text-on-surface-variant">
              Handpicked items from your campus community.
            </p>
          </div>
          <p className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
            {items.length} items available
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading items...</p>
        ) : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="rounded-2xl bg-surface-container-lowest p-6 text-sm text-slate-600 ring-1 ring-slate-200">
            No items found
          </div>
        ) : null}

        {!isLoading && !error && items.length > 0 ? (
          <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-3">
            {items.map((item) => (
              <div key={item._id}>
                <ItemCard item={item} />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div
        ref={howItWorksRef}
        className="rounded-3xl border border-outline-variant/15 bg-white px-8 py-10 shadow-sm md:px-12"
      >
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-semibold text-on-surface">
            How it works
          </h2>
          <p className="mt-1 text-on-surface-variant">
            Renting on CampusRent is simple and secure.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
              Step 1
            </p>
            <h3 className="font-headline text-xl font-bold text-slate-900">
              Discover
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Browse listings, open an item, and compare rent, deposit, and
              owner details.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
              Step 2
            </p>
            <h3 className="font-headline text-xl font-bold text-slate-900">
              Book
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Select your dates and create a booking request instantly from the
              item page.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-200/70">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-indigo-600">
              Step 3
            </p>
            <h3 className="font-headline text-xl font-bold text-slate-900">
              Pay & Collect
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Upload payment proof, wait for confirmation, then coordinate
              pickup with the owner.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
