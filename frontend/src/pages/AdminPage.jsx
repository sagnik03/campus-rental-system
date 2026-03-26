import { useEffect, useState } from "react";

import useAuthUser from "../hooks/useAuthUser";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

const TABS = ["users", "items", "bookings", "payments"];

const AdminPage = () => {
  const { isAuthenticated, isAdmin } = useAuthUser();

  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState({
    users: [],
    items: [],
    bookings: [],
    payments: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmingPaymentId, setConfirmingPaymentId] = useState("");
  const [rejectingPaymentId, setRejectingPaymentId] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const openPreview = (imagePath) => {
    setPreviewImage(imagePath);
    setZoomLevel(1);
  };

  const closePreview = () => {
    setPreviewImage(null);
    setZoomLevel(1);
  };

  const getStatusBadgeClassName = (status) => {
    if (status === "confirmed") {
      return "bg-emerald-100 text-emerald-700 ring-emerald-200";
    }

    if (status === "pending") {
      return "bg-amber-100 text-amber-700 ring-amber-200";
    }

    return "bg-slate-100 text-slate-700 ring-slate-200";
  };

  const fetchTabData = async (tabName) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get(`/admin/${tabName}`);
      const collection = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];

      setData((previousData) => ({
        ...previousData,
        [tabName]: collection,
      }));
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || `Failed to fetch ${tabName}`;
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    setError("");
    setSuccessMessage("");
    setConfirmingPaymentId(paymentId);

    try {
      await api.patch(`/payments/${paymentId}/confirm`);
      setSuccessMessage("Payment confirmed successfully.");
      await fetchTabData("payments");
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to confirm payment";
      setError(message);
    } finally {
      setConfirmingPaymentId("");
    }
  };

  const handleRejectPayment = async (paymentId) => {
    setError("");
    setSuccessMessage("");
    setRejectingPaymentId(paymentId);

    try {
      await api.patch(`/payments/${paymentId}/reject`);
      setSuccessMessage("Payment rejected successfully.");
      await fetchTabData("payments");
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to reject payment";
      setError(message);
    } finally {
      setRejectingPaymentId("");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return;
    }

    fetchTabData(activeTab);
  }, [activeTab, isAuthenticated, isAdmin]);

  const handleDeleteItem = async (itemId) => {
    const isConfirmed = window.confirm("Delete this item as admin?");
    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/admin/items/${itemId}`);
      setData((previousData) => ({
        ...previousData,
        items: previousData.items.filter((item) => item._id !== itemId),
      }));
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to delete item";
      setError(message);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/20">
        <h1 className="font-headline text-3xl font-bold text-on-surface">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-rose-600">
          Please login to access admin dashboard.
        </p>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto w-full max-w-4xl rounded-2xl bg-surface-container-lowest p-8 shadow-sm ring-1 ring-outline-variant/20">
        <h1 className="font-headline text-3xl font-bold text-on-surface">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-rose-600">
          You are not allowed to access this page.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-surface-container-lowest p-8 shadow-sm md:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/5 blur-3xl" />
        <h1 className="relative z-10 font-headline text-4xl font-bold tracking-tight text-on-surface md:text-5xl">
          Admin Dashboard
        </h1>
        <p className="relative z-10 mt-3 max-w-2xl text-on-surface-variant">
          Manage users, listings, bookings and payments.
        </p>
      </div>

      <div className="flex w-fit flex-wrap gap-2 rounded-full bg-surface-container-low p-1.5">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-8 py-2.5 font-headline text-sm font-semibold capitalize transition-all duration-300 ${
              activeTab === tab
                ? "bg-primary text-on-primary shadow-lg shadow-primary/20"
                : "text-on-surface-variant hover:bg-surface-container-high"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {isLoading ? (
        <p className="text-sm text-slate-600">Loading {activeTab}...</p>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {successMessage ? (
        <p className="text-sm text-emerald-600">{successMessage}</p>
      ) : null}

      {!isLoading ? (
        <div className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm ring-1 ring-outline-variant/20">
          {activeTab === "users" ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-low/50">
                <tr className="text-on-surface-variant">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Role
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                {data.users.map((user) => (
                  <tr
                    key={user._id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-6 py-4 font-headline font-semibold text-on-surface">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 capitalize text-on-surface">
                      {user.role}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {activeTab === "items" ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-low/50">
                <tr className="text-on-surface-variant">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Price/day
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                {data.items.map((item) => (
                  <tr
                    key={item._id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-6 py-4 font-headline font-semibold text-on-surface">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {item.owner?.email || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-on-surface">
                      ₹ {item.pricePerDay}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item._id)}
                        className="rounded-xl border border-error-container px-3 py-2 text-error transition-colors hover:bg-error/5"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {activeTab === "bookings" ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-low/50">
                <tr className="text-on-surface-variant">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                {data.bookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-6 py-4 font-headline font-semibold text-on-surface">
                      {booking.item?.title || booking.item}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {booking.user?.email || booking.user}
                    </td>
                    <td className="px-6 py-4 text-on-surface">
                      ₹ {booking.totalPrice}
                    </td>
                    <td className="px-6 py-4 capitalize text-on-surface">
                      {booking.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}

          {activeTab === "payments" ? (
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-low/50">
                <tr className="text-on-surface-variant">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Booking
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Payer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Screenshot
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-variant/30">
                {data.payments.map((payment) => (
                  <tr
                    key={payment._id}
                    className="transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-6 py-4 text-on-surface">
                      {payment.booking?._id || payment.booking || "-"}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {payment.payer?.email || payment.payer}
                    </td>
                    <td className="px-6 py-4 text-on-surface">
                      ₹ {payment.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ${getStatusBadgeClassName(
                          payment.status,
                        )}`}
                      >
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.screenshot ? (
                        <img
                          src={getImageUrl(payment.screenshot)}
                          alt="Payment screenshot"
                          className="h-14 w-20 cursor-pointer rounded-md object-cover ring-1 ring-slate-200 transition hover:scale-105"
                          onClick={() => openPreview(payment.screenshot)}
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleConfirmPayment(payment._id)}
                            disabled={
                              confirmingPaymentId === payment._id ||
                              rejectingPaymentId === payment._id
                            }
                            className="rounded-xl border border-emerald-300 px-3 py-2 text-emerald-700 transition-colors hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {confirmingPaymentId === payment._id
                              ? "Confirming..."
                              : "Confirm"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRejectPayment(payment._id)}
                            disabled={
                              confirmingPaymentId === payment._id ||
                              rejectingPaymentId === payment._id
                            }
                            className="rounded-xl border border-rose-300 px-3 py-2 text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {rejectingPaymentId === payment._id
                              ? "Rejecting..."
                              : "Reject"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      ) : null}

      {previewImage ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closePreview}
        >
          <div
            className="relative rounded-2xl bg-surface-container-lowest p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src={getImageUrl(previewImage)}
              alt="Payment preview"
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
                Zoom In
              </button>
              <button
                type="button"
                onClick={() =>
                  setZoomLevel((previous) => Math.max(previous - 0.2, 1))
                }
                className="rounded border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
              >
                Zoom Out
              </button>
            </div>

            <button
              type="button"
              onClick={closePreview}
              className="absolute right-2 top-2 rounded bg-red-500 px-2 py-1 text-sm text-white"
            >
              X
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default AdminPage;
