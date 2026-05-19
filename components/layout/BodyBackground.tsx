"use client";

import { useEffect } from "react";
import { asset } from "@/lib/assetPath";

export function BodyBackground() {
  useEffect(() => {
    document.body.style.backgroundImage = `url(${asset("/images/background.jpg")})`;
  }, []);

  return null;
}
