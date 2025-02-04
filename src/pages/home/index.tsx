import { FC, useEffect, useRef } from "react";
import coverShape from "../../assets/cover-shape.svg";
import iphoneCover from "../../assets/iphone-cover.png";
import download from "../../assets/download.png";
import { Link } from "react-router-dom";

const HomePage: FC = () => {
  const divRef = useRef<HTMLImageElement>(null);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const textRef1 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const div = divRef.current;
    const coverImg = coverImgRef.current;

    const text1 = textRef1.current;

    if (text1) {
      // Add animation classes when content is ready
      text1.classList.add(
        "opacity-100",
        "md:left-[48%]",
        "left-1/2",
        "md:transform",
        "md:-translate-x-1/2"
      );

      // Ensure the transition happens smoothly
      text1.classList.remove("opacity-0", "-left-40");
    }
    if (coverImg) {
      // Add animation classes when content is ready
      coverImg.classList.add("opacity-100", "right-20");

      // Ensure the transition happens smoothly
      coverImg.classList.remove("opacity-0", "-right-20");
    }
    if (div) {
      // Add animation classes when content is ready
      div.classList.add("opacity-100");

      // Ensure the transition happens smoothly
      div.classList.remove("opacity-0");
    }
  }, []);
  return (
    <div className="">
      <div className="relative flex xl:flex-row overflow-hidden flex-col items-center  justify-center md:pt-0 pt-20 bg-gradient-to-br from-[#23075B] to-[#330B82] md:h-[763px] h-[90vh]">
        <div
          ref={textRef1}
          className="lg:w-3/4 w-11/12 mt-10 gap-10 flex flex-col z-10 items-start m-auto md:[&>*]:w-2/5 md:absolute opacity-0 transition-all duration-1000  -left-40  h-96 "
        >
          <h1 className="font-bold xl:text-6xl text-4xl">Plantie: Your AI Farming Assistant</h1>
          <h2>
            Empowering farmers with AI-powered tools to detect plant diseases
            and optimize fertilizer usage for healthier crops and better yields
          </h2>
          <Link to={"/"}>
            <img className="md:max-w-64 max-w-32" src={download} alt="" />
          </Link>
        </div>
        <img
          src={iphoneCover}
          className="md:absolute opacity-0 xl:w-auto md:w-2/4 w-3/4 transition-all duration-700 bottom-0 -right-20 z-10"
          ref={coverImgRef}
          alt=""
        />
        <img
          ref={divRef}
          src={coverShape}
          className="absolute opacity-0 transition-all duration-700  bottom-0 right-0 z-[0]"
          alt=""
        />
      </div>
    </div>
  );
};

export default HomePage;
