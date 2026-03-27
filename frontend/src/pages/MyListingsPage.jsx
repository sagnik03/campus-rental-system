import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import useAuthUser from "../hooks/useAuthUser";
import api from "../services/api";
import { getImageUrl } from "../utils/getImageUrl";

const emptyEditState = {
  title: "",
  description: "",
  pricePerDay: "",
  securityDeposit: "",
  category: "",
};

const mapItemToEditState = (item) => ({
  title: item.title || "",
  description: item.description || "",
  pricePerDay: String(item.pricePerDay ?? ""),
  securityDeposit: String(item.securityDeposit ?? ""),
  category: item.category || "",
});

const MyListingsPage = () => {
  const { isAuthenticated } = useAuthUser();

  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingItemId, setEditingItemId] = useState("");
  const [editFormData, setEditFormData] = useState(emptyEditState);
  const [editImageFiles, setEditImageFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const itemById = useMemo(() => {
    return items.reduce((accumulator, currentItem) => {
      accumulator[currentItem._id] = currentItem;
      return accumulator;
    }, {});
  }, [items]);

  const fetchMyItems = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await api.get("/items/mine");
      setItems(Array.isArray(response?.data?.data) ? response.data.data : []);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to fetch your listings";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    fetchMyItems();
  }, [isAuthenticated]);

  const handleDelete = async (itemId) => {
    const isConfirmed = window.confirm("Delete this listing?");

    if (!isConfirmed) {
      return;
    }

    try {
      await api.delete(`/items/${itemId}`);
      setItems((previousItems) =>
        previousItems.filter((item) => item._id !== itemId),
      );
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to delete listing";
      setError(message);
    }
  };

  const startEdit = (itemId) => {
    const item = itemById[itemId];

    if (!item) {
      return;
    }

    setEditingItemId(itemId);
    setEditFormData(mapItemToEditState(item));
    setEditImageFiles([]);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((previousData) => ({ ...previousData, [name]: value }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingItemId) {
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("title", editFormData.title);
      payload.append("description", editFormData.description);
      payload.append("pricePerDay", editFormData.pricePerDay);
      payload.append("securityDeposit", editFormData.securityDeposit);
      payload.append("category", editFormData.category);

      editImageFiles.forEach((file) => payload.append("images", file));

      const response = await api.put(`/items/${editingItemId}`, payload);
      const updatedItem = response?.data?.data;

      setItems((previousItems) =>
        previousItems.map((item) =>
          item._id === editingItemId ? updatedItem : item,
        ),
      );

      setEditingItemId("");
      setEditFormData(emptyEditState);
      setEditImageFiles([]);
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to update listing";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-border bg-card p-8 shadow-md">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-textMain">
          My Listings
        </h1>
        <p className="mt-2 text-sm text-rose-600">
          Please login to manage your listings.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-md md:p-12">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/4 rounded-full bg-primary/5 blur-3xl" />
        <h1 className="relative z-10 font-headline text-4xl font-bold tracking-tight text-textMain md:text-5xl">
          My Listings
        </h1>
        <p className="relative z-10 mt-3 max-w-2xl text-textMain/75">
          Manage your published rental items from here.
        </p>
        <Link
          to="/add-item"
          className="relative z-10 mt-8 inline-flex items-center rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110"
        >
          Create New Listing
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-textMain/75">Loading your listings...</p>
      ) : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}

      {!isLoading && !error && items.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-6 shadow-md">
          <p className="text-sm text-textMain/75">
            You have not created any listings yet.
          </p>
          <Link
            to="/add-item"
            className="mt-3 inline-block rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:brightness-110"
          >
            Add Your First Item
          </Link>
        </div>
      ) : null}

      {!isLoading && items.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item) => (
            <article
              key={item._id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              <img
                src={getImageUrl(item.images?.[0], item.category)}
                alt={item.title}
                className="h-72 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="space-y-4 p-8">
                <h2 className="font-headline text-2xl font-bold text-textMain">
                  {item.title}
                </h2>
                <p className="line-clamp-2 text-sm text-textMain/75">
                  {item.description}
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 rounded-xl border border-border bg-background px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-textMain/65">
                      Daily Rate
                    </span>
                    <span className="font-headline text-xl font-bold text-primary">
                      ₹ {item.pricePerDay}
                    </span>
                  </div>
                  <div className="flex-1 rounded-xl border border-border bg-background px-4 py-3">
                    <span className="block text-xs font-semibold uppercase tracking-wider text-textMain/65">
                      Security Deposit
                    </span>
                    <span className="font-headline text-xl font-bold text-textMain">
                      ₹ {item.securityDeposit}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => startEdit(item._id)}
                    className="flex-1 rounded-xl border border-border px-3 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-background"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="flex-1 rounded-xl border border-rose-300 px-3 py-3 text-sm font-semibold text-rose-600 transition-all duration-200 hover:bg-rose-50 dark:border-rose-700 dark:hover:bg-rose-900/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {editingItemId ? (
        <form
          onSubmit={handleSaveEdit}
          className="rounded-2xl border border-border bg-card p-8 shadow-md"
        >
          <h2 className="font-headline text-2xl font-bold text-textMain">
            Edit Listing
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input
              name="title"
              value={editFormData.title}
              onChange={handleEditChange}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="Title"
            />
            <input
              name="category"
              value={editFormData.category}
              onChange={handleEditChange}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="Category"
            />
            <input
              name="pricePerDay"
              type="number"
              min="0"
              step="0.01"
              value={editFormData.pricePerDay}
              onChange={handleEditChange}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="Price per day"
            />
            <input
              name="securityDeposit"
              type="number"
              min="0"
              step="0.01"
              value={editFormData.securityDeposit}
              onChange={handleEditChange}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              placeholder="Security deposit"
            />
          </div>
          <textarea
            name="description"
            rows={3}
            value={editFormData.description}
            onChange={handleEditChange}
            required
            className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
            placeholder="Description"
          />
          <div className="mt-4">
            <label
              className="mb-1 block text-sm font-medium text-textMain/75"
              htmlFor="editImages"
            >
              Replace Images (optional, up to 5)
            </label>
            <input
              id="editImages"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/jpg,image/webp"
              onChange={(event) =>
                setEditImageFiles(
                  Array.from(event.target.files || []).slice(0, 5),
                )
              }
              className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-textMain"
            />
            {editImageFiles.length ? (
              <p className="mt-1 text-xs text-textMain/75">
                {editImageFiles.length} new image(s) will replace current images
              </p>
            ) : null}
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:opacity-70"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={() => setEditingItemId("")}
              className="rounded-xl border border-border px-6 py-3 text-sm font-semibold text-textMain transition-all duration-200 hover:bg-background"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}
    </section>
  );
};

export default MyListingsPage;
