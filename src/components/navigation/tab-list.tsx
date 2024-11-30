"use client";

import React, {
  type ElementRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  indicatorClassName?: string;
}

const TabList = ({ className, value, indicatorClassName, ...props }: Props) => {
  const valueToIndex = useMemo(() => new Map<string, number>(), []);
  const tablistRef = useRef<ElementRef<"div">>(null);
  const scrollRef = useRef<ElementRef<"div">>(null);
  const [indicatorStyle, setIndicatorStyle] =
    useState<Record<string, string | number>>();

  useEffect(() => {
    const getTabsMeta = () => {
      const tablistNode = tablistRef.current;
      let tablistMeta: any;
      if (tablistNode) {
        const rect = tablistNode.getBoundingClientRect();
        tablistMeta = {
          clientWidth: tablistNode.clientWidth,
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
        };
      }
      let tabMeta: DOMRect | null = null;
      if (tablistNode && value) {
        const children = tablistRef.current.children;
        if (children.length > 0) {
          const index = valueToIndex.get(value);
          const tab = typeof index === "number" ? children[index] : null;
          tabMeta = tab ? tab.getBoundingClientRect() : null;
        }
      }
      return {
        tablistMeta,
        tabMeta,
      };
    };

    const updateIndicatorState = () => {
      const { tabMeta, tablistMeta } = getTabsMeta();
      const tabMetaOffsetX: number = tabMeta?.x || 0;
      const tabListLeft: number = tablistMeta?.left || 0;
      const newIndicatorStyle = {
        transform: `translateX(${tabMetaOffsetX - tabListLeft || 0}px)`,
        width: tabMeta ? tabMeta.width : 0,
      };
      setIndicatorStyle(newIndicatorStyle);
    };

    updateIndicatorState();
  }, [value, valueToIndex]);

  let childIndex = 0;
  const children = React.Children.map(props.children, (child) => {
    if (!React.isValidElement(child)) {
      return null;
    }
    const childValue =
      child.props.value === undefined ? childIndex : child.props.value;
    valueToIndex.set(childValue, childIndex);
    const isActive = childValue === value;
    childIndex += 1;
    return React.cloneElement(child as React.ReactElement, {
      isActive,
    });
  });

  return (
    <div className="relative">
      <div className="overflow-auto" ref={scrollRef}>
        <div
          className={cn(
            "h-0.5 bg-primary absolute bottom-0 transition rounded-full shrink-0 overflow-x-hidden duration-200 ease-in-out",
            indicatorClassName,
          )}
          style={{
            ...indicatorStyle,
            transitionProperty: "all",
            animationDuration: "3s",
            animationTimingFunction: "ease-in-out",
          }}
        />
        <div
          ref={tablistRef}
          className={cn("flex items-center gap-2", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default TabList;
