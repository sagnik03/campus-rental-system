import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import api from "../services/api";

const formatDate = (value) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString();
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [itemTitle, setItemTitle] = useState("");
  const [isLoadingBooking, setIsLoadingBooking] = useState(true);
  const [bookingError, setBookingError] = useState("");

  const [screenshotFile, setScreenshotFile] = useState(null);
  const [transactionRef, setTransactionRef] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const screenshotInputRef = useRef(null);
  const redirectTimeoutRef = useRef(null);

  const screenshotPreviewUrl = useMemo(() => {
    if (!screenshotFile) {
      return "";
    }

    return URL.createObjectURL(screenshotFile);
  }, [screenshotFile]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    let isMounted = true;

    const fetchBookingDetails = async () => {
      setIsLoadingBooking(true);
      setBookingError("");

      try {
        const bookingResponse = await api.get(`/bookings/${bookingId}`);
        const bookingData = bookingResponse?.data?.data;

        if (!bookingData) {
          throw new Error("Booking details not found");
        }

        if (isMounted) {
          setBooking(bookingData);
        }

        const itemId =
          typeof bookingData.item === "string"
            ? bookingData.item
            : bookingData.item?._id;

        if (itemId) {
          const itemResponse = await api.get(`/items/${itemId}`);
          const itemData = itemResponse?.data?.data;

          if (isMounted) {
            setItemTitle(itemData?.title || "Item");
          }
        }
      } catch (apiError) {
        if (isMounted) {
          const message =
            apiError?.response?.data?.message ||
            apiError?.message ||
            "Failed to load booking details";
          setBookingError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingBooking(false);
        }
      }
    };

    fetchBookingDetails();

    return () => {
      isMounted = false;
    };
  }, [bookingId, navigate]);

  useEffect(() => {
    return () => {
      if (screenshotPreviewUrl) {
        URL.revokeObjectURL(screenshotPreviewUrl);
      }
    };
  }, [screenshotPreviewUrl]);

  useEffect(() => {
    if (!paymentSuccess) {
      return undefined;
    }

    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    redirectTimeoutRef.current = setTimeout(() => {
      navigate("/");
    }, 2000);

    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [paymentSuccess, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPaymentError("");
    setPaymentSuccess("");

    if (!screenshotFile) {
      setPaymentError("Screenshot is required");
      return;
    }

    if (!booking) {
      setPaymentError("Booking details are not available");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("booking", bookingId);
      formData.append("amount", String(booking.totalPrice));
      formData.append("screenshot", screenshotFile);

      if (transactionRef.trim()) {
        formData.append("transactionRef", transactionRef.trim());
      }

      await api.post("/payments", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setPaymentSuccess(
        "Payment submitted successfully. Waiting for owner confirmation.",
      );
      setScreenshotFile(null);
      if (screenshotInputRef.current) {
        screenshotInputRef.current.value = "";
      }
      setTransactionRef("");
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to submit payment";
      setPaymentError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <p className="mx-auto w-full max-w-4xl text-sm text-slate-600">
        Loading booking details...
      </p>
    );
  }

  if (bookingError) {
    return (
      <p className="mx-auto w-full max-w-4xl text-sm text-rose-600">
        {bookingError}
      </p>
    );
  }

  if (!booking) {
    return (
      <p className="mx-auto w-full max-w-4xl text-sm text-slate-600">
        Booking not found
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-4">
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">
          Complete Payment
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Upload payment screenshot for manual verification by the item owner.
        </p>

        <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
          <p>
            <span className="font-medium text-slate-900">Item:</span>{" "}
            {itemTitle || "Item"}
          </p>
          <p>
            <span className="font-medium text-slate-900">Amount:</span> ₹{" "}
            {booking.totalPrice}
          </p>
          <p>
            <span className="font-medium text-slate-900">Start date:</span>{" "}
            {formatDate(booking.startDate)}
          </p>
          <p>
            <span className="font-medium text-slate-900">End date:</span>{" "}
            {formatDate(booking.endDate)}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Upload Screenshot
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="screenshot"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Payment Screenshot
            </label>
            <input
              ref={screenshotInputRef}
              id="screenshot"
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/webp"
              required
              onChange={(event) => {
                setPaymentError("");
                setScreenshotFile(event.target.files?.[0] || null);
              }}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
            />
          </div>

          {screenshotPreviewUrl ? (
            <div>
              <p className="mb-1 text-sm font-medium text-slate-700">Preview</p>
              <img
                src={screenshotPreviewUrl}
                alt="Payment screenshot preview"
                className="h-48 w-full rounded-md object-cover sm:w-80"
              />
            </div>
          ) : null}

          <div>
            <label
              htmlFor="transactionRef"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Transaction Reference (optional)
            </label>
            <input
              id="transactionRef"
              type="text"
              value={transactionRef}
              onChange={(event) => setTransactionRef(event.target.value)}
              placeholder="UPI/transaction reference"
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-slate-900/20 focus:ring"
            />
          </div>
        </div>

        {paymentError ? (
          <p className="mt-4 text-sm text-rose-600">{paymentError}</p>
        ) : null}
        {paymentSuccess ? (
          <p className="mt-4 text-sm text-emerald-600">{paymentSuccess}</p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting || !screenshotFile}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Uploading..." : "Submit Payment"}
          </button>

          <Link
            to="/"
            className="rounded-md border border-slate-300 px-4 py-2 text-center text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Back to Home
          </Link>
        </div>
      </form>
    </section>
  );
};

export default PaymentPage;
