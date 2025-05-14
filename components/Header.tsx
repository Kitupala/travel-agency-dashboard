import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { ButtonComponent } from "@syncfusion/ej2-react-buttons";

interface HeaderProps {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  title: string;
  description: string;
  ctaText?: string;
  ctaUrl?: string;
}

const Header = ({
  as: Comp = "h1",
  title,
  description,
  ctaText,
  ctaUrl,
}: HeaderProps) => {
  const location = useLocation();

  return (
    <header className="header">
      <article>
        <Comp
          className={cn(
            "text-dark-100",
            location.pathname === "/"
              ? "text-2xl md:text-4xl font-bold"
              : "text-xl md:text-2xl font-semibold",
          )}
        >
          {title}
        </Comp>
        <p
          className={cn(
            "text-gray-100 font-normal",
            location.pathname === "/"
              ? "text-base md:text-lg"
              : "text-sm md:text-lg",
          )}
        >
          {description}
        </p>
      </article>

      {ctaText && ctaUrl && (
        <Link to={ctaUrl}>
          <ButtonComponent
            type="button"
            className="button-class h-11 w-full md:w-[240px]"
          >
            <img src="/assets/icons/plus.svg" alt="plus" className="size-5" />
            <span className="p-16-semibold text-white">{ctaText}</span>
          </ButtonComponent>
        </Link>
      )}
    </header>
  );
};

export default Header;
