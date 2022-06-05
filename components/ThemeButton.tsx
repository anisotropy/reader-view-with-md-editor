import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./Button";
import Moon from "./icons/Moon";
import MoonFilled from "./icons/MoonFilled";
import Sun from "./icons/Sun";
import SunFilled from "./icons/SunFilled";
import System from "./icons/System";

function useThemeMounted() {
  const { setTheme, themes, ...rest } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return !mounted
    ? {
        setTheme,
        themes,
        forcedTheme: undefined,
        theme: undefined,
        resolvedTheme: undefined,
        systemTheme: undefined,
      }
    : { setTheme, themes, ...rest };
}

export default function ThemeButton() {
  const { theme, systemTheme, setTheme } = useThemeMounted();
  const [openMenu, setOpenMenu] = useState(false);

  const menuClass = classNames(
    "relative text-left leading-none outline-offset-2 outline-slate-700 hover:-top-px hover:-left-px text-sm",
    "block w-full p-1"
  );

  const iconClass = "m-fill-slate w-5 inline-block";

  const onToggleMenu = () => {
    setOpenMenu((prevOpenMenu) => !prevOpenMenu);
  };

  const onSetLight = () => {
    setTheme("light");
    setOpenMenu(false);
  };

  const onSetDark = () => {
    setTheme("dark");
    setOpenMenu(false);
  };

  const onSetSystem = () => {
    setTheme("system");
    setOpenMenu(false);
  };

  const Icon = !theme
    ? Sun
    : theme === "system"
    ? systemTheme === "dark"
      ? Moon
      : Sun
    : theme === "dark"
    ? MoonFilled
    : SunFilled;

  return (
    <div>
      <Button Icon={Icon} border circle onClick={onToggleMenu} />
      <div className="relative">
        {openMenu && (
          <div
            className={classNames(
              "z-50 absolute top-px left-0 m-bg-white px-2 pt-1 pb-2 rounded drop-shadow",
              "border m-border-slate min-w-max space-y-2"
            )}
          >
            <button className={menuClass} onClick={onSetLight}>
              <SunFilled className={iconClass} /> Light
            </button>
            <button className={menuClass} onClick={onSetDark}>
              <MoonFilled className={iconClass} /> Dark
            </button>
            <button className={menuClass} onClick={onSetSystem}>
              <System className={iconClass} /> System
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
