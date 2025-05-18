import "./App.css";
import { useRef, useEffect } from "react";
function App() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const plusEffect = useRef(null);

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

    const mouseImg = new Image();
    mouseImg.src = "/mouse.png";
    const mouse = {
      x: 400,
      y: 200,
      width: 32,
      height: 32,
      speed: 1,
    };

    img.onload = () => {
      const plusImg = new Image();
      plusImg.src = "/plus.png";

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

        mouse.x -= mouse.speed;
        if (mouse.x < -mouse.width) {
          mouse.x = 400 + Math.random() * 100;
        }

        ctx.drawImage(mouseImg, mouse.x, mouse.y, mouse.width, mouse.height);

        const kurpiksX = 180;
        const kurpiksY = y.current;
        const kurpiksW = 40;
        const kurpiksH = 40;

        const isColliding =
          mouse.x < kurpiksX + kurpiksW &&
          mouse.x + mouse.width > kurpiksX &&
          mouse.y < kurpiksY + kurpiksH &&
          mouse.y + mouse.height > kurpiksY;

        if (isColliding && !isJumping.current && y.current >= 195) {
          scoreRef.current++;
          plusEffect.current = {
            x: kurpiksX + 10,
            y: kurpiksY - 10,
            opacity: 1,
          };

          mouse.x = 400 + Math.random() * 100;
        }
        if (plusEffect.current && plusImg.complete) {
          ctx.globalAlpha = plusEffect.current.opacity;
          ctx.drawImage(
            plusImg,
            plusEffect.current.x,
            plusEffect.current.y,
            16,
            16
          );
          ctx.globalAlpha = 1;

          plusEffect.current.opacity -= 0.01;
          plusEffect.current.y -= 0.5;

          if (plusEffect.current.opacity <= 0) {
            plusEffect.current = null;
          }
        }

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
