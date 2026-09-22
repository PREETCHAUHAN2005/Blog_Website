import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { plainText } from "../appwrite/slug";
import { PostList, PostListSkeleton } from "../components/PostCard";
import usePageTitle from "../hooks/usePageTitle";

export default function Home() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = (searchParams.get("q") || "").trim();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [term, setTerm] = useState(query);
  usePageTitle(query ? `Search: ${query}` : "Home");

  useEffect(() => {
    setTerm(query);
  }, [query]);

  useEffect(() => {
    let active = true;
    appwriteService
      .getPosts({ status: "active" })
      .then((result) => {
        if (active) setPosts(result?.documents || []);
      })
      .catch((err) => {
        if (active) setError(err?.message || "Could not load posts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const needle = query.toLowerCase();
  const visible = needle
    ? posts.filter((post) =>
        `${post.title} ${plainText(post.content)}`.toLowerCase().includes(needle)
      )
    : posts;

  return (
    <section className="pt-10">
      <header className="mb-8">
        <h1 className="font-serif text-5xl leading-none font-normal tracking-tight">
          {query ? `Results for “${query}”` : "Aiblog"}
        </h1>
        {!query && <p className="mt-3 text-[#6b6560]">Posts from this site.</p>}
      </header>
      <form
        className="mb-8 border-b border-[#e4dfd8]"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const next = term.trim();
          navigate(next ? `/?q=${encodeURIComponent(next)}` : "/");
        }}
      >
        <input
          name="q"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
          placeholder="Search posts"
          aria-label="Search posts"
          className="w-full bg-transparent py-3 text-lg outline-none placeholder:text-[#6b6560]"
        />
      </form>
      {loading && <PostListSkeleton />}
      {!loading && error && <p className="text-sm text-[#8a2b2b]">{error}</p>}
      {!loading && !error && visible.length === 0 && (
        <div className="border-t border-[#e4dfd8] py-10">
          <p className="font-serif text-2xl">
            {query ? "No posts match that search." : "No public posts yet."}
          </p>
          <p className="mt-2 text-[#6b6560]">
            {query ? "Try another word, or clear the search." : "Write the first one."}
          </p>
          <Link to={query ? "/" : "/add-post"} className="mt-4 inline-block text-sm underline underline-offset-4">
            {query ? "Clear search" : "Write a post"}
          </Link>
        </div>
      )}
      {!loading && !error && visible.length > 0 && <PostList posts={visible} />}
    </section>
  );
}
