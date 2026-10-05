import "./Diamond.scss";
import { useState, useEffect, type CSSProperties } from "react";

export default function Diamond({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const [showFilled, setShowFilled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFilled(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={["sushi-diamond__visual", className].filter(Boolean).join(" ")}
      style={style}
      data-filled={showFilled}
    >
      <DiamondOutlineSVG className="sushi-diamond__outline diamond-outline" />
      <img
        src={`${import.meta.env.BASE_URL}minecraft-diamond.svg`}
        alt="Diamond Filled"
        className="sushi-diamond__filled"
      />
    </div>
  );
}

function DiamondOutlineSVG({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="605"
      height="497"
      viewBox="0 0 605 497"
      role="img"
      aria-labelledby="diamond-outline-title"
      className={className}
      style={style}
    >
      <title id="diamond-outline-title">Minecraft diamond outline</title>
      <path
        id="diamond-outline"
        d="M240 43H368V75H400V107H432V171H464V235H496V331H464V395H432V427H400V459H208V427H176V395H144V331H112V203H144V139H176V107H208V75H240Z"
        pathLength="1000"
        className="sushi-diamond__stroke"
      />
    </svg>
  );
}
