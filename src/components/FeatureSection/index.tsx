import SectionReveal from "../SectionReveal";

interface Props {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  reverse?: boolean;
}

const FeatureSection = ({
  title,
  description,
  buttonText,
  image,
  reverse = false,
}: Props) => {
  return (
    <section className="py-14 sm:py-20 lg:py-28">
      <div
        className={`mx-auto flex max-w-7xl flex-col items-center gap-10 rounded-[2rem] bg-gradient-to-b from-white to-[#f8f8f8] px-5 py-8 sm:px-8 sm:py-10 lg:flex-row lg:gap-20 lg:px-14 lg:py-16 ${
          reverse ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* IMAGE */}
        <SectionReveal from={reverse ? "left" : "right"}>
          <div className="relative flex w-full flex-1 justify-center">
            
            {/* Glow */}
            <div className="absolute h-52 w-52 rounded-full bg-[#47B88A]/10 blur-3xl sm:h-72 sm:w-72" />

            {/* Image Container */}
            <div className="relative rounded-[2rem] p-3 sm:p-4">
              <img
                src={image}
                alt=""
                className="w-full max-w-[240px] sm:max-w-[320px] lg:max-w-md"
              />
            </div>
          </div>
        </SectionReveal>

        {/* TEXT */}
        <SectionReveal from={reverse ? "right" : "left"}>
          <div className="flex flex-1 flex-col items-center gap-5 text-center lg:items-start lg:text-left">
            
            {/* Small Tag */}
            <div className="rounded-full bg-[#47B88A]/10 px-4 py-2 text-sm font-medium text-[#47B88A]">
              Plantie Feature
            </div>

            <h2 className="max-w-xl text-2xl font-bold leading-tight sm:text-3xl lg:text-5xl">
              {title}
            </h2>

            <p className="max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              {description}
            </p>

            <button className="mt-2 rounded-2xl bg-[#47B88A] px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] sm:px-7 sm:py-4 sm:text-base">
              {buttonText}
            </button>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};

export default FeatureSection;