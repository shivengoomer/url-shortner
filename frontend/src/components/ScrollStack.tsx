import React, { useLayoutEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

export interface ScrollStackItemProps {
  itemClassName?: string;
  children: ReactNode;
}

export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = "",
}) => (
  <div
    className={`scroll-stack-card relative w-full p-0 rounded-[40px] shadow-[0_0_30px_rgba(0,0,0,0.1)] box-border origin-top will-change-transform ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: "hidden",
      transformStyle: "preserve-3d",
    }}
  >
    {children}
  </div>
);

interface ScrollStackProps {
  className?: string;
  children: ReactNode;
  itemDistance?: number;
  itemScale?: number;
  itemStackDistance?: number;
  stackPosition?: string;
  scaleEndPosition?: string;
  baseScale?: number;
  scaleDuration?: number;
  rotationAmount?: number;
  blurAmount?: number;
  useWindowScroll?: boolean;
  onStackComplete?: () => void;
}

const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = true,
  onStackComplete,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);
  const lenisRef = useRef<any>(null);
  const cardsRef = useRef<HTMLElement[]>([]);
  const lastTransformsRef = useRef(new Map<number, any>());
  const isUpdatingRef = useRef(false);

  const calculateProgress = useCallback(
    (scrollTop: number, start: number, end: number) => {
      if (scrollTop < start) return 0;
      if (scrollTop > end) return 1;
      return (scrollTop - start) / (end - start);
    },
    [],
  );

  const parsePercentage = useCallback(
    (value: string | number, containerHeight: number) => {
      if (typeof value === "string" && value.includes("%")) {
        return (parseFloat(value) / 100) * containerHeight;
      }
      return parseFloat(value as string);
    },
    [],
  );

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement,
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller,
      };
    }
  }, [useWindowScroll]);

  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        // Compute offset relative to the scroller container (not document)
        let offset = 0;
        let el: HTMLElement | null = element;
        const scroller = scrollerRef.current;
        while (el && el !== scroller) {
          offset += el.offsetTop;
          el = el.offsetParent as HTMLElement | null;
        }
        return offset;
      }
    },
    [useWindowScroll],
  );

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true;

    const { scrollTop, containerHeight, scrollContainer } = getScrollData();
    const containerWidth = useWindowScroll
      ? window.innerWidth
      : scrollerRef.current?.clientWidth || window.innerWidth;
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight,
    );

    const endElement = useWindowScroll
      ? (document.querySelector(".scroll-stack-end") as HTMLElement | null)
      : (scrollerRef.current?.querySelector(
          ".scroll-stack-end",
        ) as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    const getOriginalTop = (c: HTMLElement, index: number) => {
      const sChild = c.querySelector(".sticky") as HTMLElement | null;
      let cTop = sChild ? getElementOffset(sChild) : getElementOffset(c);
      const lTransform = lastTransformsRef.current.get(index);
      if (lTransform) {
        cTop -= lTransform.translateY;
      }
      return cTop;
    };

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      // Prefer the top of any .sticky child (the visible pinned portion)
      const cardTop = getOriginalTop(card, i);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd,
      );
      const targetScale = baseScale + i * itemScale;
      let scale = 1 - scaleProgress * (1 - targetScale);
      let rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

      let blur = 0;
      if (blurAmount) {
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getOriginalTop(cardsRef.current[j], j);
          const jTriggerStart =
            jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      let translateY = 0;
      let translateX = 0;
      let opacity = 1;

      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd;

      if (isPinned) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
      }

      // Fan Unstack Logic
      const unstackStart = pinEnd - 800; // Unstack uniformly over 800px
      const unstackProgress = calculateProgress(
        scrollTop,
        unstackStart,
        pinEnd,
      );

      if (unstackProgress > 0) {
        const totalCards = cardsRef.current.length;
        const midIndex = (totalCards - 1) / 2;
        const offsetFromCenter = i - midIndex;

        const fanScale = 0.65;
        const spreadX = 350; // horizontal pixels between cards
        const dropY = 60; // vertical drop to create an arc
        const angleSpread = 12; // degrees to fan out

        const fanTranslateX = offsetFromCenter * spreadX;

        let baseTranslateY = 0;
        if (isPinned) {
          baseTranslateY = scrollTop - cardTop + stackPositionPx;
        } else if (scrollTop > pinEnd) {
          baseTranslateY = pinEnd - cardTop + stackPositionPx;
        }

        const stackedTranslateY = baseTranslateY + itemStackDistance * i;
        const maxStackDistance = itemStackDistance * (totalCards - 1);
        
        // Cards drop slightly to form an arc
        const arcDropY = Math.abs(offsetFromCenter) * dropY;
        const fanTranslateY = baseTranslateY + maxStackDistance + arcDropY;

        translateY =
          stackedTranslateY * (1 - unstackProgress) +
          fanTranslateY * unstackProgress;
        translateX = fanTranslateX * unstackProgress;
        scale = scale * (1 - unstackProgress) + fanScale * unstackProgress;
        rotation = rotation * (1 - unstackProgress) + (offsetFromCenter * angleSpread) * unstackProgress;
        blur = blur * (1 - unstackProgress);
        opacity = 1; // Ensure full opacity
      }

      const newTransform = {
        translateX: Math.round(translateX * 100) / 100,
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
        opacity: Math.round(opacity * 100) / 100,
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs((lastTransform.translateX || 0) - newTransform.translateX) >
          0.1 ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001 ||
        Math.abs(lastTransform.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 0.1 ||
        Math.abs((lastTransform.opacity ?? 1) - newTransform.opacity) > 0.01;

      if (hasChanged) {
        const transform = `translate3d(${newTransform.translateX}px, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter =
          newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : "";

        card.style.transform = transform;
        card.style.filter = filter;
        card.style.opacity = newTransform.opacity.toString();

        lastTransformsRef.current.set(i, newTransform);
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.();
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false;
        }
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset,
  ]);

  const handleScroll = useCallback(() => {
    updateCardTransforms();
  }, [updateCardTransforms]);

  // Use native scroll + RAF loop instead of Lenis to avoid locking the scroller
  const setupScroller = useCallback(() => {
    const scrollerEl = useWindowScroll ? window : scrollerRef.current;
    if (!scrollerEl) return;

    const onScroll = () => {
      handleScroll();
    };

    if (useWindowScroll) {
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      (scrollerEl as HTMLElement).addEventListener("scroll", onScroll, {
        passive: true,
      });
    }

    const tick = () => {
      updateCardTransforms();
      animationFrameRef.current = requestAnimationFrame(tick);
    };
    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (useWindowScroll)
        window.removeEventListener("scroll", onScroll as EventListener);
      else
        (scrollerEl as HTMLElement).removeEventListener(
          "scroll",
          onScroll as EventListener,
        );
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [handleScroll, updateCardTransforms, useWindowScroll]);

  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll(".scroll-stack-card")
        : (scrollerRef.current?.querySelectorAll(".scroll-stack-card") ?? []),
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        // apply spacing to inner content instead of the root so sticky works
        const inner = card.querySelector(":scope > *") as HTMLElement | null;
        if (inner) inner.style.marginBottom = `${itemDistance}px`;
        else card.style.marginBottom = `${itemDistance}px`;
      }
      card.style.willChange = "transform, filter";
      card.style.transformOrigin = "top center";
      card.style.backfaceVisibility = "hidden";
      card.style.transform = "translateZ(0)";
      card.style.webkitTransform = "translateZ(0)";
      card.style.perspective = "1000px";
      card.style.webkitPerspective = "1000px";
    });

    const cleanup = setupScroller();

    updateCardTransforms();

    return () => {
      if (cleanup) cleanup();
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupScroller,
    updateCardTransforms,
  ]);

  return (
    <div
      className={`relative w-full h-full overflow-x-visible ${useWindowScroll ? "" : "overflow-y-auto"} ${className}`.trim()}
      ref={scrollerRef}
      style={{
        ...(useWindowScroll
          ? {}
          : {
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }),
        scrollBehavior: "smooth",
        WebkitTransform: "translateZ(0)",
        transform: "translateZ(0)",
        willChange: "scroll-position",
      }}
    >
      <div className="scroll-stack-inner pt-[5vh] px-20 pb-0">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end w-full h-px" />
      </div>
    </div>
  );
};

export default ScrollStack;
