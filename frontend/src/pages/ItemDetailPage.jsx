import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

const MILLISECONDS_IN_A_DAY = 1000 * 60 * 60 * 24;

const parseDate = (dateString) => {
  if (!dateString) {
    return null;
  }

  return new Date(`${dateString}T00:00:00`);
};

const ItemDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [item, setItem] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isItemLoading, setIsItemLoading] = useState(true);
  const [itemError, setItemError] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");

  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const todayDate = useMemo(() => new Date().toISOString().split("T")[0], []);
  const isInvalidBookingAction =
    !startDate || !endDate || startDate >= endDate || isBooking;

  useEffect(() => {
    let isMounted = true;

    const fetchItem = async () => {
      setIsItemLoading(true);
      setItemError("");

      try {
        const response = await api.get(`/items/${id}`);
        const data = response?.data?.data;

        if (isMounted) {
          setItem(data || null);
          if (data?.images?.length) {
            setSelectedImage(data.images[0]);
          } else {
            setSelectedImage("");
          }
        }
      } catch (apiError) {
        if (isMounted) {
          const message =
            apiError?.response?.data?.message || "Failed to fetch item details";
          setItemError(message);
        }
      } finally {
        if (isMounted) {
          setIsItemLoading(false);
        }
      }
    };

    fetchItem();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const bookingPreview = useMemo(() => {
    if (!item || !startDate || !endDate) {
      return { numberOfDays: 0, totalPrice: 0 };
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end || start >= end) {
      return { numberOfDays: 0, totalPrice: 0 };
    }

    const numberOfDays = Math.ceil((end - start) / MILLISECONDS_IN_A_DAY);
    const totalPrice = item.pricePerDay * numberOfDays;

    return { numberOfDays, totalPrice };
  }, [item, startDate, endDate]);

  const validateDates = () => {
    if (!startDate) {
      setDateError("Please select a start date");
      return false;
    }

    if (!endDate) {
      setDateError("Please select an end date");
      return false;
    }

    const start = parseDate(startDate);
    const end = parseDate(endDate);

    if (!start || !end || start >= end) {
      setDateError("Start date must be before end date");
      return false;
    }

    setDateError("");
    return true;
  };

  const handleBookNow = async () => {
    setBookingError("");
    setBookingSuccess("");

    const isDateValid = validateDates();
    if (!isDateValid) {
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    setIsBooking(true);

    try {
      const response = await api.post("/bookings", {
        item: id,
        startDate,
        endDate,
      });

      const bookingId = response?.data?.data?._id || response?.data?.data?.id;

      if (!bookingId) {
        throw new Error("Booking created but booking id is missing");
      }

      navigate(`/payment/${bookingId}`);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to create booking";
      setBookingError(message);
    } finally {
      setIsBooking(false);
    }
  };

  if (isItemLoading) {
    return (
      <p className="mx-auto w-full max-w-5xl text-sm text-slate-600">
        Loading item details...
      </p>
    );
  }

  if (itemError) {
    return (
      <p className="mx-auto w-full max-w-5xl text-sm text-rose-600">
        {itemError}
      </p>
    );
  }

  if (!item) {
    return (
      <p className="mx-auto w-full max-w-5xl text-sm text-slate-600">
        Item not found
      </p>
    );
  }

  const imageList = item.images?.length ? item.images : [null];
  const activeImage = selectedImage || imageList[0];

  const closeZoomModal = () => {
    setIsZoomOpen(false);
    setZoomLevel(1);
  };

  return (
    <>
      <section className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-surface-container-low shadow-lg">
            <img
              src={getImageUrl(activeImage, item.category)}
              alt={item.title}
              onClick={() => setIsZoomOpen(true)}
              className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute left-6 top-6 rounded-full bg-on-surface/70 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md">
              Available
            </div>
          </div>

          {imageList.length > 1 ? (
            <div className="grid grid-cols-5 gap-3">
              {imageList.map((imagePath, index) => {
                const isSelected = imagePath === activeImage;

                return (
                  <button
                    key={`${imagePath}-${index}`}
                    type="button"
                    onClick={() => setSelectedImage(imagePath)}
                    className={`aspect-square overflow-hidden rounded-xl transition ${
                      isSelected
                        ? "ring-2 ring-primary shadow-sm"
                        : "bg-surface-container-low opacity-95 hover:opacity-80"
                    }`}
                  >
                    <img
                      src={getImageUrl(imagePath, item.category)}
                      alt={`${item.title} preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}

          <div className="space-y-3 pt-2">
            <h3 className="font-headline text-2xl font-bold text-on-surface">
              Description
            </h3>
            <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant">
              {item.description}
            </p>
          </div>
        </div>

        <div className="sticky top-24 rounded-2xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/15 lg:col-span-5">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-sm">school</span>
              {item.category}
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              {item.title}
            </h1>
          </div>

          <div className="mb-8 mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Price per day
              </p>
              <p className="font-headline text-xl font-bold text-primary">
                ₹ {item.pricePerDay}
              </p>
            </div>
            <div className="rounded-xl bg-surface-container-low p-4">
              <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                Security deposit
              </p>
              <p className="font-headline text-xl font-bold text-on-surface">
                ₹ {item.securityDeposit}
              </p>
            </div>
          </div>

          <div className="mb-8 space-y-4">
            <label className="block text-sm font-semibold text-on-surface">
              Select dates
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <span className="ml-1 block text-[10px] font-bold uppercase text-on-surface-variant">
                  Start Date
                </span>
                <input
                  id="startDate"
                  type="date"
                  min={todayDate}
                  value={startDate}
                  onChange={(event) => {
                    setStartDate(event.target.value);
                    setDateError("");
                  }}
                  className="w-full rounded-lg border-0 bg-surface-container-low p-3 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1.5">
                <span className="ml-1 block text-[10px] font-bold uppercase text-on-surface-variant">
                  End Date
                </span>
                <input
                  id="endDate"
                  type="date"
                  min={todayDate}
                  value={endDate}
                  onChange={(event) => {
                    setEndDate(event.target.value);
                    setDateError("");
                  }}
                  className="w-full rounded-lg border-0 bg-surface-container-low p-3 text-sm outline-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            {dateError ? (
              <p className="text-sm text-error">{dateError}</p>
            ) : null}
          </div>

          <div className="mb-8 rounded-xl border border-dashed border-outline-variant bg-surface-bright p-4 text-sm">
            <p className="flex items-center justify-between text-on-surface-variant">
              <span>Number of days:</span>
              <span className="font-bold text-on-surface">
                {bookingPreview.numberOfDays || 0}
              </span>
            </p>
            <p className="mt-2 flex items-center justify-between border-t border-outline-variant/10 pt-2 text-lg">
              <span className="font-semibold text-on-surface">
                Total price:
              </span>
              <span className="font-headline font-extrabold text-primary">
                ₹ {bookingPreview.totalPrice || 0}
              </span>
            </p>
          </div>

          {bookingError ? (
            <p className="mb-3 text-sm text-error">{bookingError}</p>
          ) : null}
          {bookingSuccess ? (
            <p className="mb-3 text-sm text-emerald-600">{bookingSuccess}</p>
          ) : null}

          <button
            type="button"
            onClick={handleBookNow}
            disabled={isInvalidBookingAction}
            className="mb-8 w-full rounded-full bg-gradient-to-r from-primary to-primary-container py-4 font-headline text-lg font-bold text-white shadow-lg shadow-primary/20 transition-all duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isBooking ? "Booking..." : "Book Now"}
          </button>

          <div className="border-t border-outline-variant/20 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high font-bold text-on-surface-variant">
                {item.owner?.name ? item.owner.name.slice(0, 1) : "O"}
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Owner
                </p>
                {item.owner?.name ? (
                  <p className="font-bold text-on-surface">{item.owner.name}</p>
                ) : null}
                {item.owner?.email ? (
                  <p className="text-xs font-medium text-primary">
                    {item.owner.email}
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {isZoomOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closeZoomModal}
        >
          <div
            className="rounded-lg bg-white p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getImageUrl(activeImage, item.category)}
              alt="Zoomed item"
              style={{ transform: `scale(${zoomLevel})` }}
              className="max-h-[80vh] max-w-[90vw] object-contain transition"
            />

            <div className="mt-3 flex justify-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setZoomLevel((previous) => Math.min(previous + 0.2, 3))
                }
                className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
              >
                +
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoomLevel((previous) => Math.max(previous - 0.2, 1))
                }
                className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
              >
                -
              </button>
            </div>

            <div className="mt-3 flex justify-center">
              <button
                type="button"
                onClick={closeZoomModal}
                className="rounded bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ItemDetailPage;
