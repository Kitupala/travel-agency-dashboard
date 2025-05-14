import { cn } from "~/lib/utils";
import { gridImages } from "~/constants";

const ImageGrid = () => {
  return (
    <div className="grid grid-cols-8 gap-2 md:gap-6 auto-rows-auto bg-none">
      {gridImages.map((image) => (
        <div
          key={image.id}
          className="relative overflow-hidden rounded-xl"
          style={{ gridArea: image.gridArea }}
        >
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <span
            className={cn(
              "absolute bottom-2 left-2 text-gray-50 bg-black/30 px-2 py-1 rounded-lg",
              image.type === "large" || image.type === "medium"
                ? "text-lg md:text-2xl"
                : "text-sm",
            )}
          >
            {image.title}
          </span>
          <article className="tripCard-pill left-4 !px-3.5 !text-red-100">
            {(Math.random() * (5 - 3.5) + 3.5).toFixed(1)} / 5
          </article>
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
