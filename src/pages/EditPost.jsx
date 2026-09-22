import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";
import usePageTitle from "../hooks/usePageTitle";

export default function EditPost() {
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  usePageTitle(post?.title ? `Edit ${post.title}` : "Edit post");

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return undefined;
    }
    let active = true;
    appwriteService
      .getPost(slug)
      .then((result) => {
        if (!active) return;
        if (result?.userId && result.userId !== userData?.$id) {
          setError("You can only edit your own posts.");
          return;
        }
        setPost(result);
      })
      .catch((err) => {
        if (active) setError(err?.message || "Could not open this post.");
      });
    return () => {
      active = false;
    };
  }, [slug, navigate, userData]);

  if (error) {
    return <p className="py-10 text-center text-sm text-[#c00]">{error}</p>;
  }

  return post ? (
    <Container>
      <PostForm post={post} />
    </Container>
  ) : (
    <p className="py-10 text-center text-sm text-[#606060]">Loading post...</p>
  );
}
