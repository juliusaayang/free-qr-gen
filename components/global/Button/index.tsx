import Link from "next/link";
import type { ReactNode, ButtonHTMLAttributes } from "react";

type Theme = "primary" | "secondary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

type ButtonBase = {
  children: ReactNode;
  theme?: Theme;
  size?: Size;
  className?: string;
  disabled?: boolean;
};

type ButtonAsButton = ButtonBase &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    tag?: "button";
    href?: never;
    isExternal?: never;
  };

type ButtonAsLink = ButtonBase & {
  tag: "a";
  href: string;
  isExternal?: boolean;
  onClick?: never;
  type?: never;
};

type Props = ButtonAsButton | ButtonAsLink;

const themeClasses: Record<Theme, string> = {
  primary:
    "bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
  secondary: "bg-primary-medium text-primary hover:bg-blue-200",
  outline: "border border-primary text-primary hover:bg-primary-light",
  ghost: "text-tc-secondary hover:bg-gray-100",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors duration-150 cursor-pointer";

const Button = ({
  children,
  theme = "primary",
  size = "md",
  className = "",
  ...rest
}: Props) => {
  const classes = `${base} ${themeClasses[theme]} ${sizeClasses[size]} ${className}`;

  if (rest.tag === "a") {
    const { tag: _, href, isExternal, ...linkProps } = rest;
    if (isExternal) {
      return (
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={classes}
          {...(linkProps as object)}
        >
          {children}
        </Link>
      );
    }
    return (
      <Link href={href} className={classes} {...(linkProps as object)}>
        {children}
      </Link>
    );
  }

  const { tag: _, ...btnProps } = rest as ButtonAsButton & { tag?: "button" };
  return (
    <button className={classes} {...btnProps}>
      {children}
    </button>
  );
};

export default Button;
