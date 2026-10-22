import imgTiagoWolfLvQjAkmYzUUnsplash1 from "figma:asset/acc74310e850fa0fcb76125c36d15d37ac278148.png";

export function ResponsiveBackground() {
  return (
    <div className="absolute inset-0 w-full h-full bg-white overflow-hidden">
      {/* Rotated Image Background - Top Right */}
      <div className="absolute right-0 top-0 flex items-start justify-end overflow-hidden">
        <div className="rotate-90 flex-none origin-top-right">
          <img 
            alt="" 
            className="object-cover pointer-events-none h-[100vh] w-auto max-w-none" 
            src={imgTiagoWolfLvQjAkmYzUUnsplash1} 
          />
        </div>
      </div>
      
      {/* Left Gradient Overlay with Blur */}
      <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-gradient-to-l from-transparent to-[#edf2ff] opacity-80 backdrop-blur-[50px]" />
      
      {/* Overall Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#edf3fc] blur-[25px]" />
    </div>
  );
}