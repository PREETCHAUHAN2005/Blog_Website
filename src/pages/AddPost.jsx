import { Container, PostForm } from "../components";
import usePageTitle from "../hooks/usePageTitle";

export default function AddPost() {
  usePageTitle("Create");
  return (
    <Container>
      <PostForm />
    </Container>
  );
}
