type IconProps = {
  src: string;
  size?: number;
  alt?: string;
  className?: string;
};

export function Icon({ src, size = 24, alt = "", className }: IconProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
}
