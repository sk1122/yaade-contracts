import React from "react";

type Props = {};

const SmallCard = (props: Props) => {
  return (
    <div className="bg-white w-[165px] h-[165px] rounded">
      <div className="h-1/4 flex justify-end items-center px-1">
        <span className="bg-black text-white px-3 rounded-full text-xs py-1">
          Sold
        </span>
      </div>
      <div className="h-3/4 flex items-center justify-center font-bold text-7xl">
        3
      </div>
    </div>
  );
};

export default SmallCard;
