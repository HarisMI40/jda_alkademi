import HeroImage from "./HeroImage";
import SectionButton from "./SectionButton";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6 m-auto">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Platform <span className="text-tersier"> Kuis Interaktif </span> untuk Pembelajaran Modern
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Buat, kelola, dan analisis kuis dengan mudah. Berikan pengalaman belajar yang menarik bagi siswa Anda dengan EduQuiz.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <SectionButton />
            </div>
          </div>
          <div className="flex items-center justify-center">
            <HeroImage />
          </div>
        </div>
      </div>
    </section>
  );
}