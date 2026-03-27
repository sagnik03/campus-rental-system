import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuthUser from "../hooks/useAuthUser";
import api from "../services/api";

const AddItemPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthUser();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerDay: "",
    securityDeposit: "",
    category: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthenticated) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-md">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-textMain">
          Create New Listing
        </h1>
        <p className="mt-2 text-sm text-rose-600 dark:text-rose-400">
          Please login to create a listing.
        </p>
      </section>
    );
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("description", formData.description);
      payload.append("pricePerDay", formData.pricePerDay);
      payload.append("securityDeposit", formData.securityDeposit);
      payload.append("category", formData.category);

      imageFiles.forEach((file) => payload.append("images", file));

      await api.post("/items", payload);

      navigate("/my-listings");
    } catch (apiError) {
      const message =
        apiError?.response?.data?.message || "Failed to create listing";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto w-full max-w-4xl space-y-8">
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className="p-8 md:p-12">
          <div className="mb-10 text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-textMain">
              Create New Listing
            </h1>
            <p className="mt-2 text-textMain/75">
              Share your item with the campus community and start earning.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="ml-1 block text-sm font-semibold text-textMain/75"
              >
                Listing Title
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-4 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="ml-1 block text-sm font-semibold text-textMain/75"
              >
                Category
              </label>
              <input
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-border bg-background px-4 py-4 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="ml-1 block text-sm font-semibold text-textMain/75"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full resize-none rounded-xl border border-border bg-background px-4 py-4 text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label
                  htmlFor="pricePerDay"
                  className="ml-1 block text-sm font-semibold text-textMain/75"
                >
                  Price Per Day (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                    ₹
                  </span>
                  <input
                    id="pricePerDay"
                    name="pricePerDay"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricePerDay}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background py-4 pl-12 pr-4 font-headline font-bold text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="securityDeposit"
                  className="ml-1 block text-sm font-semibold text-textMain/75"
                >
                  Security Deposit (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                    ₹
                  </span>
                  <input
                    id="securityDeposit"
                    name="securityDeposit"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.securityDeposit}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background py-4 pl-12 pr-4 font-headline font-bold text-textMain placeholder:text-textMain/45 outline-none transition-all duration-200 focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="images"
                className="ml-1 block text-sm font-semibold text-textMain/75"
              >
                Item Images (optional, up to 5)
              </label>
              <div className="group relative">
                <input
                  id="images"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg,image/webp"
                  onChange={(event) =>
                    setImageFiles(
                      Array.from(event.target.files || []).slice(0, 5),
                    )
                  }
                  className="absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0"
                />
                <div className="rounded-2xl border-2 border-dashed border-border bg-background p-10 text-center transition-all duration-200 group-hover:border-primary group-hover:bg-card">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <span className="material-symbols-outlined text-3xl text-primary">
                      upload_file
                    </span>
                  </div>
                  <p className="font-semibold text-textMain">
                    Click or drag images here
                  </p>
                  <p className="mt-1 text-xs text-textMain/60">
                    PNG, JPG or WebP (up to 5 images)
                  </p>
                </div>
              </div>
              {imageFiles.length ? (
                <p className="mt-1 text-xs text-textMain/75">
                  {imageFiles.length} file(s) selected
                </p>
              ) : null}
            </div>

            {error ? (
              <p className="text-sm text-rose-600 dark:text-rose-400">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center rounded-xl bg-primary py-4 font-headline font-bold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span>{isSubmitting ? "Creating..." : "Create Listing"}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-8 shadow-md">
        <span className="inline-block rounded-full bg-background px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Pro Tip
        </span>
        <h3 className="mt-4 font-headline text-2xl font-extrabold text-textMain">
          Make your listing stand out
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-textMain/75">
          Listings with multiple clear images usually get more booking requests.
          Use natural light and capture different angles.
        </p>
      </div>
    </section>
  );
};

export default AddItemPage;
