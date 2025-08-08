import { useEffect } from "react";
import { useCubeStore, movesFromString } from "../state/cubeStore";
import { useLanguage } from "../contexts/LanguageContext";

export function KeyboardHandler() {
  const { language } = useLanguage();
  const enqueue = useCubeStore((s) => s.enqueueMoves);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      const prime = e.shiftKey ? "'" : "";
      const dbl = e.code === "Digit2" || e.key === "2" ? "2" : "";

      // English keys
      const englishKeys = ["U", "D", "L", "R", "F", "B"];

      // Hebrew keys mapping to English moves
      const hebrewKeys: { [key: string]: string } = {
        ע: "U", // עליון -> Up
        ת: "D", // תחתון -> Down
        ש: "L", // שמאל -> Left
        ימ: "R", // ימין -> Right (but this won't work as single key)
        ק: "F", // קדמי -> Front
        א: "B", // אחורי -> Back
      };

      let move = "";

      if (englishKeys.includes(key)) {
        move = key;
      } else if (hebrewKeys[key]) {
        move = hebrewKeys[key];
      }

      if (move) {
        // Prevent double modifier conflict
        const suffix = dbl ? "2" : prime;
        enqueue(movesFromString(`${move}${suffix}`));
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enqueue, language]);

  return null;
}
