import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

type HeaderProps = {
  className?: string;
  props?: string;
}

export const Header = async ({className, ...props}: HeaderProps) => {

  return (
    <>
    <header className={cn("flex flex-col items-center justify-center bg-white border-b-1 border-gray-200 sticky top-0", className)} {...props}>
      <div className="flex items-center justify-between w-full border-b-2 border-gray-200 w-full p-2">
        <div className="">

        </div>
        <div className="">
          <Link href="/" className="flex items-center">
            <Image src="/gallerix-logo.svg" alt="Gallerix Logo" width={150} height={50} />
          </Link>
        </div>
        <div className="">

        </div>
        
      </div>
      <nav className="flex items-center justify-center ml-4 p-3">
        <ul className="flex space-x-4 text-sm">
          <li>
            <Link href="/" className="text-gray-800 hover:text-gray-600">Posters</Link>
          </li>
          <li>
            <Link href="/gallery" className="text-gray-800 hover:text-gray-600">Bästsäljare</Link>
          </li>
          <li>
            <Link href="/about" className="text-gray-800 hover:text-gray-600">Nyheter</Link>
          </li>
        </ul>
      </nav>
    </header>
    </>
  );
          
};