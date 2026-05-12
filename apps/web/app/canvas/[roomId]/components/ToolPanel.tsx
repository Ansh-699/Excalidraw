// components/ToolPanel.tsx
import React from "react";
import { Square, Circle, Triangle, Pencil, Eraser } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ShapeType,
  STROKE_COLORS,
  STROKE_WIDTHS,
} from "../utils/shapes";

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
    <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-10 card-glass px-4 py-3 animate-slide-up">
      <div className="flex items-center gap-3">
        {/* Shape tools */}
        <div className="flex items-center gap-2">
          {tools.map((tool) => {
            const IconComponent = toolIcons[tool];
            const isActive = currentTool === tool;
            return (
              <Button
                key={tool}
                onClick={() => onSelectTool(tool)}
                variant={isActive ? "default" : "ghost"}
                size="icon"
                className={`relative group ${
                  isActive
                    ? "bg-gradient-to-r from-primary-600 to-secondary-600 shadow-glow hover:from-primary-700 hover:to-secondary-700"
                    : "hover:bg-gray-100"
                }`}
                title={toolLabels[tool]}
                aria-label={toolLabels[tool]}
              >
                <IconComponent size={20} />
              </Button>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" aria-hidden />

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
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  isActive
                    ? "border-gray-900 scale-110"
                    : "border-white shadow hover:scale-110"
                }`}
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" aria-hidden />

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
                className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
                  isActive ? "bg-gray-900 text-white" : "hover:bg-gray-100 text-gray-700"
                }`}
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
    </nav>
  );
}
