import "./Join.scss";
import FixedLayout from "../components/FixedLayout";
import { useState } from "react";

export default function Join() {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <FixedLayout>
      <div className="sushi-join__page">
        {/* Main Two-Column Layout Container */}
        <div className="sushi-join__layout">
          {/* Left Side: Isolated Image Box with Placeholder */}
          <div className="sushi-join__image-box">
            <img
              src={`${import.meta.env.BASE_URL}join.jpg`}
              alt="Join the server"
              onLoad={() => setImgLoaded(true)}
              className="sushi-join__image"
              data-loaded={imgLoaded}
            />
          </div>

          {/* Right Side: Header and Text Content */}
          <div className="sushi-join__content">
            <h1 className="sushi-join__heading">Join Now!</h1>

            <p className="sushi-join__description">
              Ready to dive into the action? Connect to our friendly server and
              start adventuring today. We support the latest Minecraft versions
              and welcome players of all skill levels.
            </p>

            <div className="sushi-join__server-box">
              <div className="sushi-join__server-label">Server IP</div>
              <div className="sushi-join__server-address">
                mc.sushicraft.net
              </div>
              <p className="sushi-join__disclaimer">
                Website demo only — no live server.
              </p>
            </div>
          </div>
        </div>
      </div>
    </FixedLayout>
  );
}
