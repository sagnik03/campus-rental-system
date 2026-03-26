import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/AppLayout";
import HomePage from "./pages/HomePage";
import AddItemPage from "./pages/AddItemPage";
import AdminPage from "./pages/AdminPage";
import ItemDetailPage from "./pages/ItemDetailPage";
import LoginPage from "./pages/LoginPage";
import MyListingsPage from "./pages/MyListingsPage";
import PaymentPage from "./pages/PaymentPage";
import SignupPage from "./pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/add-item" element={<AddItemPage />} />
          <Route path="/my-listings" element={<MyListingsPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
          <Route path="/payment/:bookingId" element={<PaymentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
