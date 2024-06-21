import Stories from "../../components/stories/Stories";
import Posts from "../../components/posts/Posts";
import Share from "../../components/share/Share";
import "./home.scss";
import MusicPlayer from "../../components/musicPlayer/musicPlayer";

const Home = () => {
  return (
    <div className="home">
      <Stories />
      <Share />
      <Posts />
      <MusicPlayer />
    </div>
  );
};

export default Home;
