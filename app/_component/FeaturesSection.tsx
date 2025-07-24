import { BarChart3Icon, BookOpenCheckIcon, LibraryIcon } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-secondary">
      <div className="container px-4 md:px-6 m-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Fitur Unggulan</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Dirancang untuk Pengajar Modern</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Semua yang Anda butuhkan dalam satu platform untuk membuat asesmen yang efektif dan efisien.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 mt-12">
          <div className="grid gap-1 text-center">
            <LibraryIcon className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-lg font-bold">Bank Soal Terpusat</h3>
            <p className="text-sm text-muted-foreground">
              Buat dan kelola semua soal Anda di satu tempat. Gunakan kembali soal untuk kuis yang berbeda dengan mudah.
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <BookOpenCheckIcon className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-lg font-bold">Pembuat Kuis Fleksibel</h3>
            <p className="text-sm text-muted-foreground">
              Rancang kuis dengan berbagai tipe soal: pilihan ganda, esai, dan isian singkat untuk asesmen yang komprehensif.
            </p>
          </div>
          <div className="grid gap-1 text-center">
            <BarChart3Icon className="h-10 w-10 mx-auto text-primary" />
            <h3 className="text-lg font-bold">Laporan & Analitik</h3>
            <p className="text-sm text-muted-foreground">
              Dapatkan wawasan mendalam tentang performa siswa dan analisis butir soal untuk perbaikan pengajaran.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}