import "./App.css";
import { useRef, useEffect } from "react";

function App() {
  const canvasRef = useRef(null);
  const kurpiksX = useRef(200);
  const kurpiksW = 40;
  const kurpiksH = 32;
  const y = useRef(200);
  const vy = useRef(0);
  const isJumping = useRef(false);
  const isGameOver = useRef(false);
  const scoreRef = useRef(0);
  const hasCollided = useRef(false);
  const plusEffect = useRef(null);

  const gravity = 0.08;
  const jumpPower = -18;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const kurpiksImg = new Image();
    kurpiksImg.src = "/kurpikscat.png";

    const badCatImg = new Image();
    badCatImg.src = "/badcat.png";

    const gameOverImg = new Image();
    gameOverImg.src = "/gameover.png";

    const dogImg = new Image();
    dogImg.src = "/kopkop.png";

    const mouseImg = new Image();
    mouseImg.src = "/mouse.png";

    const plusImg = new Image();
    plusImg.src = "/plus.png";

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

    let imagesLoaded = 0;
    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 6) {
        startGame();
      }
    };

    kurpiksImg.onload = onImageLoad;
    badCatImg.onload = onImageLoad;
    gameOverImg.onload = onImageLoad;
    dogImg.onload = onImageLoad;
    mouseImg.onload = onImageLoad;
    plusImg.onload = onImageLoad;

    const startGame = () => {
      const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.font = "16px monospace";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + scoreRef.current, 10, 20);

        if (isGameOver.current) {
          ctx.drawImage(
            badCatImg,
            kurpiksX.current,
            y.current,
            kurpiksW,
            kurpiksH
          );
          ctx.drawImage(gameOverImg, 100, 120, 200, 50);
          return;
        }

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

        ctx.drawImage(
          kurpiksImg,
          kurpiksX.current,
          y.current,
          kurpiksW,
          kurpiksH
        );

        mouse.x -= mouse.speed;
        if (mouse.x + mouse.width < 0) {
          mouse.x = canvas.width + Math.random() * 100;
          mouse.y = 150 + Math.random() * 50;
          hasCollided.current = false;
        }

        ctx.drawImage(mouseImg, mouse.x, mouse.y, mouse.width, mouse.height);

        dog.x -= dog.speed;
        if (dog.x + dog.width < 0) {
          dog.x = canvas.width + 100;
        }

        ctx.drawImage(dogImg, dog.x, dog.y, dog.width, dog.height);

        const kurpiksBox = {
          x: kurpiksX.current + 6,
          y: y.current + 4,
          width: kurpiksW - 12,
          height: kurpiksH - 8,
        };

        const dogBox = {
          x: dog.x + 6,
          y: dog.y + 4,
          width: dog.width - 12,
          height: dog.height - 8,
        };

        const isDogColliding =
          kurpiksBox.x < dogBox.x + dogBox.width &&
          kurpiksBox.x + kurpiksBox.width > dogBox.x &&
          kurpiksBox.y < dogBox.y + dogBox.height &&
          kurpiksBox.y + kurpiksBox.height > dogBox.y;

        if (isDogColliding) {
          console.log("Çarpışma oldu");
          isGameOver.current = true;
        }

        const isMouseColliding =
          kurpiksBox.x < mouse.x + mouse.width &&
          kurpiksBox.x + kurpiksBox.width > mouse.x &&
          kurpiksBox.y < mouse.y + mouse.height &&
          kurpiksBox.y + kurpiksBox.height > mouse.y;

        const isAboveMouse = kurpiksBox.y + kurpiksBox.height < mouse.y + 5;

        if (isMouseColliding && !isAboveMouse && !hasCollided.current) {
          console.log("PUAN ALINDI");
          scoreRef.current++;

          plusEffect.current = {
            x: kurpiksBox.x + 10,
            y: kurpiksBox.y - 10,
            opacity: 1,
          };

          hasCollided.current = true;

          mouse.x = canvas.width + 500 + Math.random() * 100;
          mouse.y = 150 + Math.random() * 50;
        }
        if (mouse.x + mouse.width < 0) {
          mouse.x = canvas.width + Math.random() * 100;
          mouse.y = 150 + Math.random() * 50;
          hasCollided.current = false;
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
      if (e.code === "Space" && !isJumping.current && !isGameOver.current) {
        vy.current = jumpPower;
        isJumping.current = true;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="kurpiks-app-container">
      <canvas
        className="kurpiks-canvas"
        width={400}
        height={300}
        ref={canvasRef}
      />
    </div>
  );
}

export default App;
