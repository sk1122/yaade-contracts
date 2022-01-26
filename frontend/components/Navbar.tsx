import React from "react";
import { useAccountContext } from '../pages/_context'

type Props = {};

const Navbar = (props: Props) => {
  const { account, isAuthenticated, login } = useAccountContext()

  return (
    <div className="w-full flex justify-between items-center px-12 py-6">
      <div className="text-xl font-extrabold">YAADEIN</div>
      <div className="flex space-x-6">
        <div className="font-medium text-base flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-black" />
          <div className="truncate w-20 cursor-pointer">
            {account}
          </div>
        </div>
        {!isAuthenticated && <button onClick={() => login()} className="text-base font-medium cursor-pointer">
          Connect Wallet
        </button>}
      </div>
    </div>
  );
};

export default Navbar;
