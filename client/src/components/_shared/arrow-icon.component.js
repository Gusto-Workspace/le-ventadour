import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";

const arrowIcons = {
  down: ArrowDown,
  left: ArrowLeft,
  right: ArrowRight,
  "up-right": ArrowUpRight,
};

export default function ArrowIcon({ direction = "up-right", size = 20, strokeWidth = 1.2, className = "" }) {
  const Icon = arrowIcons[direction] || ArrowUpRight;
  return <Icon className={`site-arrow${className ? ` ${className}` : ""}`} size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
}
