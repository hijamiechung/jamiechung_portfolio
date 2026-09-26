"use client";

import { usePathname } from "next/navigation";
import { PrototypeExperience, type FieldFactory } from "../PrototypeExperience";
import { createPixelField } from "../pixelWeather";
import { atmosphereConfig } from "./config";

const noField: FieldFactory = () => ({ setEnv() {}, setMouse() {}, resize() {}, stop() {} });

export function AtmosphereExperience() {
  const home = usePathname() === "/";
  return <PrototypeExperience
    fieldFactory={home ? createPixelField : noField}
    weatherRefreshMs={atmosphereConfig.weatherRefresh}
  />;
}
