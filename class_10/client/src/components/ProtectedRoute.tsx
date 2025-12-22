"use client";

import type { ReactNode } from "react";
import { RedirectToSignIn, useUser } from "@clerk/clerk-react";
import Loading from "./Loading";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return <Loading size="2xl" type="fullscreen"/>;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return <>{children}</>;
}