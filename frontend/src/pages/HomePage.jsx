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
      <div className="rounded-3xl border border-border bg-card px-6 py-14 text-center shadow-md transition-all duration-200 md:px-10 md:py-20">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-textMain md:text-6xl">
          Campus Item Rental <span className="text-primary">Marketplace</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-textMain/75">
          Borrow what you need, lend what you do not. A curated exchange for the
          modern university student ecosystem.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={scrollToListings}
            className="rounded-full bg-primary px-8 py-3.5 font-headline font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
          >
            Explore Marketplace
          </button>
          <button
            type="button"
            onClick={scrollToHowItWorks}
            className="rounded-full border border-border bg-background px-8 py-3.5 font-headline font-semibold text-textMain transition-all duration-200 hover:brightness-105"
          >
            How it works
          </button>
        </div>
      </div>

      <div ref={listingsRef}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-textMain">
              Featured Listings
            </h2>
            <p className="text-textMain/75">
              Handpicked items from your campus community.
            </p>
          </div>
          <p className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-textMain/80">
            {items.length} items available
          </p>
        </div>

        {isLoading ? (
          <p className="text-sm text-textMain/75">Loading items...</p>
        ) : null}
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}

        {!isLoading && !error && items.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-6 text-sm text-textMain/75 shadow-md">
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
        className="rounded-3xl border border-border bg-card px-8 py-10 shadow-md transition-all duration-200 md:px-12"
      >
        <div className="mb-8">
          <h2 className="font-headline text-3xl font-semibold text-textMain">
            How it works
          </h2>
          <p className="mt-1 text-textMain/75">
            Renting on CampusRent is simple and secure.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background p-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Step 1
            </p>
            <h3 className="font-headline text-xl font-bold text-textMain">
              Discover
            </h3>
            <p className="mt-2 text-sm text-textMain/75">
              Browse listings, open an item, and compare rent, deposit, and
              owner details.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Step 2
            </p>
            <h3 className="font-headline text-xl font-bold text-textMain">
              Book
            </h3>
            <p className="mt-2 text-sm text-textMain/75">
              Select your dates and create a booking request instantly from the
              item page.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-background p-5 shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
            <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
              Step 3
            </p>
            <h3 className="font-headline text-xl font-bold text-textMain">
              Pay & Collect
            </h3>
            <p className="mt-2 text-sm text-textMain/75">
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
