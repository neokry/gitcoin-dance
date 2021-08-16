import { useContext } from "react";
import Image from 'next/image';
import footerLogo from '../public/assets/img/footer_logo.svg';
import Link from "next/link";

export default function Footer() {

  return (
    <div className="footer flex items-center px-6 py-8 md:h-40 md:px-14 md:py-0 lg:px-10 lg:h-80 xl:px-0">
      <div className="container mx-auto px-0">
        <div className="lg:flex lg:justify-between py-15">
          <div className="md:flex md:items-stretch">
          {/* Placeholder for logo */}
          <Link href="/" passHref={true}>
            <a className="text-2xl font-bold self-end">
              <Image src={footerLogo}  alt="logo"/>
            </a>
          </Link>
          <p className="info self-end text-sm mt-4 md:mt-auto md:text-base md:pl-10 md:w-2/4 font-poppin font-normal">
            gitcoin.dance is an initiative by
            <Link href="https://gitcoin.co/" passHref={true}>
              <a className="underline"> Gitcoin</a>
            </Link>.
            App created by
            <Link href="/" passHref={true}>
              <a className="underline"> PerfectPool</a>
            </Link>,
            <Link href="https://upstateinteractive.io/" passHref={true}>
              <a className="underline"> Upstate Interactive</a>
            </Link> and 
            <Link href="https://www.raidguild.org/" passHref={true}>
              <a className="underline"> Raid Guild</a>
            </Link>.
          </p>
          </div>
          <div className="block pt-6 md:pt-0 md:flex md:mt-5 md:divide-x md:divide-purple-800 lg:block lg:mt-0 lg:divide-x-0 lg:self-end">
            <p className="text-sm underline text-indigo font-poppin font-normal md:text-base md:pr-3 lg:text-right">
              <Link href="https://gitcoin.co/" passHref={true}>
                gitcoin.co
              </Link>
            </p>
            <p className="text-sm underline text-indigo font-poppin font-normal md:text-base md:px-3 lg:text-right lg:pt-2">
              <Link href="https://www.raidguild.org/" passHref={true}>
                raidguild.org
              </Link>
            </p>
            <p className="text-sm underline text-indigo font-poppin font-normal md:text-base md:px-3 lg:text-right lg:pt-2">
              <Link href="/" passHref={true}>
                perfectpool.io
              </Link>
            </p>
            <p className="text-sm underline text-indigo font-poppin font-normal md:text-base md:px-3 lg:text-right lg:pt-2">
              <Link href="https://upstateinteractive.io/" passHref={true}>
                upstateinteractive.io
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
