"use client";

import { usePathname } from "next/navigation";
import { PrototypeExperience, type FieldFactory } from "../PrototypeExperience";
import { createAtmosphereField } from "./createAtmosphereField";
import { atmosphereConfig } from "./config";
import styles from "./Atmosphere.module.css";

const noField: FieldFactory = () => ({ setEnv() {}, setMouse() {}, resize() {}, stop() {} });

export function AtmosphereExperience() {
  const home = usePathname() === "/";
  return <PrototypeExperience
    fieldFactory={home ? createAtmosphereField : noField}
    fieldClassName={home ? styles.field : undefined}
    weatherRefreshMs={atmosphereConfig.weatherRefresh}
  />;
}
