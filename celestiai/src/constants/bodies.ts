// constants/bodies.ts
export type CelestialBody = {
  id: string;
  name: string;
  mu: number;         // km^3/s^2
  radiusKm: number;
  texture?: string;
};

export const BODIES = [
  {
    id: "sun",
    name: "Sun",
    mu: 1.32712440018e11,
    radiusKm: 695700,
    texture: "https://solartextures.b-cdn.net/2k_sun.jpg",
  },
  {
    id: "mercury",
    name: "Mercury",
    mu: 22032,
    radiusKm: 2439.7,
    texture: "https://www.solarsystemscope.com/textures/download/2k_mercury.jpg",
  },
  {
    id: "venus",
    name: "Venus",
    mu: 324859,
    radiusKm: 6051.8,
    texture: "https://solartextures.b-cdn.net/2k_venus_atmosphere.jpg",
  },
  {
    id: "earth",
    name: "Earth",
    mu: 398600.4418,
    radiusKm: 6371,
    texture: "https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg",
  },
  {
    id: "moon",
    name: "Moon",
    mu: 4902.800066,
    radiusKm: 1737.5,
    texture: "https://solartextures.b-cdn.net/2k_moon.jpg",
  },
  {
    id: "mars",
    name: "Mars",
    mu: 42828.375214,
    radiusKm: 3389.5,
    texture: "https://solartextures.b-cdn.net/2k_mars.jpg",
  },
  {
    id: "jupiter",
    name: "Jupiter",
    mu: 1.26686534e8,
    radiusKm: 69911,
    texture: "https://solartextures.b-cdn.net/2k_jupiter.jpg",
  },
  {
    id: "saturn",
    name: "Saturn",
    mu: 3.7931187e7,
    radiusKm: 58232,
    texture: "https://www.solarsystemscope.com/textures/download/2k_saturn.jpg",
  },
  {
    id: "uranus",
    name: "Uranus",
    mu: 5.793939e6,
    radiusKm: 25362,
    texture: "https://solartextures.b-cdn.net/2k_uranus.jpg",
  },
  {
    id: "neptune",
    name: "Neptune",
    mu: 6.836529e6,
    radiusKm: 24622,
    texture: "https://www.solarsystemscope.com/textures/download/2k_neptune.jpg",
  },
];

