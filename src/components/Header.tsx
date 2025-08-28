import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

type HeaderProps = {
  className?: string;
  props?: string;
}

export const Header = async ({className, ...props}: HeaderProps) => {

  return (
    <header className={cn("flex items-center justify-center p-4 bg-white border", className)} {...props}>
      <Link href="/" className="flex items-center">
        <Image src="/gallerix-logo.svg" alt="Gallerix Logo" width={150} height={50} />
      </Link>
    </header>
  );
          
};