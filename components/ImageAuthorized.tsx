import { fetchImage } from "@/utils";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Image from "next/image";

export const ImageAuthorized = async ({
  cookie,
  src,
  width,
  height,
  className,
  alt = "image",
  loading = "eager",
  priority,
}: {
  cookie: string | undefined | RequestCookie;
  src: string;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}) => {
  if (!cookie) {
    throw new Error(`No cookie found for ${alt}`);
  }

  const imageSrc = await fetchImage(src, cookie);

  return (
    <Image
      alt={alt}
      src={imageSrc}
      className={className}
      priority={priority}
      width={width}
      height={height}
      loading={loading}
    />
  );
};

export default ImageAuthorized;
