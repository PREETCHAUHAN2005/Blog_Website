import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import parse from "html-react-parser";
import appwriteService from "../appwrite/config";
import { formatDate } from "../appwrite/slug";
import usePageTitle from "../hooks/usePageTitle";

function Cover({ src }) {
  const [failed, setFailed] = useState(!src);
  if (!src || failed) return null;
  return (
    <img
      src={src}
      alt=""
      className="mt-8 w-full bg-[#efeae3]"
      onError={() => setFailed(true)}
    />
  );
}

export default function Post() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  usePageTitle(post?.title || "Post");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    appwriteService
      .getPost(slug)
      .then((result) => {
        if (!active) return;
        if (result?.status === "inactive" && result.userId !== userData?.$id) {
          setError("This draft is not public.");
          setPost(null);
          return;
        }
        setPost(result);
      })
      .catch((err) => {
        if (active) {
          setError(
            err?.code === 404 ? "This post is not available." : err?.message || "Could not load this post."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, userData]);

  const remove = async () => {
    if (!post || !window.confirm("Delete this post?")) return;
    setDeleting(true);
    try {
      await appwriteService.deletePost(post.$id);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Could not delete this post.");
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-10">
        <div className="h-10 w-4/5 bg-[#e4dfd8]" />
        <div className="mt-4 h-4 w-40 bg-[#efeae3]" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="border-t border-[#e4dfd8] py-10">
        <p className="font-serif text-2xl">{error || "This post is not available."}</p>
        <Link to="/" className="mt-4 inline-block text-sm underline underline-offset-4">
          Back to Home
        </Link>
      </div>
    );
  }

  const isOwner = userData?.$id && userData.$id === post.userId;
  const author = isOwner ? userData.name || "You" : "Writer";
  const cover = post.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : "";

  return (
    <article className="pt-10">
      <h1 className="font-serif text-4xl leading-tight font-normal tracking-tight sm:text-5xl">
        {post.title}
      </h1>
      <p className="mt-4 text-sm text-[#6b6560]">
        {author} · {formatDate(post.$createdAt)}
        {post.status === "inactive" ? " · Draft" : ""}
      </p>
      {isOwner && (
        <div className="mt-4 flex gap-5 text-sm">
          <Link to={`/edit-post/${post.$id}`} className="underline underline-offset-4">
            Edit
          </Link>
          <button
            type="button"
            onClick={remove}
            disabled={deleting}
            className="underline underline-offset-4 disabled:opacity-60"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      )}
      {error && <p className="mt-4 text-sm text-[#8a2b2b]">{error}</p>}
      <Cover src={cover} />
      <div className="post-body mt-8 text-[#1c1917]">
        {post.content ? parse(post.content) : <p>This post has no article body.</p>}
      </div>
    </article>
  );
}
