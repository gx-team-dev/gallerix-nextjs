import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";
import SearchBox from "./SearchBox";

import { BsCart2 } from "react-icons/bs";
import { CiHeart, CiUser, CiShoppingBasket   } from "react-icons/ci";



type HeaderProps = {
  className?: string;
  props?: string;
}

export const Header = async ({className, ...props}: HeaderProps) => {

  return (
    <>
    <header className={cn("flex flex-col items-center justify-center bg-white border-b-1 border-gray-200 sticky top-0 z-50", className)} {...props}>
      <div className="flex flex-1 items-center justify-between w-full border-b-2 border-gray-200 p-2 mx-auto">
        <div className="flex flex-1">
          <SearchBox />
        </div>
        <div className="flex-1 flex justify-center">
          <Link href="/" className="flex items-center">
            <Image src="/gallerix-logo.svg" alt="Gallerix Logo" width={150} height={50} />
          </Link>
        </div>
        <div className="flex-1 flex justify-end gap-2">
          <Link href="/cart" className="text-gray-800 hover:text-gray-600"><CiUser size={22} /></Link>
          <Link href="/cart" className="text-gray-800 hover:text-gray-600"><CiHeart size={22} /></Link>
          <Link href="/cart" className="text-gray-800 hover:text-gray-600"><CiShoppingBasket size={22} /></Link>
        </div>
        
      </div>
      <nav className="flex items-center justify-center ml-4 p-3">
        <ul className="flex space-x-4 text-sm">
          <li>
            <Link href="/" className="text-gray-800 hover:text-gray-600">Posters</Link>
          </li>
          <li>
            <Link href="/gallery" className="text-gray-800 hover:text-gray-400">Bästsäljare</Link>
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