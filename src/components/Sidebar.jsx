import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUi } from "./UiContext";
import LogoutBtn from "./Header/LogoutBtn";

function Item({ to, label, icon, end = false }) {
  const { setMenuOpen } = useUi();
  return (
    <NavLink
      to={to}
      end={end}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) =>
        `flex h-10 items-center gap-5 rounded-lg px-3 text-sm ${
          isActive ? "bg-[#f2f2f2] font-medium" : "hover:bg-[#f2f2f2]"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}

function Icon({ path }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={path} />
    </svg>
  );
}

export default function Sidebar() {
  const authStatus = useSelector((state) => state.auth.status);
  const { menuOpen } = useUi();

  return (
    <aside
      className={`${
        menuOpen ? "fixed inset-x-0 top-14 z-40 block bg-white px-3 py-2 shadow" : "hidden"
      } md:sticky md:top-14 md:block md:h-[calc(100vh-3.5rem)] md:w-60 md:shrink-0 md:px-3 md:py-3 md:shadow-none`}
    >
      <nav className="flex flex-col gap-1">
        <Item
          to="/"
          end
          label="Home"
          icon={<Icon path="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />}
        />
        {authStatus && (
          <Item
            to="/all-posts"
            label="Your posts"
            icon={
              <Icon path="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h10v2H4v-2z" />
            }
          />
        )}
        {authStatus && (
          <Item
            to="/add-post"
            label="Create"
            icon={<Icon path="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />}
          />
        )}
        {!authStatus && (
          <Item
            to="/login"
            label="Sign in"
            icon={
              <Icon path="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            }
          />
        )}
        {authStatus && (
          <LogoutBtn className="flex h-10 w-full items-center gap-5 rounded-lg px-3 text-left text-sm hover:bg-[#f2f2f2]" />
        )}
      </nav>
    </aside>
  );
}
