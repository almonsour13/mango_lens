import SectionWrapper from "@/components/wrapper/section-wrapper";


export default function About() {
  return (
    <SectionWrapper id="About" className="py-16">
      <div className="flex flex-col items-center justify-center w-full text-center min-h-96 h-auto">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-green-900 via-green-500 to-yellow-400 text-transparent bg-clip-text">
            About MangoCare
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
            Our web app asd asdjnas oshd ajdn asd
        </p>
        <div className="flex gap-4">
        </div>
      </div>
    </SectionWrapper>
  );
}