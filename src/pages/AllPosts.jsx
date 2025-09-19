import React, { useState, useEffect } from "react";
import { Container, PostCard } from "../components";
import appwriteService from "../appwrite/config";
function AllPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {},[])
    appwriteService.getPosts([]).then((posts) => {
        if(posts){
            setPosts(posts.documents)
        }
    })
  return (
  <div className="w-full py-8">
<Container>
    {posts.map((post) => (
        <PostCard key={posts.$id} post={post}/>
    ))}
</Container>
  </div>
  )
}

export default AllPosts;
