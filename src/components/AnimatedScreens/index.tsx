import { useEffect, useRef } from "react";
import screen1 from "../../assets/screnn1.png";
import screen2 from "../../assets/screen2.png";
import screen3 from "../../assets/screen3.png";

const AnimatedScreens = () => {
  const screen1Ref = useRef<HTMLDivElement>(null);
  const screen2Ref = useRef<HTMLDivElement>(null);
  const screen3Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger animations when the container is in view
            if (screen1Ref.current) {
              screen1Ref.current.classList.remove(
                "translate-x-[-100%]",
                "opacity-0"
              );
              screen1Ref.current.classList.add(
                "md:translate-x-[-50%]",
                'translate-x-[-30%]',
                "opacity-100"
              );
            }

            if (screen2Ref.current) {
              screen2Ref.current.classList.remove(
                "translate-x-[100%]",
                "opacity-0"
              );
              screen2Ref.current.classList.add(
                "md:translate-x-[50%]",
                'translate-x-[30%]',
                "opacity-100"
              );
            }

            if (screen3Ref.current) {
              screen3Ref.current.classList.remove(
                "translate-y-[-100%]",
                "opacity-0"
              );
              screen3Ref.current.classList.add(
                "translate-y-[10%]",
                "opacity-100"
              );
            }

            // Stop observing after the animations are triggered
            if (containerRef.current) observer.unobserve(containerRef.current);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the container is visible
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full md:h-[43em] h-[30em] flex items-center justify-center overflow-hidden"
    >
      {/* Screen 1 */}
      <div
        ref={screen1Ref}
        className="absolute h-64  flex items-center justify-center text-white text-xl transition-all duration-1000 ease-in-out transform translate-x-[-100%] opacity-0"
      >
        <img className="md:w-10/12  w-2/4" src={screen1} alt="" />
      </div>

      {/* Screen 2 */}
      <div
        ref={screen2Ref}
        className="absolute  flex items-center justify-center text-white text-xl transition-all duration-1000 ease-in-out transform translate-x-[100%] opacity-0"
      >
        <img className="md:w-10/12  w-2/4"  src={screen2} alt="" />
      </div>

      {/* Screen 3 */}
      <div
        ref={screen3Ref}
        className="absolute  flex items-center justify-center text-white text-xl transition-all duration-1000 ease-in-out transform translate-y-[100%] opacity-0"
      >
        <img className="md:w-10/12 w-2/4"  src={screen3} alt="" />
      </div>
    </div>
  );
};

export default AnimatedScreens;
