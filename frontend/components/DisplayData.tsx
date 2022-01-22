import React from "react";

type Props = {};

const DisplayData = (props: Props) => {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {/* date */}
        <div className="font-semibold text-md mb-2">Jan 2022</div>
        {/* day */}
        <div className="flex space-x-5 items-center mb-2">
          <div className="text-4xl font-bold">Day 21</div>
          <div className="flex space-x-2">
            {/* left */}
            <button className="cursor-pointer" onClick={() => {}}>
              <svg
                className="w-5 h-5"
                fill="rgba(0, 0, 0, 1)"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>

            {/* right */}
            <button className="cursor-pointer" onClick={() => {}}>
              <svg
                className="w-5 h-5"
                fill="rgba(0, 0, 0, 0.5)"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fill-rule="evenodd"
                  d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                  clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
        {/* bid data section */}
        <div className="flex my-2 mb-6">
          <div>
            <span className="text-sm">Current Bid</span> <br />
            <span className="text-3xl font-semibold"> 4.7 ETH</span>
          </div>
          <div className="w-0.5 bg-black mx-6" />
          <div>
            <span className="text-sm">Ends in</span>
            <br />
            <span className="text-3xl font-semibold">
              1<span className="text-sm mr-1">h</span>
              55<span className="text-sm mr-1">m</span>
              30<span className="text-sm mr-1">s</span>
            </span>
          </div>
        </div>
        {/* input section */}
        <div className="flex space-x-10 items-center justify-start w-4/6 mb-6">
          <div className="flex items-center w-full">
            <input className="flex-1 mr-2 rounded border-none outline-none text-black px-3 py-3 text-sm" />
            <div className="text-sm font-semibold w-4 h-4 fill-current text-gray-500 -ml-12 z-10">
              ETH
            </div>
          </div>
          <button className="ml-1 px-12 py-3 rounded text-sm font-semibold text-white bg-black">
            Bid
          </button>
        </div>
        {/* current top biders section */}
        <div className="w-4/6 flex flex-col space-y-4 rounded-lg mb-2">
          <div className="py-2 w-full bg-offwhite flex justify-between px-4 border border-black rounded text-xs">
            <div className="flex space-x-2 items-center">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <div>Wallet Address</div>
            </div>
            <div className="flex items-center space-x-1">
              <div>2 ETH</div>
              <div className="rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="py-2 w-full bg-offwhite flex justify-between px-4 border border-black rounded text-xs">
            <div className="flex space-x-2 items-center">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <div>Wallet Address</div>
            </div>
            <div className="flex items-center space-x-1">
              <div>2 ETH</div>
              <div className="rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
          <div className="py-2 w-full bg-offwhite flex justify-between px-4 border border-black rounded text-xs">
            <div className="flex space-x-2 items-center">
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <div>Wallet Address</div>
            </div>
            <div className="flex items-center space-x-1">
              <div>2 ETH</div>
              <div className="rotate-45">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                    clip-rule="evenodd"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="text-offgrey hover:text-gray-900 cursor-pointer flex items-center space-x-2 text-sm">
          <span>Bid History</span>
          <svg
            className="w-4 h-4"
            fill="rgba(0, 0, 0, 0.5)"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
