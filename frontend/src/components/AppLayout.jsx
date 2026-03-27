import { useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import useAuthUser from "../hooks/useAuthUser";

const AppLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuthUser();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      return savedTheme === "dark";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinkClassName = ({ isActive }) =>
    `border-b-2 pb-1 font-manrope text-sm font-semibold tracking-tight transition-all duration-200 ${
      isActive
        ? "border-primary text-primary"
        : "border-transparent text-textMain/70 hover:text-primary"
    }`;

  return (
    <div className="min-h-screen bg-background text-textMain transition-all duration-200">
      <header className="fixed top-0 z-50 w-full border-b border-border/90 bg-background/90 shadow-md backdrop-blur-md transition-all duration-200">
        <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
          <Link
            to="/"
            className="font-headline text-2xl font-bold tracking-tighter text-primary"
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
                  className="font-manrope text-sm font-semibold tracking-tight text-textMain/70 transition-all duration-200 hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-xl bg-primary px-4 py-2 font-manrope text-sm font-semibold tracking-tight text-white shadow-md transition-all duration-200 hover:brightness-110"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          <div
            className="relative flex items-center gap-3"
            ref={notificationRef}
          >
            <button
              type="button"
              onClick={() => setIsDarkMode((current) => !current)}
              className="rounded-xl border border-border bg-card px-3 py-2 text-sm text-textMain shadow-sm transition-all duration-200 hover:brightness-110"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "☀️" : "🌙"}
            </button>

            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsNotificationOpen((current) => !current)}
                  className="relative rounded-xl border border-border bg-card p-2 shadow-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                >
                  <span className="material-symbols-outlined text-textMain/80">
                    notifications
                  </span>
                  <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-white">
                    {notifications.length}
                  </span>
                </button>

                {isNotificationOpen ? (
                  <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-border bg-card p-3 shadow-lg transition-all duration-200">
                    <div className="mb-2 flex items-center justify-between px-2 py-1">
                      <p className="font-headline text-base font-bold text-textMain">
                        Notifications
                      </p>
                      <button
                        type="button"
                        onClick={() => setIsNotificationOpen(false)}
                        className="rounded-lg px-2 py-1 text-xs font-semibold text-textMain/70 transition-all duration-200 hover:bg-background"
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
                          className="block rounded-xl border border-border bg-background p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
                        >
                          <p className="text-sm font-semibold text-textMain">
                            {notification.title}
                          </p>
                          <p className="mt-1 text-xs text-textMain/70">
                            {notification.message}
                          </p>
                          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-primary">
                            {notification.action}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="h-8 w-8 overflow-hidden rounded-full border border-border bg-background">
                  <img
                    alt="User Profile"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRIg5TsfFLuqy_8y9vIUYjhSHYja2lEROjrqAi4DrPQ2OyA7bP1rxtD8S9d-_hKLDgNIqaQWy0rRy_twvp0-0bqy0eGTirkjb7Gtur1KLE12xRNuCYf_mrSkzPoVgTZ2BzpKAHHo4oaeOxU6w6WAyq_rDYiper8flmLmvn0aJ86vIMWH5SuaXivtwDzRBO_jsZ-IFtU4DHuaJeSnApMLXLmX3dGdL_f6ORKeW42ZRrRx_2OPfwXr5ZNVE4D06iRV9ErL6uVNdPuwt4"
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="font-manrope text-sm font-semibold tracking-tight text-textMain/70 transition-all duration-200 hover:text-primary"
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
