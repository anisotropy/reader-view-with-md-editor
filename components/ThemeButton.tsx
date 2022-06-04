import classNames from "classnames";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Button from "./Button";
import Moon from "./icons/Moon";
import MoonFilled from "./icons/MoonFilled";
import Sun from "./icons/Sun";
import SunFilled from "./icons/SunFilled";
import System from "./icons/System";

const ModeButton = (props: {
  theme?: string;
  systemTheme?: string;
  onClick: () => void;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const Icon =
    !mounted || !props.theme
      ? Sun
      : props.theme === "system"
      ? props.systemTheme === "dark"
        ? Moon
        : Sun
      : props.theme === "dark"
      ? MoonFilled
      : SunFilled;
  return <Button Icon={Icon} border circle onClick={props.onClick} />;
};

export default function ThemeButton() {
  const { theme, systemTheme, setTheme } = useTheme();
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

  return (
    <div>
      <ModeButton
        theme={theme}
        systemTheme={systemTheme}
        onClick={onToggleMenu}
      />
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
