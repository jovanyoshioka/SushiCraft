import "./Home.scss";
import FixedLayout from "../components/FixedLayout";
import Diorama from "../components/Diorama";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <FixedLayout>
      <div className="sushi-home__container">
        {/* Backgrounds */}
        <div
          className="sushi-home__image-background"
          style={
            {
              "--home-image-background-background-image": `url("${import.meta.env.BASE_URL}ship.jpg")`,
            } as React.CSSProperties
          }
        />
        <div className="sushi-home__gradient-overlay" />

        {/* Foreground Content */}
        <div className="sushi-home__content">
          {/* Left Side: Content */}
          <div className="sushi-home__left-side">
            <img
              src={`${import.meta.env.BASE_URL}SushiCraft.svg`}
              alt="SushiCraft"
              className="sushi-home__logo"
            />
            <h2 className="sushi-home__heading">Set Sail for a New World</h2>
            <p className="sushi-home__description">
              Welcome to SushiCraft! A highly customized, immersive Minecraft
              experience built for exploration, creativity, and adventure.
              Discover custom items, advanced mechanics, and a thriving
              community of players. Ready to embark on your next great
              adventure?
            </p>
            <Link to="/join" className="join-btn">
              Join Now
            </Link>
          </div>

          {/* Right Side: Diorama */}
          <div className="sushi-home__right-side">
            <Diorama
              modelUrl={`${import.meta.env.BASE_URL}diorama-static.glb`}
            />
          </div>
        </div>
      </div>
    </FixedLayout>
  );
}
