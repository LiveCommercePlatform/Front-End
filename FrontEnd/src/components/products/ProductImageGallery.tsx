import { useState } from "react";

type Media = {
  url: string;
  id: string;
};

type Props = {
  media?: Media[];
  title: string;
  owner?: boolean;
  OnDelete?: (id: string) => Promise<void>;
};

export default function ProductImageGallery({
  media = [],
  title,
  owner = false,
  OnDelete,
}: Props) {
  const [index, setIndex] = useState(0);

  if (!media.length) return null;

  const next = () => {
    setIndex((prev) => (prev + 1) % media.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  return (
    <div className="relative w-75">
      <img
        src={`http://localhost:8080${media[index]?.url}`}
        alt={title}
        className="w-full h-90 object-cover"
      />
      {owner && (
        <button
          type="button"
          className="absolute top-2 right-2 bg-black/60 text-white text-s px-2 rounded"
          onClick={() => {
            OnDelete?.(media[index].id);
            setIndex(0);
          }}
        >
          ✕
        </button>
      )}

      {media.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
          >
            ◀
          </button>

          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white px-2 py-1 rounded"
          >
            ▶
          </button>
        </>
      )}
    </div>
  );
}
