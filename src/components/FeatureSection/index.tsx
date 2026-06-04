// FeatureSection.tsx
import { motion } from "framer-motion";
import SectionReveal from "../SectionReveal";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  imageBehind?: string;
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  description,
  buttonText,
  imageBehind,
  image,
  reverse = false,
}: Props) => {
  return (
    <section className="relative py-16 sm:py-24 lg:py-32">
      <div
        className={`mx-auto flex max-w-7xl flex-col z-20 items-center gap-14 rounded-[2.5rem] border border-gray-100 bg-gradient-to-b from-white to-[#f8f8f8] px-6 py-10 shadow-[0_20px_80px_rgba(0,0,0,0.05)] sm:px-10 lg:flex-row lg:px-16 lg:py-16 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* IMAGE */}
        <SectionReveal from={reverse ? "left" : "right"}>
          <motion.div
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className="relative flex w-full flex-1 justify-center z-10"
          >
            {/* Glow */}
            <div className="absolute h-60 w-60 rounded-full sm:h-80 sm:w-80" />

            {/* Floating Card Container */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative rounded-[2rem] p-4 flex items-center justify-center"
            >
              {/* BEHIND IMAGE */}
              {imageBehind && (
                <img
                  src={imageBehind}
                  className="absolute z-0 bottom-0 right-[20%]  -translate-x-1/2 -translate-y-1/2 max-w-[100%] pointer-events-none"
                  alt=""
                />
              )}

              {/* FRONT IMAGE */}
              <img
                src={image}
                alt=""
                className="relative z-10 w-full max-w-[240px] sm:max-w-[340px] lg:max-w-[420px]"
              />
            </motion.div>
          </motion.div>
        </SectionReveal>

        {/* TEXT */}
        <SectionReveal from={reverse ? "right" : "left"}>
          {/* Added relative and z-20 to ensure it sits on top of everything else */}
          <div className="relative z-20 flex flex-1 flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            {/* TAG */}
            <div className="rounded-full bg-[#47B88A]/10 px-4 py-2 text-sm font-semibold text-[#47B88A]">
              Plantie Feature
            </div>

            <h2 className="max-w-xl text-3xl font-bold leading-tight text-[#1d1d1d] sm:text-4xl lg:text-5xl">
              {title}
            </h2>

            <p className="max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              {description}
            </p>

            <motion.button
              whileHover={{
                scale: 1.03,
                y: -2,
              }}
              whileTap={{ scale: 0.97 }}
              className="mt-2 rounded-2xl bg-[#47B88A] px-7 py-4 text-sm font-medium text-white shadow-lg shadow-[#47B88A]/30 transition-all duration-300 sm:text-base"
            >
              {buttonText}
            </motion.button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default FeatureSection;
