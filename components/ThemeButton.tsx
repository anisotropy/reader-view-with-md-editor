import classNames from "classnames";
import { useTheme } from "next-themes";
import { useState } from "react";
import Button from "./Button";
import Moon from "./icons/Moon";
import MoonFilled from "./icons/MoonFilled";
import Sun from "./icons/Sun";
import SunFilled from "./icons/SunFilled";
import System from "./icons/System";

const block = <T,>(callback: () => T) => callback();

export default function ThemeButton() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [openMenu, setOpenMenu] = useState(false);

  const Icon = block(() => {
    if (theme === "system") {
      return systemTheme === "dark" ? Moon : Sun;
    } else {
      return theme === "dark" ? MoonFilled : SunFilled;
    }
  });

  const buttonClass =
    "relative text-left leading-none outline-offset-2 outline-slate-700 hover:-top-px hover:-left-px text-sm";

  const menuClass = classNames(buttonClass, "block w-full p-1");

  const iconClass = "fill-slate-700 w-5 inline-block";

  const onOpenMenu = () => setOpenMenu(true);

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

  return (
    <div className="relative">
      <Button
        Icon={Icon}
        border
        circle
        className={classNames({ invisible: openMenu })}
        onClick={onOpenMenu}
      />
      {openMenu && (
        <div
          className={classNames(
            "z-50 absolute top-0 left-0 bg-white px-2 pt-1 pb-2 rounded drop-shadow",
            "border border-slate-700 min-w-max space-y-2"
          )}
        >
          <Icon className={classNames(iconClass, "ml-1")} />
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
  );
}
