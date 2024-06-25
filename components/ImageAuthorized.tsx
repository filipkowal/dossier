import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Image from "next/image";

async function fetchImage(
  candidateImageUrl: string,
  cookie: string | RequestCookie
) {
  const response = await fetch(candidateImageUrl, {
    credentials: "include",
    headers: {
      Cookie:
        typeof cookie === "string" ? cookie : `${cookie.name}=${cookie.value}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch image", { cause: response });
  }

  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64String = Buffer.from(arrayBuffer).toString("base64");
  const mimeType = blob.type; // Get the MIME type of the image

  return `data:${mimeType};base64,${base64String}`;
}

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
