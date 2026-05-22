// HomePage.tsx
import { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import coverShape from "../../assets/cover-shape.svg";
import iphoneCover from "../../assets/iphone-cover.png";
import download from "../../assets/download.png";

import AnimatedScreens from "../../components/AnimatedScreens";
import FeatureSection from "../../components/FeatureSection";

import capture_screen from "../../assets/capture_screen.png";
import fertilizer_screen from "../../assets/screen3.png";
import map_screen from "../../assets/screnn1.png";

import dot from "../../assets/dots.svg";
import potted from "../../assets/3d-fluency-potted-plant 1.png";

const fadeUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
} as const;

const HomePage: FC = () => {
  return (
    <div className="overflow-hidden bg-white">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#23075B] via-[#2D0A72] to-[#330B82]">
        {/* BG Glow */}
        <div className="absolute left-[-120px] top-[-120px] h-[300px] w-[300px] rounded-full bg-[#47B88A]/20 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-120px] h-[350px] w-[350px] rounded-full bg-[#7c4dff]/20 blur-3xl" />

        {/* Decorative */}
        <img
          src={coverShape}
          className="absolute bottom-0 right-0 z-0 w-full opacity-20"
          alt=""
        />

        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center gap-14 px-6 py-28 lg:flex-row lg:px-10">
          {/* LEFT */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
          >
            <div className="mb-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
              AI Powered Smart Farming
            </div>

            <h1 className="max-w-2xl text-4xl font-extrabold leading-tight text-white sm:text-5xl lg:text-7xl">
              Plantie:
              <span className="block bg-gradient-to-r from-[#47B88A] to-[#8CF0C7] bg-clip-text text-transparent">
                Your AI Farming Assistant
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-200 sm:text-lg">
              Detect plant diseases, calculate fertilizer needs, and locate
              nearby plant stores using smart AI tools designed for modern
              farmers.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:items-start">
              <Link to="/">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  src={download}
                  className="w-40 sm:w-52"
                  alt=""
                />
              </Link>

              <button className="rounded-2xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-medium text-white backdrop-blur-md transition-all duration-300 hover:bg-white/20">
                Learn More
              </button>
            </div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 120, rotate: 8 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ duration: 1 }}
            className="relative flex flex-1 items-center justify-center"
          >
            {/* Glow */}
            <div className="absolute h-[350px] w-[350px] rounded-full bg-[#47B88A]/20 blur-3xl" />

            <motion.img
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              src={iphoneCover}
              className="relative z-10 w-[260px] sm:w-[340px] lg:w-[420px]"
              alt=""
            />
          </motion.div>
        </div>
      </section>

      {/* DECORATIONS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src={dot}
          className="absolute left-5 top-[900px] w-20 opacity-40"
          alt=""
        />

        <img
          src={dot}
          className="absolute right-10 top-[1400px] w-20 opacity-40"
          alt=""
        />

        <img
          src={potted}
          className="absolute right-[-80px] top-[2200px] w-[220px] opacity-80"
          alt=""
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10">
        <AnimatedScreens />

        <FeatureSection
          title="Diagnose Your Infected Plant"
          description="Keep your crops healthy with Plantie AI Diagnose System. Instantly identify diseases and get smart treatment recommendations."
          buttonText="Start Diagnosis"
          image={capture_screen}
          reverse
        />

        <FeatureSection
          title="Smart Fertilizer Calculator"
          description="Calculate exactly how much fertilizer your plants need and avoid unnecessary costs with Plantie’s intelligent fertilizer assistant."
          buttonText="Calculate Now"
          image={fertilizer_screen}
        />

        <FeatureSection
          title="Find Nearby Plant Stores"
          description="Quickly locate nearby plant stores and get the products you need for treatment and healthy plant growth."
          buttonText="Find Stores"
          image={map_screen}
          reverse
        />
      </div>
    </div>
  );
};

export default HomePage;