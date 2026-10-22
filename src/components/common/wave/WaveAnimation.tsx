import { gsap } from "gsap";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  PointOneBlobs,
  PointThreeBlobs,
  PointTwoBlobs,
} from "./wave";
import BlobAnimationNisa from "../blob/BlobAnimationNisa";
import { UserRole } from "../dialog/data";

interface WaveAnimationProps {
  role?: UserRole;
  position?: "top" | "bottom";
}

export const WaveAnimation = ({
  role = "peserta",
  position = "bottom",
}: WaveAnimationProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [blobSize, setBlobSize] = useState(200);
  const pathOneRef = useRef<SVGPathElement>(null);
  const pathTwoRef = useRef<SVGPathElement>(null);
  const pathThreeRef = useRef<SVGPathElement>(null);
  const pathFourRef = useRef<SVGPathElement>(null);
  const pathFiveRef = useRef<SVGPathElement>(null);

  // Responsive blob size based on screen width
  useEffect(() => {
    const updateBlobSize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBlobSize(120); // Mobile
      } else if (width < 1024) {
        setBlobSize(150); // Tablet
      } else {
        setBlobSize(200); // Desktop
      }
    };

    updateBlobSize();
    window.addEventListener("resize", updateBlobSize);
    return () =>
      window.removeEventListener("resize", updateBlobSize);
  }, []);

  const animateBlob = useCallback(
    (
      blob: SVGPathElement | null,
      delay: number,
      duration: number,
      paths: string[],
    ) => {
      if (!blob) return;
      const animate = gsap.timeline({
        repeat: -1,
        yoyo: true,
        defaults: { ease: "sine.inOut" },
        delay: delay,
      });

      paths.forEach((path: string) => {
        animate.to(blob, {
          duration: duration,
          attr: { d: path },
        });
      });

      return animate;
    },
    [],
  );

  useEffect(() => {
    let isMounted = true;
    
    const animationOne = animateBlob(
      pathOneRef.current,
      0,
      1.8,
      PointOneBlobs,
    );
    const animationTwo = animateBlob(
      pathTwoRef.current,
      0,
      1.5,
      PointTwoBlobs,
    );
    const animationThree = animateBlob(
      pathThreeRef.current,
      0,
      1.75,
      PointThreeBlobs,
    );
    const animationFour = animateBlob(
      pathFourRef.current,
      0,
      1.6,
      PointOneBlobs,
    );
    const animationFive = animateBlob(
      pathFiveRef.current,
      0,
      1.8,
      PointThreeBlobs,
    );
    
    return () => {
      isMounted = false;
      
      // Kill animations safely
      try {
        animationOne?.kill();
        animationTwo?.kill();
        animationThree?.kill();
        animationFour?.kill();
        animationFive?.kill();
      } catch (error) {
        // Silently ignore cleanup errors
        console.debug("Animation cleanup:", error);
      }
    };
  }, [animateBlob]);

  return (
    <>
      <div
        className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Blob Animation - Descend from top or rise from bottom based on position */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 transition-all duration-700 ease-out ${
            position === "top"
              ? isHovered
                ? "top-2 opacity-100 scale-100 pointer-events-auto cursor-pointer"
                : "-top-32 opacity-0 scale-75 pointer-events-none"
              : isHovered
                ? "bottom-2 opacity-100 scale-100 pointer-events-auto cursor-pointer"
                : "-bottom-32 opacity-0 scale-75 pointer-events-none"
          }`}
          style={{
            width: `${blobSize}px`,
            height: `${blobSize}px`,
          }}
        >
          <BlobAnimationNisa size={blobSize} role={role} />
        </div>

        {/* Wave SVG - Responsive */}
        <svg
          className="h-16 md:h-20 lg:h-24 w-[300px] md:w-[450px] lg:w-[600px] flex justify-center items-center z-30"
          viewBox="0 0 2480 390"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient
              id="gradient"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="#7995E7"></stop>
              <stop offset="50%" stopColor="#4891D7"></stop>
              <stop offset="100%" stopColor="#74CED8"></stop>
            </linearGradient>
            <linearGradient
              id="gradientOne"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="#513AFF"></stop>
              <stop offset="50%" stopColor="#4891D7"></stop>
              <stop offset="100%" stopColor="#513AFF"></stop>
            </linearGradient>
            <linearGradient
              id="gradientOne"
              x1="0%"
              y1="50%"
              x2="100%"
              y2="50%"
            >
              <stop offset="0%" stopColor="#08FBFF"></stop>
              <stop offset="50%" stopColor="#4891D7"></stop>
              <stop offset="100%" stopColor="#08FBFF"></stop>
            </linearGradient>
          </defs>
          <path
            ref={pathOneRef}
            d="M 0,400 L 0,400 C 138.32142857142856,299.7142857142857 276.6428571428571,199.42857142857142 396,180 C 515.3571428571429,160.57142857142858 615.75,222 728,222 C 840.25,222 964.3571428571429,160.57142857142856 1085,180 C 1205.642857142857,199.42857142857144 1322.8214285714284,299.7142857142857 1440,400 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            transform="translate(500 0) scale(1)"
            opacity="0.5"
          />
          <path
            ref={pathTwoRef}
            d="M 0,500 L 0,500 C 141.06666666666666,330.5333333333333 282.1333333333333,161.06666666666666 437,106 C 591.8666666666667,50.933333333333344 760.5333333333333,110.26666666666671 930,195 C 1099.4666666666667,279.7333333333333 1269.7333333333333,389.8666666666667 1440,500 L 1440,500 L 0,500 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            transform="translate(600 100) scale(1)"
            opacity="0.75"
          />
          <path
            ref={pathThreeRef}
            d="M 0,400 L 0,400 C 105.00512820512819,332.1538461538462 210.01025641025637,264.3076923076923 282,209 C 353.9897435897436,153.69230769230768 392.96410256410263,110.92307692307692 465,105 C 537.0358974358974,99.07692307692308 642.1333333333333,130 721,156 C 799.8666666666667,182 852.5025641025641,203.07692307692307 940,202 C 1027.497435897436,200.92307692307693 1149.8564102564103,177.6923076923077 1239,207 C 1328.1435897435897,236.3076923076923 1384.0717948717947,318.15384615384613 1440,400 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            transform="translate(100 -50) scale(1.5)"
            opacity="0.3"
            // className="blur-sm"
          />
          <path
            ref={pathFourRef}
            d="M 0,400 L 0,400 C 138.32142857142856,299.7142857142857 276.6428571428571,199.42857142857142 396,180 C 515.3571428571429,160.57142857142858 615.75,222 728,222 C 840.25,222 964.3571428571429,160.57142857142856 1085,180 C 1205.642857142857,199.42857142857144 1322.8214285714284,299.7142857142857 1440,400 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            transform="translate(-100 100) scale(1)"
            opacity="0.3"
            className="blur-lg"
          />
          <path
            ref={pathFiveRef}
            d="M 0,400 L 0,400 C 105.00512820512819,332.1538461538462 210.01025641025637,264.3076923076923 282,209 C 353.9897435897436,153.69230769230768 392.96410256410263,110.92307692307692 465,105 C 537.0358974358974,99.07692307692308 642.1333333333333,130 721,156 C 799.8666666666667,182 852.5025641025641,203.07692307692307 940,202 C 1027.497435897436,200.92307692307693 1149.8564102564103,177.6923076923077 1239,207 C 1328.1435897435897,236.3076923076923 1384.0717948717947,318.15384615384613 1440,400 L 1440,400 L 0,400 Z"
            stroke="none"
            strokeWidth="0"
            fill="url(#gradient)"
            fillOpacity="1"
            transform="translate(300 0) scale(1.5)"
            opacity="0.3"
            className="blur-lg"
          />
        </svg>
      </div>
    </>
  );
};