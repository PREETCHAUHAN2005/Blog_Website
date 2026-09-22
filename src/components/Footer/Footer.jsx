import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 flex flex-wrap items-baseline justify-between gap-3 border-t border-[#e4dfd8] py-5 text-sm text-[#6b6560]">
      <p>© {new Date().getFullYear()} Aiblog</p>
      <nav className="flex gap-4">
        <Link to="/" className="hover:text-[#1c1917]">
          Home
        </Link>
        <Link to="/all-posts" className="hover:text-[#1c1917]">
          Your posts
        </Link>
        <Link to="/add-post" className="hover:text-[#1c1917]">
          Write
        </Link>
      </nav>
    </footer>
  );
}
