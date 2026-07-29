import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";


type Theme =
  | "light"
  | "dark";


interface ThemeContextValue {

  theme: Theme;

  toggleTheme(): void;
}


const ThemeContext =
  createContext<ThemeContextValue | null>(
    null
  );


export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [theme, setTheme] =
    useState<Theme>(() => {

      const saved =
        localStorage.getItem(
          "theme"
        );


      return saved === "dark"
        ? "dark"
        : "light";
    });


  useEffect(() => {

    const root =
      document.documentElement;


    root.classList.toggle(
      "dark",
      theme === "dark"
    );


    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);



  function toggleTheme() {

    setTheme(
      previous =>
        previous === "light"
          ? "dark"
          : "light"
    );
  }


  const value =
    useMemo(
      () => ({
        theme,
        toggleTheme,
      }),
      [theme]
    );


  return (
    <ThemeContext.Provider
      value={value}
    >
      {children}
    </ThemeContext.Provider>
  );
}


export function useTheme() {

  const context =
    useContext(
      ThemeContext
    );


  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider."
    );
  }


  return context;
}
