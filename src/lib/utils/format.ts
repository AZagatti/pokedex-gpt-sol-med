export const titleCase = (value: string) =>
  value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export const dexNumber = (id: number) => `#${id.toString().padStart(4, "0")}`;

export const statLabel = (name: string) =>
  ({
    hp: "HP",
    attack: "Attack",
    defense: "Defense",
    "special-attack": "Sp. Atk",
    "special-defense": "Sp. Def",
    speed: "Speed",
  })[name] ?? titleCase(name);
