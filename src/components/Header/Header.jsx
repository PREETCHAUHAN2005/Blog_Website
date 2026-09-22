import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import LogoutBtn from "./LogoutBtn";

function Item({ to, children, end = false }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `text-sm text-[#1c1917] underline-offset-4 ${
          isActive ? "underline" : "hover:underline"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  return (
    <header className="border-b border-[#e4dfd8]">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 px-5 py-4 sm:flex-row sm:items-baseline sm:justify-between">
        <NavLink to="/" end aria-label="Aiblog home">
          <Logo />
        </NavLink>
        <nav className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
          <Item to="/" end>
            Home
          </Item>
          {authStatus && <Item to="/all-posts">Your posts</Item>}
          {authStatus && <Item to="/add-post">Write</Item>}
          {authStatus ? (
            <>
              <span className="text-sm text-[#6b6560]">{userData?.name || "Account"}</span>
              <LogoutBtn className="text-sm text-[#1c1917] underline-offset-4 hover:underline" />
            </>
          ) : (
            <Item to="/login">Sign in</Item>
          )}
        </nav>
      </div>
    </header>
  );
}
