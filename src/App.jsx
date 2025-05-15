import "./App.css";
import { useRef, useEffect } from "react";
function App() {
  const canvasRef = useRef(null);

  const y = useRef(200);
  const vy = useRef(0);
  const isJumping = useRef(false);
  const gravity = 0.5;
  const jumpPower = -10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "/kurpikscat.png";

    img.onload = () => {
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (isJumping.current) {
          vy.current += gravity;
          y.current += vy.current;

          if (y.current < 20) {
            y.current = 20;
            vy.current = 0;
          }

          if (y.current >= 200) {
            y.current = 200;
            vy.current = 0;
            isJumping.current = false;
          }
        } else {
          y.current = 200;
          vy.current = 0;
          isJumping.current = false;
        }

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Kurpiks burada!", 100, 50);
        ctx.drawImage(img, 180, y.current, 40, 40);
        requestAnimationFrame(draw);
      };
      draw();
    };

    const handleKeyDown = (e) => {
      if (e.code === "Space" && !isJumping.current) {
        e.preventDefault();
        vy.current = jumpPower;
        isJumping.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <div className="kurpiks-app-container">
      <span>Kurpiks alanı</span>
      <canvas
        className="kurpiks-canvas"
        width={400}
        height={300}
        ref={canvasRef}
      ></canvas>
    </div>
  );
}

export default App;
