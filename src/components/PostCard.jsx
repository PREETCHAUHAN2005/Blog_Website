import { Link } from "react-router-dom";
import { formatDate, plainText } from "../appwrite/slug";

function excerpt(content) {
  const text = plainText(content);
  if (!text) return "";
  return text.length > 160 ? `${text.slice(0, 160).trim()}…` : text;
}

function PostCard({ $id, title, content, $createdAt, status }) {
  const line = excerpt(content);
  return (
    <Link to={`/post/${$id}`} className="block border-t border-[#e4dfd8] py-7">
      <p className="text-sm text-[#6b6560]">
        {formatDate($createdAt)}
        {status === "inactive" ? " · Draft" : ""}
      </p>
      <h2 className="mt-1 font-serif text-[1.75rem] leading-tight text-[#1c1917]">{title}</h2>
      {line && <p className="mt-2 text-[#6b6560]">{line}</p>}
    </Link>
  );
}

export function PostList({ posts }) {
  return (
    <div className="border-b border-[#e4dfd8]">
      {posts.map((post) => (
        <PostCard key={post.$id} {...post} />
      ))}
    </div>
  );
}

export function PostListSkeleton() {
  return (
    <div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="border-t border-[#e4dfd8] py-7">
          <div className="h-3 w-24 bg-[#e4dfd8]" />
          <div className="mt-3 h-7 w-4/5 bg-[#e4dfd8]" />
          <div className="mt-3 h-4 w-full bg-[#efeae3]" />
        </div>
      ))}
    </div>
  );
}

export default PostCard;
