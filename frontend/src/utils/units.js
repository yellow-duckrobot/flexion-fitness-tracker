// src/utils/units.js — metric/imperial conversions based on saved preference
export const getUnits = () =>
  (JSON.parse(localStorage.getItem("flexion_settings") || "{}").units) === "imperial" ? "imperial" : "metric";

export const kgToUnit = (kg, units = getUnits()) =>
  units === "imperial" ? +(kg * 2.20462).toFixed(1) : kg;

export const weightLabel = (units = getUnits()) => (units === "imperial" ? "lb" : "kg");