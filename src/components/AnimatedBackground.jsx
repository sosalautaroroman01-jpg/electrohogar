import "./AnimatedBackground.css";

function AnimatedBackground() {
  return (
    <div className="background-container">

      {/* Luces */}
      <div className="light light1"></div>
      <div className="light light2"></div>
      <div className="light light3"></div>

      {/* Círculos de profundidad */}
      <div className="blur-circle circle1"></div>
      <div className="blur-circle circle2"></div>
      <div className="blur-circle circle3"></div>

      {/* Partículas */}
      <div className="particles">
        {Array.from({ length: 90 }).map((_, i) => (
          <span key={i}></span>
        ))}
      </div>

    </div>
  );
}

export default AnimatedBackground;