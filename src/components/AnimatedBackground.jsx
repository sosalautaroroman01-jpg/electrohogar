import "./AnimatedBackground.css";

function AnimatedBackground() {
  return (
    <>
      <div className="wave wave1"></div>
      <div className="wave wave2"></div>

      <div className="ball">⚽</div>

      <div className="particles">
        {Array.from({ length: 40 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>
    </>
  );
}

export default AnimatedBackground;