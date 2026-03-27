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
      <p className="mx-auto w-full max-w-4xl text-sm text-textMain/75">
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
      <p className="mx-auto w-full max-w-4xl text-sm text-textMain/75">
        Booking not found
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-4">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
        <h1 className="text-2xl font-semibold text-textMain">
          Complete Payment
        </h1>
        <p className="mt-2 text-sm text-textMain/75">
          Upload payment screenshot for manual verification by the item owner.
        </p>

        <div className="mt-4 grid gap-2 text-sm text-textMain/80 sm:grid-cols-2">
          <p>
            <span className="font-medium text-textMain">Item:</span>{" "}
            {itemTitle || "Item"}
          </p>
          <p>
            <span className="font-medium text-textMain">Amount:</span> ₹{" "}
            {booking.totalPrice}
          </p>
          <p>
            <span className="font-medium text-textMain">Start date:</span>{" "}
            {formatDate(booking.startDate)}
          </p>
          <p>
            <span className="font-medium text-textMain">End date:</span>{" "}
            {formatDate(booking.endDate)}
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-card p-6 shadow-md"
      >
        <h2 className="text-lg font-semibold text-textMain">
          Upload Screenshot
        </h2>

        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="screenshot"
              className="mb-1 block text-sm font-medium text-textMain/80"
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
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-textMain"
            />
          </div>

          {screenshotPreviewUrl ? (
            <div>
              <p className="mb-1 text-sm font-medium text-textMain/80">
                Preview
              </p>
              <img
                src={screenshotPreviewUrl}
                alt="Payment screenshot preview"
                className="h-48 w-full rounded-xl border border-border object-cover sm:w-80"
              />
            </div>
          ) : null}

          <div>
            <label
              htmlFor="transactionRef"
              className="mb-1 block text-sm font-medium text-textMain/80"
            >
              Transaction Reference (optional)
            </label>
            <input
              id="transactionRef"
              type="text"
              value={transactionRef}
              onChange={(event) => setTransactionRef(event.target.value)}
              placeholder="UPI/transaction reference"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {paymentError ? (
          <p className="mt-4 text-sm text-rose-600">{paymentError}</p>
        ) : null}
        {paymentSuccess ? (
          <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">
            {paymentSuccess}
          </p>
        ) : null}

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={isSubmitting || !screenshotFile}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Uploading..." : "Submit Payment"}
          </button>

          <Link
            to="/"
            className="rounded-xl border border-border px-4 py-2 text-center text-sm font-medium text-textMain transition-all duration-200 hover:bg-background"
          >
            Back to Home
          </Link>
        </div>
      </form>
    </section>
  );
};

export default PaymentPage;
