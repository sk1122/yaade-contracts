import { FaInstagramSquare, FaFacebookSquare, FaTwitter } from "react-icons/fa";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="h-fit w-full bg-[#DDC6B3]">
      {/* top */}
      <div className="flex flex-col space-y-10 md:space-y-0 md:flex-row justify-between w-5/6 mx-auto py-10 items-center">
        <div className="text-xl font-extrabold">YADDEIN</div>
        <ul className="flex flex-col space-y-2 mg:space-y-0 md:flex-row space-x-5 w-5/6 mx-auto justify-center items-center">
          <li className="cursor-pointer">
            &copy; 2022 Yaadein. All Rights Reserved
          </li>
          <li className="cursor-pointer">Privacy Policy</li>
          <li className="cursor-pointer">Terms of Service</li>
        </ul>
        <div className="flex space-x-4 items-center">
          <a href='https://twitter.com/rohannrk'><FaInstagramSquare size={"24px"} /></a>
          <a href="https://satyamkulkarni.xyz"><FaFacebookSquare size={"24px"} /></a>
          <a href="https://twitter.com/sk1122_"><FaTwitter size={"24px"} /></a>
          <a href="https://twitter.com/v_3_n0m"><FaTwitter size={"24px"} /></a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
