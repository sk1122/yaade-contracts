import { FaInstagramSquare, FaFacebookSquare, FaTwitter } from "react-icons/fa";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="h-fit w-full bg-[#DDC6B3]">
      {/* top */}
      <div className="flex justify-between w-5/6 mx-auto py-10 items-center">
        <div className="text-xl font-extrabold">YADDEIN</div>
        <ul className="flex space-x-3 items-center">
          <li className="text-lg font-semibold cursor-pointer">Discord</li>
          <li className="text-lg font-semibold cursor-pointer">Twitter</li>
          <li className="text-lg font-semibold cursor-pointer">Etherscan</li>
        </ul>
        <div className="flex space-x-4 items-center">
          <FaInstagramSquare size={"24px"} />
          <FaFacebookSquare size={"24px"} />
          <FaTwitter size={"24px"} />
        </div>
      </div>
      {/* bottom */}
      <ul className="flex space-x-5 w-5/6 mx-auto justify-center pb-10">
        <li className="cursor-pointer">
          &copy; 2022 Yaadein. All Rights Reserved
        </li>
        <li className="cursor-pointer">Privacy Policy</li>
        <li className="cursor-pointer">Terms of Service</li>
      </ul>
    </div>
  );
};

export default Footer;
