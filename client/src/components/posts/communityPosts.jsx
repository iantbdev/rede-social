import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { sendRequest } from "../../axios.js";
import Post from "../post/Post";

const CommunityPosts = ({ comunidadeId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => sendRequest.get("/posts").then((resp) => resp.data),
  });

  const filteredPosts = data
    ? data.filter((post) => post.comunidade_id === comunidadeId)
    : [];

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : filteredPosts.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default CommunityPosts;
