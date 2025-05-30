"use client";
import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let clicked = false;
    let startX = 0;
    let startY = 0;

    const handleMouseDown = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      startX = event.clientX - rect.left;
      startY = event.clientY - rect.top;
      clicked = true;
    };

   const handleMouseUp = (event: MouseEvent) => {
  if (!clicked) return;
  clicked = false;

  const rect = canvas.getBoundingClientRect();
  const endX = event.clientX - rect.left;
  const endY = event.clientY - rect.top;
  const width = endX - startX;
  const height = endY - startY;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(startX, startY, width, height);
};


    const handleMouseMove = (event: MouseEvent) => {
      if (clicked) {
        const rect = canvas.getBoundingClientRect();
        const currentX = event.clientX - rect.left;
        const currentY = event.clientY - rect.top;
        const width = currentX - startX;
        const height = currentY - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeRect(startX, startY, width, height);
      }
    };

    const handleClick = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

    //   ctx.strokeRect(x - 10, y - 10, 20, 20);
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <canvas
        ref={canvasRef}
        id="canvas"
        width={2000}
        height={1920}
        style={{
          border: "1px solid black",
          cursor: "crosshair",
        }}
      ></canvas>
    </div>
  );
}
