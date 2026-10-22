/* eslint-disable */
import { gsap } from "gsap";
import {
  Blobs1,
  Blobs2,
  Blobs3,
  positions,
  Blobs4,
} from "./blob";
import { useEffect, useRef } from "react";
import { cn } from "../../../lib/utils";
import { IMAGES } from "../../../assets/images/images";
import { ImageWithFallback } from "../../../app/components/figma/ImageWithFallback";
import { UserRole } from "../dialog/data";

let animate1: any = null;
let animate2: any = null;
let animate3: any = null;
let animate4: any = null;

interface BlobAnimationNisaProps {
  size?: number; // ukuran dinamis (px)
  showLogo?: boolean;

  iconState?:
    | "idle"
    | "speaking"
    | "waiting"
    | "recording"
    | "loading"
    | "inactive"
    | "paused";
  aiState?:
    | "waiting"
    | "thinking"
    | "listening"
    | "idle"
    | "speaking";
  onStopAudioNisa?: () => void;
  onStartRecordinng?: () => Promise<void>;
  onStopRecording?: () => Promise<void>;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  disabled?: boolean;
  role?: UserRole; // Added role prop
}

const BlobAnimationNisa = ({
  size = 320,
  iconState,
  className,
  onClick,
  disabled,
  aiState,
  role = "peserta",
}: BlobAnimationNisaProps) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(
    undefined,
  );

  const blobRef1 = useRef(null);
  const blobRef2 = useRef(null);
  const blobRef3 = useRef(null);
  const blobRef4 = useRef(null);

  const circleRef1 = useRef(null);
  const circleRef2 = useRef(null);
  const circleRef3 = useRef(null);
  const circleRef4 = useRef(null);

  const staticSvgRef = useRef(null);

  const scale = [1, 2];

  const animateCirlce = (
    blob: any,
    scaleArray: any,
    delay: any,
  ) => {
    if (!blob) return null;
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: delay,
    });

    scaleArray.forEach((scaleData: any) => {
      tl.to(blob, {
        duration: 1,
        scale: scaleData,
        ease: "power1.inOut",
        transformOrigin: "center center",
      });
    });

    return tl;
  };

  const animateBlob = (blob: any, paths: any, delay: any) => {
    if (!blob) return null;
    const tl = gsap.timeline({
      repeat: -1,
      yoyo: true,
      delay: delay,
    });

    paths.forEach((path: any) => {
      tl.to(blob, {
        duration: 3,
        attr: { d: path },
        ease: "power1.inOut",
        transformOrigin: "center center",
      });
    });

    return tl;
  };

  const floatingAnimation = () => {
    if (!staticSvgRef.current) return null;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    positions.forEach((pos) => {
      tl.to(staticSvgRef.current, {
        duration: 3,
        x: pos.x,
        y: pos.y,
        ease: "power1.inOut",
        transformOrigin: "center center",
      });
    });
    return tl;
  };

  useEffect(() => {
    animate1 = animateBlob(blobRef1.current, Blobs1, 0);
    animate2 = animateBlob(blobRef2.current, Blobs2, 1.5);
    animate3 = animateBlob(blobRef3.current, Blobs3, 3);
    animate4 = animateBlob(blobRef4.current, Blobs4, 4.5);

    const floatingAnim = floatingAnimation();

    return () => {
      animate1?.kill();
      animate2?.kill();
      animate3?.kill();
      animate4?.kill();
      floatingAnim?.kill();
      clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (iconState === "speaking") {
      const c1 = animateCirlce(circleRef1.current, scale, 0);
      const c2 = animateCirlce(circleRef2.current, scale, 1.5);
      const c3 = animateCirlce(circleRef3.current, scale, 3);
      const c4 = animateCirlce(circleRef4.current, scale, 4.5);

      return () => {
        c1?.kill();
        c2?.kill();
        c3?.kill();
        c4?.kill();
      };
    }
  }, [iconState]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (onClick) onClick(e);
  };

  return (
    <div
      className={cn(
        "relative flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-300",
        className,
        disabled &&
          "cursor-not-allowed opacity-50 hover:scale-100",
      )}
      style={{ width: size, height: size }}
      onClick={handleClick}
    >
      {/* Blob SVG di belakang */}
      <svg
        className={cn(`absolute z-0`)}
        style={{ width: size, height: size }}
        viewBox="0 0 160 193"
        fill="none"
      >
        <defs>
          {/* Gradient */}
          <linearGradient
            id="gradient2"
            x1="0%"
            y1="0%"
            x2="100%"
          >
            <stop stopColor="#37C6C3" />
            <stop
              offset="0%"
              stopColor="#37C6C3"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              stopColor="#036ED9"
              stopOpacity="0.3"
            />
          </linearGradient>

          <linearGradient
            id="gradient3"
            x1="-55.5132"
            y1="-197.283"
            x2="394.517"
            y2="0.55573"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="15%"
              stopColor="#43E7CD"
              stopOpacity="0.6"
            />
            <stop
              offset="50%"
              stopColor="#573CFA"
              stopOpacity="0.6"
            />
          </linearGradient>

          <linearGradient
            id="gradient4"
            x1="-55.5132"
            y1="-197.283"
            x2="394.517"
            y2="0.55573"
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset="15%"
              stopColor="#43E7CD"
              stopOpacity="0.8"
            />
            <stop
              offset="50%"
              stopColor="#573CFA"
              stopOpacity="0.8"
            />
          </linearGradient>

          {/* 🔥 Glow Filter */}
          <filter
            id="blob-shadow"
            x="-50%"
            y="-50%"
            width="400%"
            height="400%"
          >
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="12"
              result="blurred"
            />
            <feMerge>
              <feMergeNode in="blurred" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {iconState === "speaking" && (
            <filter
              id="blob-shadow-glow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feMorphology
                operator="dilate"
                radius="4"
                in="SourceAlpha"
                result="dilated"
              />
              <feGaussianBlur
                in="expanded"
                stdDeviation="10"
                result="blurred"
              />
              <feOffset
                in="blur"
                dx="0"
                dy="0"
                result="offsetBlur"
              />
              <feFlood floodColor="#01ECEC" result="color" />
              <feComposite
                in2="blurred"
                operator="in"
                result="shadowGlow"
              />
              <feMerge>
                <feMergeNode in="shadowGlow" />
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="shadowGlow" />
              </feMerge>
            </filter>
          )}

          {/* Filter dari SVG asli */}
          <filter
            id="filter0_i_7199_185"
            x="0.824219"
            y="0.510254"
            width="158.872"
            height="195.543"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood
              floodOpacity="0"
              result="BackgroundImageFix"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="15.05" />
            <feComposite
              in2="hardAlpha"
              operator="arithmetic"
              k2="-1"
              k3="1"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_7199_185"
            />
          </filter>
          <filter id="backgroundBlur">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="20"
              result="blurred"
            />
          </filter>
        </defs>

        {/* Layer tambahan untuk animasi */}
        <path
          ref={blobRef2}
          fill="url(#gradient2)"
          d="M50.7,-59.8C62.5,-50.5,66.6,-31.5,69.2,-12.8C71.8,6,73,24.4,66.5,41C60,57.7,45.9,72.6,29.7,76.2C13.4,79.8,-5.1,72.2,-24.4,65.7C-43.7,59.3,-63.9,53.9,-72,41C-80.1,28.2,-76,7.7,-70.6,-10.7C-65.2,-29.1,-58.6,-45.4,-46.6,-54.7C-34.6,-64,-17.3,-66.1,1.1,-67.4C19.5,-68.7,38.9,-69.2,50.7,-59.8Z"
          transform="translate(80 96.5) scale(0.66)"
          fillOpacity="0.8"
          filter="url(#blob-shadow)"
        />
        <path
          ref={blobRef3}
          fill="url(#gradient3)"
          d="M41.4,-50.8C52.8,-39.8,60.6,-25.9,65.8,-9.7C71,6.6,73.5,25.2,66.4,39C59.3,52.8,42.5,61.7,24.4,69.3C6.3,76.8,-13.1,83,-27.8,77.3C-42.5,71.5,-52.5,53.8,-60.9,36.5C-69.2,19.2,-75.8,2.4,-73.6,-13.5C-71.4,-29.3,-60.4,-44.1,-46.7,-54.7C-32.9,-65.4,-16.5,-71.9,-0.7,-71C15,-70.1,30,-61.9,41.4,-50.8Z"
          transform="translate(80 96.5) scale(0.66)"
          stroke="url(#strokeGradient)"
          fillOpacity="0.5"
          filter="url(#blob-shadow)"
        />
        <path
          ref={blobRef4}
          fill="url(#gradient4)"
          d="M41.4,-50.8C52.8,-39.8,60.6,-25.9,65.8,-9.7C71,6.6,73.5,25.2,66.4,39C59.3,52.8,42.5,61.7,24.4,69.3C6.3,76.8,-13.1,83,-27.8,77.3C-42.5,71.5,-52.5,53.8,-60.9,36.5C-69.2,19.2,-75.8,2.4,-73.6,-13.5C-71.4,-29.3,-60.4,-44.1,-46.7,-54.7C-32.9,-65.4,-16.5,-71.9,-0.7,-71C15,-70.1,30,-61.9,41.4,-50.8Z"
          transform="translate(80 96.5) scale(0.65)"
          stroke="url(#strokeGradient)"
          fillOpacity="0.6"
          filter="url(#blob-shadow)"
        />
      </svg>

      {/* Konten di atas */}
      <div className="relative z-10 flex items-center justify-center">
        <ImageWithFallback
          src={IMAGES.icons.white_logo_ajari}
          alt="Bot"
          className="w-12 h-12 object-contain"
        />
      </div>
    </div>
  );
};

export default BlobAnimationNisa;
