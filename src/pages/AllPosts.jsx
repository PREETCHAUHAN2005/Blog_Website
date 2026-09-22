import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import { PostList, PostListSkeleton } from "../components/PostCard";
import usePageTitle from "../hooks/usePageTitle";

export default function AllPosts() {
  const userData = useSelector((state) => state.auth.userData);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  usePageTitle("Your posts");

  useEffect(() => {
    if (!userData?.$id) return undefined;
    let active = true;
    appwriteService
      .getPosts({ userId: userData.$id })
      .then((result) => {
        if (active) setPosts(result?.documents || []);
      })
      .catch((err) => {
        if (active) setError(err?.message || "Could not load your posts.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [userData]);

  return (
    <section className="pt-10">
      <div className="mb-8 flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-5xl leading-none font-normal tracking-tight">Your posts</h1>
        <Link to="/add-post" className="text-sm underline underline-offset-4">
          Write
        </Link>
      </div>
      {loading && <PostListSkeleton />}
      {!loading && error && <p className="text-sm text-[#8a2b2b]">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <div className="border-t border-[#e4dfd8] py-10">
          <p className="font-serif text-2xl">You have not written anything yet.</p>
          <Link to="/add-post" className="mt-4 inline-block text-sm underline underline-offset-4">
            Write a post
          </Link>
        </div>
      )}
      {!loading && !error && posts.length > 0 && <PostList posts={posts} />}
    </section>
  );
}
