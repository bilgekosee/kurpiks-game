import "./App.css";
import { useRef, useEffect } from "react";

function App() {
  const canvasRef = useRef(null);
  const scoreRef = useRef(0);
  const plusEffect = useRef(null);
  const kurpiksX = useRef(200);
  const kurpiksW = 40;
  const kurpiksH = 32;
  const hasCollided = useRef(false);
  const currentCatImg = useRef(null);

  const y = useRef(200);
  const vy = useRef(0);
  const isJumping = useRef(false);
  const gravity = 0.1;
  const jumpPower = -15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = "/kurpikscat.png";

    const mouseImg = new Image();
    mouseImg.src = "/mouse.png";

    const plusImg = new Image();
    plusImg.src = "/plus.png";

    const badCatImg = new Image();
    badCatImg.src = "/badcat.png";

    const mouse = {
      x: 400,
      y: 210,
      width: 32,
      height: 32,
      speed: 3,
    };

    const dog = {
      x: 500,
      y: 210,
      width: 32,
      height: 32,
      speed: 2.5,
    };
    const dogImg = new Image();
    dogImg.src = "/kopkop.png";

    let imagesLoaded = 0;
    const checkAllLoaded = () => {
      imagesLoaded++;
      if (imagesLoaded === 4) {
        startGame();
      }
    };

    img.onload = checkAllLoaded;
    currentCatImg.current = img;

    mouseImg.onload = checkAllLoaded;
    plusImg.onload = checkAllLoaded;
    dogImg.onload = checkAllLoaded;

    const startGame = () => {
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
        }

        ctx.fillStyle = "black";
        ctx.font = "20px Arial";
        ctx.fillText("Kurpiks burada!", 100, 50);
        ctx.drawImage(
          currentCatImg.current,
          kurpiksX.current,
          y.current,
          kurpiksW,
          kurpiksH
        );

        mouse.x -= mouse.speed;
        if (mouse.x + mouse.width < 0) {
          mouse.x = canvas.width + Math.random() * 100;
          hasCollided.current = false;
        }
        dog.x -= dog.speed;
        if (dog.x + dog.width < 0) {
          dog.x = canvas.width + Math.random() * 200;
        }
        ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);
        ctx.strokeStyle = "brown";
        ctx.strokeRect(dog.x, dog.y, dog.width, dog.height);

        ctx.drawImage(mouseImg, mouse.x, mouse.y, mouse.width, mouse.height);

        const kurpiksBox = {
          x: kurpiksX.current,
          y: y.current,
          width: kurpiksW,
          height: kurpiksH,
        };

        const isColliding =
          kurpiksBox.x < mouse.x + mouse.width &&
          kurpiksBox.x + kurpiksBox.width > mouse.x &&
          kurpiksBox.y < mouse.y + mouse.height &&
          kurpiksBox.y + kurpiksBox.height > mouse.y;
        const isDogColliding =
          kurpiksBox.x < dog.x + dog.width &&
          kurpiksBox.x + kurpiksBox.width > dog.x &&
          kurpiksBox.y < dog.y + dog.height &&
          kurpiksBox.y + kurpiksBox.height > dog.y;

        if (isDogColliding) {
          console.log("💀 GAME OVER!");
          currentCatImg.current = badCatImg;
        }

        ctx.strokeStyle = "yellow";
        ctx.strokeRect(
          kurpiksBox.x,
          kurpiksBox.y,
          kurpiksBox.width,
          kurpiksBox.height
        );

        ctx.strokeStyle = "magenta";
        ctx.strokeRect(mouse.x, mouse.y, mouse.width, mouse.height);

        const isAboveMouse = kurpiksBox.y + kurpiksBox.height < mouse.y + 5;

        if (isColliding && !isAboveMouse && !hasCollided.current) {
          console.log("✔ PUAN ALINDI");

          scoreRef.current++;

          plusEffect.current = {
            x: kurpiksBox.x + 10,
            y: kurpiksBox.y - 10,
            opacity: 1,
          };

          hasCollided.current = true;

          mouse.x = canvas.width + 300 + Math.random() * 100;
          mouse.y = 150 + Math.random() * 50;
        }

        if (plusEffect.current) {
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
