"use client";

import React, { useState } from "react";
import { Layers } from "lucide-react";

export default function ProductGallery({
  primaryImage,
  gallery = [],
  name,
}: {
  primaryImage?: string | null;
  gallery?: string[];
  name: string;
  sku?: string | null;
}) {
  const allImages = Array.from(
    new Set([primaryImage, ...gallery].filter(Boolean) as string[])
  );
  const [activeImage, setActiveImage] = useState<string | null>(
    allImages[0] || null
  );

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#E5E0D5] bg-[#14171F] shadow-sm">
        {activeImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[#6B7280]">
            <Layers className="h-16 w-16 opacity-40" />
          </div>
        )}
      </div>

      {allImages.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {allImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(imgUrl)}
              className={`relative aspect-[4/3] cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                activeImage === imgUrl
                  ? "border-[#E05A2B] shadow-sm"
                  : "border-[#E5E0D5] opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgUrl}
                alt={`${name} view ${idx + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
