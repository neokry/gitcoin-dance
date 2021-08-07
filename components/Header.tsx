import { useContext } from "react";
import Image from 'next/image';
import logo from '../public/assets/img/logo.svg';
import mobileLogo from '../public/assets/img/mobile_logo.svg';
import subLogo from '../public/assets/img/sub_logo.svg';
import twitterLogo from '../public/assets/img/twitter_logo.svg';
import gitcoinLogo from '../public/assets/img/gitcoin_logo.svg';
import { ZKSyncDataContext } from "../context/ZKSyncDataContext";
import Link from "next/link";

export default function Header() {
  const { zkData } = useContext(ZKSyncDataContext);

  return (
    <div className="container mx-auto md:px-14 md:py-0 lg:px-10 xl:px-0">
      <div className="block py-5 lg:flex lg:justify-between lg:items-stretch">
        {/* Placeholder for logo */}
        <div className="flex justify-center md:justify-start md:items-stretch">
          <Link href="/" passHref={true}>
            <a className="hidden md:block">
              <Image src={logo} alt="logo" />
            </a>
          </Link>
          <Link href="/" passHref={true}>
            <a className="block md:hidden">
              <Image src={mobileLogo} alt="logo" />
            </a>
          </Link>
          <span className="ml-4 self-end hidden md:block">
            <Image src={subLogo} alt="logo" />
          </span>
        </div>
        {/* Total collected for the tournament */}
        {zkData.data && zkData.data.overallTotal && (
          <div className="total-amount flex items-center pt-4 justify-center md:justify-start md:pt-7 lg:pt-0 lg:block lg:self-end">
            <div className="block md:flex md:justify-end lg:mb-7">
              <Image src={twitterLogo} alt="twitter-logo" />
              <span className="block mt-2 md:mt-0 md:ml-4 md:inline-block">
                <Image src={gitcoinLogo} alt="gitcoin-logo" />
              </span>
            </div>
            <div className="flex justify-end divide-x divide-purple-800 md:pl-12 lg:pl-0">
              <div className="text-right block px-5 md:px-0 md:mr-12 md:flex md:items-center lg:mr-8 lg:block">
                <span className="font-black text-sm">Collected  in round 11</span>
                <p className="italic font-light text-4xl md:text-2xl md:pl-5 lg:pl-0 lg:text-4xl">${zkData.data.overallTotal?.toFixed(2) ?? "0"}</p>
              </div>
              <div className="text-right block pl-4 md:pl-12 md:flex md:items-center lg:pl-5 lg:block">
                <span className="font-black text-sm">Collected  in total</span>
                <p className="italic font-light text-4xl md:text-2xl md:pl-5 lg:pl-0 lg:text-4xl">${zkData.data.overallTotal?.toFixed(2) ?? "0"}</p>
              </div>
              {/* Total Collected: ${zkData.data.overallTotal?.toFixed(2) ?? "0"} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
