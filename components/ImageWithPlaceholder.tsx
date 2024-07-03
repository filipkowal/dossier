"use client";

import { fetchImage } from "@/utils";
import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";

export default function ImageWithPlaceholder({
  src,
  loadingPlaceholder,
  placeholder,
  width = 80,
  height = 80,
  className = "h-20 w-20 rounded-full object-cover",
  alt = "avatar",
}: {
  src?: string;
  loadingPlaceholder?: StaticImageData;
  placeholder?: StaticImageData;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}) {
  const [photo, setPhoto] = useState<string>();

  useEffect(() => {
    async function getImage() {
      if (src) {
        const image = await fetchImage(src);
        setPhoto(image);
      }
    }
    getImage();
  }, [src]);

  if (!src) {
    if (placeholder) {
      return (
        <Image
          src={placeholder}
          alt={alt}
          className={className}
          width={width}
          height={height}
        />
      );
    }
    return null;
  }

  return photo ? (
    <Image
      src={photo}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  ) : loadingPlaceholder ? (
    <Image
      src={loadingPlaceholder}
      alt={alt}
      className={`${className} blur-md`}
      width={width}
      height={height}
    />
  ) : (
    <div
      className={`${className} w-${width}px h-${height}px bg-digitalent-blue pulse-brightness`}
    />
  );
}
