import { renderSocialImage, socialImageParams, socialImageSize, type SocialImageProps } from "./_social-image";

export const size = socialImageSize;
export const contentType = "image/png";
export const alt = "The Mochi Journal";

export const generateStaticParams = socialImageParams;

export default function Image(props: SocialImageProps) {
  return renderSocialImage(props);
}
