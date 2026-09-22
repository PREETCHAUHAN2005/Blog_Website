import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import authService from "./appwrite/auth";
import { getModeState, subscribeMode } from "./appwrite/mode";
import { login, logout } from "./store/authSlice";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Logo from "./components/Logo";

function ModeBanner() {
  const [state, setState] = useState(getModeState);
  const [hidden, setHidden] = useState(false);

  useEffect(() => subscribeMode(() => setState(getModeState())), []);

  if (hidden || state.mode !== "local" || !state.reason) return null;

  return (
    <div className="border-b border-[#e4dfd8] bg-[#efeae3]">
      <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-4 px-5 py-2 text-sm text-[#1c1917]">
        <p>{state.reason}</p>
        <button type="button" className="shrink-0 text-[#6b6560]" onClick={() => setHidden(true)}>
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService
      .getCurrentUser()
      .then((userData) => {
        if (userData) dispatch(login({ userData }));
        else dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f3ee]">
        <Logo />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1c1917]">
      <Header />
      <ModeBanner />
      <div className="mx-auto w-full max-w-3xl px-5 pb-10">
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
