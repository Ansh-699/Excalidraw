// components/ToolPanel.tsx
import React from "react";
import { Square, Circle, Triangle, Pencil, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiquidGlassCard } from "@/components/ui/liquid-weather-glass";
import { ShapeType, STROKE_COLORS, STROKE_WIDTHS } from "../utils/shapes";

interface ToolPanelProps {
  currentTool: ShapeType;
  onSelectTool: (tool: ShapeType) => void;
  strokeColor: string;
  onSelectColor: (color: string) => void;
  strokeWidth: number;
  onSelectWidth: (width: number) => void;
}

const toolIcons: Record<ShapeType, React.ComponentType<{ size?: number }>> = {
  rectangle: Square,
  circle: Circle,
  triangle: Triangle,
  pencil: Pencil,
  eraser: Eraser,
};

const toolLabels: Record<ShapeType, string> = {
  rectangle: "Rectangle",
  circle: "Circle",
  triangle: "Triangle",
  pencil: "Pencil",
  eraser: "Eraser",
};

export default function ToolPanel({
  currentTool,
  onSelectTool,
  strokeColor,
  onSelectColor,
  strokeWidth,
  onSelectWidth,
}: ToolPanelProps) {
  const tools: ShapeType[] = ["rectangle", "circle", "triangle", "pencil", "eraser"];

  return (
    <nav className="fixed top-5 left-1/2 z-10 -translate-x-1/2 animate-slide-up">
      <LiquidGlassCard
        shadowIntensity="sm"
        glowIntensity="xs"
        blurIntensity="xl"
        borderRadius="14px"
        className="bg-white/[0.06]"
      >
        <div className="flex items-center gap-3 px-3 py-2">
          {/* Shape tools */}
          <div className="flex items-center gap-1">
            {tools.map((tool) => {
              const Icon = toolIcons[tool];
              const isActive = currentTool === tool;
              return (
                <Button
                  key={tool}
                  onClick={() => onSelectTool(tool)}
                  variant="ghost"
                  size="icon"
                  className={
                    isActive
                      ? "h-9 w-9 bg-white text-black hover:bg-white/90"
                      : "h-9 w-9 text-white/70 hover:bg-white/[0.08] hover:text-white"
                  }
                  title={toolLabels[tool]}
                  aria-label={toolLabels[tool]}
                >
                  <Icon size={18} />
                </Button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-white/15" aria-hidden />

          {/* Color swatches */}
          <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Stroke color">
            {STROKE_COLORS.map((color) => {
              const isActive = strokeColor === color;
              return (
                <button
                  key={color}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Color ${color}`}
                  onClick={() => onSelectColor(color)}
                  className={
                    "h-6 w-6 rounded-full border transition-transform " +
                    (isActive
                      ? "scale-110 border-white"
                      : "border-white/20 shadow-sm hover:scale-105 hover:border-white/40")
                  }
                  style={{ backgroundColor: color }}
                />
              );
            })}
          </div>

          <div className="h-6 w-px bg-white/15" aria-hidden />

          {/* Stroke widths */}
          <div className="flex items-center gap-1" role="radiogroup" aria-label="Stroke width">
            {STROKE_WIDTHS.map((w) => {
              const isActive = strokeWidth === w;
              return (
                <button
                  key={w}
                  type="button"
                  role="radio"
                  aria-checked={isActive}
                  aria-label={`Stroke width ${w}`}
                  onClick={() => onSelectWidth(w)}
                  className={
                    "flex h-8 w-8 items-center justify-center rounded-md transition-colors " +
                    (isActive
                      ? "bg-white text-black"
                      : "text-white/70 hover:bg-white/[0.08] hover:text-white")
                  }
                >
                  <span
                    className="block rounded-full bg-current"
                    style={{ width: `${w + 2}px`, height: `${w + 2}px` }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </LiquidGlassCard>
    </nav>
  );
}
