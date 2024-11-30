"use client";

import type { ComponentProps } from "react";
import { forwardRef } from "react";

import Link from "next/link";

import { useViewTransitionRouter } from "@/hooks/use-view-transition-router";

interface Props extends ComponentProps<typeof Link> {}

const ViewTransitionsLink = forwardRef<HTMLAnchorElement, Props>(
  ({ ...nextLinkProps }, ref) => {
    const router = useViewTransitionRouter();

    const handleLinkClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();

      router.push(e.currentTarget.href.toString());
    };

    return <Link {...nextLinkProps} ref={ref} onClick={handleLinkClick} />;
  },
);

ViewTransitionsLink.displayName = "ViewTransitionsLink";

export default ViewTransitionsLink;
