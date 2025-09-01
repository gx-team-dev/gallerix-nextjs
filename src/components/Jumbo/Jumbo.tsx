import Image from "next/image";
import { Montserrat } from "next/font/google";
import { Button } from "../ui/button";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["200", "400"],
  display: 'swap',
});

export const Jumbo = () => {
  return (
    <section className="w-full text-center h-[calc(100vh-164px)] relative flex items-center justify-center">
      <Image
        src="https://gallerix.se/img/hero/main.jpg?34"
        alt="Jumbotron Image"
        className="w-full h-full object-cover absolute inset-0"
        width={10000}
        height={0}
      />

      <div className={`flex p-30 bg-black/30 text-white z-10 gap-6 flex-col ${montserrat.className}`}>
        <div className="text-md uppercase font-normal tracking-[.2em]">
          Trendigt just nu
        </div>
        <div className="uppercase text-3xl font-light tracking-[.2em]">
          Tavlor och Ramar
        </div>
        <div>
          <Button size="lg" variant="outline" className="uppercase shrink">
            Shoppa nu
          </Button>
        </div>
      </div>
    </section>
  );
}