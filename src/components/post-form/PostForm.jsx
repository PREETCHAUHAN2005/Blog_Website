import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import appwriteService from "../../appwrite/config";
import { plainText } from "../../appwrite/slug";
import Button from "../Button";
import Input from "../Input";
import Select from "../Select";
import RTE from "../RTE";

export default function PostForm({ post }) {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth.userData);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [preview, setPreview] = useState(
    post?.featuredImage ? appwriteService.getFilePreview(post.featuredImage) : ""
  );

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  });

  const imageField = register("image");

  const submit = async (data) => {
    if (!plainText(data.content)) {
      setError("Write the article before saving.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      let featuredImage = post?.featuredImage || "";
      const file = data.image?.[0];
      if (file) {
        const uploaded = await appwriteService.uploadFile(file);
        if (post?.featuredImage && post.featuredImage !== uploaded.$id) {
          await appwriteService.deleteFile(post.featuredImage);
        }
        featuredImage = uploaded.$id;
      }

      const body = {
        title: data.title,
        content: data.content,
        featuredImage,
        status: data.status,
      };

      const saved = post
        ? await appwriteService.updatePost(post.$id, body)
        : await appwriteService.createPost({ ...body, userId: userData?.$id });

      navigate(`/post/${saved.$id}`);
    } catch (err) {
      setError(err?.message || "Could not save this post.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6 pt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="font-serif text-4xl font-normal">{post ? "Edit post" : "Write"}</h1>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </Button>
      </div>
      {error && <p className="text-sm text-[#8a2b2b]">{error}</p>}
      <Input
        label="Title"
        placeholder="Add a title"
        error={errors.title?.message}
        {...register("title", {
          required: "Title is required.",
          maxLength: { value: 120, message: "Keep the title under 120 characters." },
        })}
      />
      <RTE name="content" label="Article" control={control} defaultValue={post?.content || ""} />
      <div>
        <p className="mb-1 text-sm text-[#6b6560]">Thumbnail</p>
        {preview && <img src={preview} alt="" className="mb-3 w-full bg-[#efeae3]" />}
        <label className="inline-flex cursor-pointer border border-[#e4dfd8] px-4 py-2 text-sm hover:border-[#1c1917]">
          Upload thumbnail
          <input
            type="file"
            accept="image/*"
            className="hidden"
            {...imageField}
            onChange={(event) => {
              imageField.onChange(event);
              const file = event.target.files?.[0];
              if (!file) return;
              setPreview((current) => {
                if (current?.startsWith("blob:")) URL.revokeObjectURL(current);
                return URL.createObjectURL(file);
              });
            }}
          />
        </label>
      </div>
      <Select
        label="Visibility"
        options={[
          { value: "active", label: "Public" },
          { value: "inactive", label: "Draft" },
        ]}
        {...register("status", { required: true })}
      />
      <p className="text-sm text-[#6b6560]">
        Public posts show on Home. Drafts stay on Your posts until you publish them.
      </p>
    </form>
  );
}
