import { useContext } from "react";
import "./stories.scss";
import { AuthContext } from "../../context/authContext";
import  PanelImg from "../../assets/listen.jpeg";

const Stories = () => {
  const { currentUser } = useContext(AuthContext);

  //TEMPORARY
  const stories = [
    {
      name: "Jazz",
      img: "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1e5f3549193935.58ad9f52336d4.jpg",
    },
    {
      name: "Rock",
      img: "https://i.pinimg.com/originals/f7/a6/b9/f7a6b909c839eee95760a46a572c23af.jpg",
    },
    {
      name: "Hip hop",
      img: "https://cdn.dribbble.com/users/58684/screenshots/1678738/media/114dc7629dd67a7f296c8461e78fd9fd.jpg?resize=400x300&vertical=center",
    },
    {
      name: "POP",
      img: "https://i.pinimg.com/originals/33/30/0d/33300d539eace1be3bdee836fe077feb.jpg",
    },
  ];

  return (
    <div className="stories">
      <div className="story">
      <img 
        src={currentUser.coverPic || PanelImg} 
        alt="" 
      />
        <span>{currentUser.nome_completo}</span>
      </div>
      {stories.map((story) => (
        <div className="story" key={story.id}>
          <img src={story.img} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;
