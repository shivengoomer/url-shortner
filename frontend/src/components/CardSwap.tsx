import {
  useState,
  useEffect,
  useRef,
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
} from "react";

interface CardProps {
  children?: ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export const Card = ({ children, style, className }: CardProps) => (
  <div style={style} className={className}>
    {children}
  </div>
);

interface CardSwapProps {
  children: ReactNode;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
}

export default function CardSwap({
  children,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 4000,
  pauseOnHover = false,
}: CardSwapProps) {
  const cards = Children.toArray(children);
  const total = cards.length;
  // order[total-1] = front card
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const paused = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      if (paused.current) return;
      setOrder((prev) => {
        const next = [...prev];
        const front = next.pop()!;
        next.unshift(front);
        return next;
      });
    }, delay);
    return () => clearInterval(id);
  }, [delay]);

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100%" }}
      onMouseEnter={() => {
        if (pauseOnHover) paused.current = true;
      }}
      onMouseLeave={() => {
        if (pauseOnHover) paused.current = false;
      }}
    >
      {order.map((cardIndex, stackPos) => {
        const depth = total - 1 - stackPos; // 0 = front, increases to back
        const posStyle: React.CSSProperties = {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: stackPos + 1,
          opacity: depth === 0 ? 1 : Math.max(0.5, 1 - depth * 0.15),

          transform: `translateX(${depth * cardDistance}px) translateY(${-(depth * verticalDistance)}px) scale(${1 - depth * 0.04})`,
          transition:
            "transform 700ms cubic-bezier(0.4,0,0.2,1), opacity 700ms ease",
          transformOrigin: "bottom left",
          willChange: "transform, opacity",
        };

        const child = cards[cardIndex];
        if (isValidElement(child) && child.type === Card) {
          return cloneElement(child as React.ReactElement<CardProps>, {
            key: cardIndex,
            style: posStyle,
          });
        }
        return (
          <div key={cardIndex} style={posStyle}>
            {child}
          </div>
        );
      })}
    </div>
  );
}
