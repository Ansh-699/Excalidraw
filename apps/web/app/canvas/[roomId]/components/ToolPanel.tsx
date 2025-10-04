// components/ToolPanel.tsx
import React from "react";
import { Square, Circle, Triangle, Pencil, Eraser } from "lucide-react";
import { ShapeType } from "../utils/shapes";

interface ToolPanelProps {
    currentTool: ShapeType;
    onSelect: (tool: ShapeType) => void;
}

const toolIcons = {
    rectangle: Square,
    circle: Circle,
    triangle: Triangle,
    pencil: Pencil,
    eraser: Eraser,
};

const toolLabels = {
    rectangle: "Rectangle",
    circle: "Circle", 
    triangle: "Triangle",
    pencil: "Pencil",
    eraser: "Eraser",
};

export default function ToolPanel({ currentTool, onSelect }: ToolPanelProps) {
    const tools: ShapeType[] = ["rectangle", "circle", "triangle", "pencil", "eraser"];
    
    return (
        <nav className="fixed top-5 left-1/2 transform -translate-x-1/2 z-10 card-glass px-4 py-3 animate-slide-up">
            <div className="flex items-center gap-2">
                {tools.map((tool) => {
                    const IconComponent = toolIcons[tool];
                    const isActive = currentTool === tool;
                    return (
                        <button
                            key={tool}
                            onClick={() => onSelect(tool)}
                            className={`
                                p-3 rounded-xl transition-all duration-200 flex items-center justify-center
                                hover:scale-105 active:scale-95 group relative
                                ${isActive 
                                    ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-glow' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                }
                            `}
                            title={toolLabels[tool]}
                        >
                            <IconComponent size={20} />
                            
                            {/* Tooltip */}
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                {toolLabels[tool]}
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}
