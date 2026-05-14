"use client";
import React, { useState, type HTMLAttributes, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type BlurIntensity = "sm" | "md" | "lg" | "xl";
type ShadowIntensity = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type GlowIntensity = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface LiquidGlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  draggable?: boolean;
  expandable?: boolean;
  width?: string;
  height?: string;
  expandedWidth?: string;
  expandedHeight?: string;
  blurIntensity?: BlurIntensity;
  shadowIntensity?: ShadowIntensity;
  borderRadius?: string;
  glowIntensity?: GlowIntensity;
}

const blurClasses: Record<BlurIntensity, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const shadowStyles: Record<ShadowIntensity, string> = {
  none: "inset 0 0 0 0 rgba(255, 255, 255, 0)",
  xs: "inset 1px 1px 1px 0 rgba(255, 255, 255, 0.18), inset -1px -1px 1px 0 rgba(255, 255, 255, 0.12)",
  sm: "inset 2px 2px 2px 0 rgba(255, 255, 255, 0.22), inset -2px -2px 2px 0 rgba(255, 255, 255, 0.14)",
  md: "inset 3px 3px 3px 0 rgba(255, 255, 255, 0.28), inset -3px -3px 3px 0 rgba(255, 255, 255, 0.18)",
  lg: "inset 4px 4px 4px 0 rgba(255, 255, 255, 0.34), inset -4px -4px 4px 0 rgba(255, 255, 255, 0.22)",
  xl: "inset 6px 6px 6px 0 rgba(255, 255, 255, 0.4), inset -6px -6px 6px 0 rgba(255, 255, 255, 0.26)",
  "2xl":
    "inset 8px 8px 8px 0 rgba(255, 255, 255, 0.46), inset -8px -8px 8px 0 rgba(255, 255, 255, 0.3)",
};

const glowStyles: Record<GlowIntensity, string> = {
  none: "0 4px 4px rgba(0, 0, 0, 0.25), 0 0 12px rgba(0, 0, 0, 0.2)",
  xs: "0 4px 6px rgba(0, 0, 0, 0.4), 0 0 14px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.04)",
  sm: "0 6px 10px rgba(0, 0, 0, 0.45), 0 0 18px rgba(0, 0, 0, 0.3), 0 0 28px rgba(255, 255, 255, 0.06)",
  md: "0 8px 16px rgba(0, 0, 0, 0.5), 0 0 22px rgba(0, 0, 0, 0.32), 0 0 36px rgba(255, 255, 255, 0.08)",
  lg: "0 10px 22px rgba(0, 0, 0, 0.55), 0 0 26px rgba(0, 0, 0, 0.34), 0 0 44px rgba(255, 255, 255, 0.1)",
  xl: "0 12px 28px rgba(0, 0, 0, 0.6), 0 0 30px rgba(0, 0, 0, 0.36), 0 0 52px rgba(255, 255, 255, 0.12)",
  "2xl":
    "0 14px 36px rgba(0, 0, 0, 0.65), 0 0 36px rgba(0, 0, 0, 0.4), 0 0 64px rgba(255, 255, 255, 0.14)",
};

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  className = "",
  draggable = false,
  expandable = false,
  width,
  height,
  expandedWidth,
  expandedHeight,
  blurIntensity = "xl",
  borderRadius = "20px",
  glowIntensity = "sm",
  shadowIntensity = "sm",
  ...rest
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpansion = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!expandable) return;
    const target = e.target as HTMLElement;
    if (target.closest("a, button, input, select, textarea")) return;
    setIsExpanded((v) => !v);
  };

  const containerVariants = expandable
    ? {
        collapsed: {
          width: width || "auto",
          height: height || "auto",
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] as const },
        },
        expanded: {
          width: expandedWidth || "auto",
          height: expandedHeight || "auto",
          transition: { duration: 0.4, ease: [0.5, 1.5, 0.5, 1] as const },
        },
      }
    : undefined;

  const Wrapper: React.ElementType = draggable || expandable ? motion.div : "div";

  const motionProps =
    draggable || expandable
      ? {
          variants: containerVariants,
          animate: expandable ? (isExpanded ? "expanded" : "collapsed") : undefined,
          onClick: expandable ? handleToggleExpansion : undefined,
          drag: draggable,
          dragConstraints: draggable
            ? { left: 0, right: 0, top: 0, bottom: 0 }
            : undefined,
          dragElastic: draggable ? 0.3 : undefined,
          dragTransition: draggable
            ? { bounceStiffness: 300, bounceDamping: 12, power: 0.3 }
            : undefined,
          whileDrag: draggable ? { scale: 1.02 } : undefined,
          whileHover: draggable || expandable ? { scale: 1.01 } : undefined,
          whileTap: draggable || expandable ? { scale: 0.99 } : undefined,
        }
      : {};

  return (
    <>
      {/* Hidden SVG turbulence filter for the liquid distortion */}
      <svg className="hidden" aria-hidden>
        <defs>
          <filter id="glass-blur" x="0" y="0" width="100%" height="100%" filterUnits="objectBoundingBox">
            <feTurbulence type="fractalNoise" baseFrequency="0.003 0.007" numOctaves="1" result="turbulence" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="180"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <Wrapper
        className={cn(
          "relative",
          draggable && "cursor-grab active:cursor-grabbing",
          expandable && "cursor-pointer",
          className,
        )}
        style={{
          borderRadius,
          ...(width && !expandable && { width }),
          ...(height && !expandable && { height }),
        }}
        {...motionProps}
        {...rest}
      >
        {/* Bend layer — backdrop blur with displacement filter */}
        <div
          className={cn("absolute inset-0 z-0", blurClasses[blurIntensity])}
          style={{ borderRadius, filter: "url(#glass-blur)" }}
        />

        {/* Glow layer */}
        <div
          className="absolute inset-0 z-10"
          style={{ borderRadius, boxShadow: glowStyles[glowIntensity] }}
        />

        {/* Inner highlight layer */}
        <div
          className="absolute inset-0 z-20"
          style={{ borderRadius, boxShadow: shadowStyles[shadowIntensity] }}
        />

        {/* Content */}
        <div className="relative z-30">{children}</div>
      </Wrapper>
    </>
  );
};

export default LiquidGlassCard;
