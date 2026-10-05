import "./Challenge.scss";
import FixedLayout from "../components/FixedLayout";

import Wither from "../components/Wither";
import Diamond from "../components/Diamond";

const Particles = () => {
  const embers = Array.from({ length: 120 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 8 + 4}px`,
    delay: `-${Math.random() * 8}s`,
    duration: `${Math.random() * 5 + 3}s`,
  }));

  return (
    <div className="sushi-challenge__particles">
      {embers.map((e) => (
        <div
          key={e.id}
          className="sushi-challenge__ember"
          style={
            {
              "--challenge-ember-left": e.left,
              "--challenge-ember-size": e.size,
              "--challenge-ember-duration": e.duration,
              "--challenge-ember-delay": e.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
};

export default function Challenge() {
  return (
    <FixedLayout>
      <div
        className="sushi-challenge__page"
        style={
          {
            "--challenge-page-background-image": `url('${import.meta.env.BASE_URL}nether-backdrop.jpg')`,
          } as React.CSSProperties
        }
      >
        <Particles />
        {/* Left 50% - Visuals */}
        <div className="sushi-challenge__visuals">
          <Wither className="sushi-challenge__wither" />
          <Diamond className="sushi-challenge__diamond" />
        </div>

        {/* Right 50% - Content */}
        <div className="sushi-challenge__content">
          {/* Floating Text Panel */}
          <div className="sushi-challenge__panel">
            <h1 className="sushi-challenge__heading">
              <span className="sushi-challenge__eyebrow">
                Weekly Challenge:
              </span>
              <br />
              <span className="sushi-challenge__title">Wither Wars</span>
            </h1>

            <div className="sushi-challenge__description">
              <h2 className="sushi-challenge__section-heading">
                How many Withers can you conquer?
              </h2>
              <p className="sushi-challenge__paragraph">
                The weekly battle is on! Summon, fight, and destroy as many
                Withers as you can before the challenge ends. The player who
                slays the most Withers will claim the ultimate prize:{" "}
                <strong className="sushi-challenge__prize">DIAMONDS!</strong>
              </p>

              <h2 className="sushi-challenge__section-heading-spaced">
                Slay. Conquer. Collect.
              </h2>
              <p className="sushi-challenge__paragraph-spaced">
                The more Withers you slay, the richer you get!
              </p>

              <h2 className="sushi-challenge__final-heading">
                Think you have what it takes to become the Wither Slayer of the
                Week?
              </h2>
            </div>
          </div>
        </div>
      </div>
    </FixedLayout>
  );
}
