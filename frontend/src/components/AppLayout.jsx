import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import useAuthUser from "../hooks/useAuthUser";

const AppLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthUser();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  const notifications = [
    {
      id: 1,
      title: "New listings available",
      message: "Fresh items were added to the marketplace.",
      link: "/",
      action: "Browse",
    },
    {
      id: 2,
      title: "Manage your items",
      message: "Update price, photos, or availability from My Listings.",
      link: "/my-listings",
      action: "Open",
    },
    {
      id: 3,
      title: "Create a new listing",
      message: "Have something to rent? Add it in under a minute.",
      link: "/add-item",
      action: "Add",
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClassName = ({ isActive }) =>
    `font-manrope text-sm font-semibold tracking-tight transition ${
      isActive
        ? "text-indigo-700 border-b-2 border-indigo-600 pb-1"
        : "text-slate-600 hover:text-indigo-500"
    }`;

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e]">
      <header className="fixed top-0 z-50 w-full border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-md">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="font-headline text-2xl font-bold tracking-tighter text-indigo-700"
          >
            CampusRent
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <NavLink to="/" className={navLinkClassName}>
              Home
            </NavLink>

            {isAuthenticated ? (
              <>
                <NavLink to="/add-item" className={navLinkClassName}>
                  Add Item
                </NavLink>
                <NavLink to="/my-listings" className={navLinkClassName}>
                  My Listings
                </NavLink>
                {isAdmin ? (
                  <NavLink to="/admin" className={navLinkClassName}>
                    Admin
                  </NavLink>
                ) : null}
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-manrope text-sm font-semibold tracking-tight text-slate-600 hover:text-indigo-500"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-indigo-900 px-4 py-2 font-manrope text-sm font-semibold tracking-tight text-white hover:bg-indigo-700"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          <div
            className="relative flex items-center gap-4"
            ref={notificationRef}
          >
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className="relative rounded-lg p-2 transition-all duration-200 hover:bg-slate-100/60 active:scale-95"
                >
                  <span className="material-symbols-outlined text-slate-600">
                    notifications
                  </span>
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold leading-none text-white">
                    {notifications.length}
                  </span>
                </button>

                {isNotificationOpen ? (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-xl">
                    <div className="mb-2 flex items-center justify-between px-2 py-1">
                      <p className="font-headline text-base font-bold text-slate-900">
                        Notifications
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsNotificationOpen(false)}
                        className="rounded-md px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                      >
                        Close
                      </button>
                    </div>

                    <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                      {notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          to={notification.link}
                          onClick={() => setIsNotificationOpen(false)}
                          className="block rounded-xl bg-slate-50 p-3 transition hover:bg-indigo-50"
                        >
                          <p className="text-sm font-semibold text-slate-900">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-600">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-indigo-700">
                            {notification.action}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 bg-slate-200">
                  <img
                    alt="User Profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRIg5TsfFLuqy_8y9vIUYjhSHYja2lEROjrqAi4DrPQ2OyA7bP1rxtD8S9d-_hKLDgNIqaQWy0rRy_twvp0-0bqy0eGTirkjb7Gtur1KLE12xRNuCYf_mrSkzPoVgTZ2BzpKAHHo4oaeOxU6w6WAyq_rDYiper8flmLmvn0aJ86vIMWH5SuaXivtwDzRBO_jsZ-IFtU4DHuaJeSnApMLXLmX3dGdL_f6ORKeW42ZRrRx_2OPfwXr5ZNVE4D06iRV9ErL6uVNdPuwt4"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-manrope text-sm font-semibold tracking-tight text-slate-600 hover:text-indigo-500"
                >
                  Logout
                </button>
              </>
            ) : null}
          </div>
        </nav>
      </header>

      <main className="min-h-screen px-4 pb-20 pt-24 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
