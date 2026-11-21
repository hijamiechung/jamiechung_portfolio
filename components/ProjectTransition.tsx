/// <reference types="react/canary" />
"use client";

import { ViewTransition, type ReactNode } from "react";

// Shared-element morph: the card thumbnail and the detail hero share a name per id,
// so navigating between them animates one object instead of swapping two.
export function ProjectTransition({id, children}: {id: string; children: ReactNode}) {
  return <ViewTransition name={`thumbnail-${id}`} share="thumbnail-expand" default="none">{children}</ViewTransition>;
}
