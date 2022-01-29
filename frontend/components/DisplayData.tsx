import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { useAccountContext } from '../pages/_context'

import Modal from './Modal'

type Props = {};

const DisplayData = (props: Props) => {
  const [eth, setEth] = useState('')
  
  var hours: any, minutes: any, seconds: any
  const { getDayOnDate, account, availableDay, endsIn, selectedDate, setSelectedDate, bidOnDate, allBids, currentBid, fetchBid, updateBid, revokeBid, findHighestBidder, setIsOpen, setCurrentBid, getListing } = useAccountContext()

  const [listing, setListing] = useState(false)

  const rightClick = () => {
    if(selectedDate == availableDay[0]) {
      setSelectedDate(availableDay[1])
    }
    else setSelectedDate(availableDay[0])
  }
  
  const leftClick = () => {
    if(selectedDate == availableDay[0]) setSelectedDate(availableDay[1])
    else setSelectedDate(availableDay[0])
  }

  const open = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    (async function () {
      setCurrentBid("0")
      if(account !== "") await fetchBid(getDayOnDate(selectedDate))
    })()
  }, [selectedDate, account])

  useEffect(() => {
    console.log(currentBid, "dsa")
  }, [currentBid])

  useEffect(() => {
    getListing(getDayOnDate(selectedDate))
      .then((v: any) => setListing(v.sold))
  }, [selectedDate])

  return (
    <div className="w-full">
      <div className="flex flex-col items-center md:items-start">
        {/* date */}
        <div className="font-semibold text-md mb-2">{selectedDate.toLocaleDateString(undefined, { month: 'long' })} {selectedDate.toLocaleDateString(undefined, { year: 'numeric' })}</div>
        {/* day */}
        <div className="flex space-x-5 items-center mb-2">
          <div className="text-4xl font-bold">Day {selectedDate.getDate()}</div>
          <div className="flex space-x-2">
            {/* left */}
            <button className="cursor-pointer" onClick={() => leftClick()}>
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
            <button className="cursor-pointer" onClick={() => rightClick()}>
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
            <span className="text-3xl font-semibold">{currentBid} ETH</span>
          </div>
          <div className="w-0.5 bg-black mx-6" />
          <div>
            <span className="text-sm">Ends at</span>
            <br />
            <span className="text-3xl font-semibold">
              {endsIn.getDate()}<span className="text-sm mr-1"></span>
              {endsIn.toLocaleDateString(undefined, { month: 'short' })}<span className="text-sm mr-1"></span>
              {endsIn.toLocaleDateString(undefined, { year: '2-digit' })}<span className="text-sm mr-1"></span>
            </span>
          </div>
        </div>
        {/* input section */}
        {!listing && <div className="flex space-x-10 items-center justify-start w-4/6 mb-6">
          <div className="flex items-center w-full">
            <input value={eth} onChange={(e) => setEth(e.target.value)} className="flex-1 mr-2 rounded border-none outline-none text-black px-3 py-3 text-sm" />
            <div className="text-sm font-semibold w-4 h-4 fill-current text-gray-500 -ml-12 z-10">
              ETH
            </div>
          </div>
          {Number(currentBid) > 0 ?
            <button onClick={() => updateBid('', getDayOnDate(selectedDate), eth)} className="ml-1 px-12 py-3 rounded text-sm font-semibold text-white bg-black">
              Update
            </button>
          : 
            <button onClick={() => bidOnDate(getDayOnDate(selectedDate), eth)} className="ml-1 px-12 py-3 rounded text-sm font-semibold text-white bg-black">
              Bid
            </button>
          }
        </div>}
        {listing && <div className="flex space-x-10 items-center justify-start w-4/6 mb-6">
          <div className="flex items-center w-full">
            <input disabled={true} value={eth} onChange={(e) => setEth(e.target.value)} className="flex-1 mr-2 rounded border-none outline-none text-black px-3 py-3 text-sm" />
            <div className="text-sm font-semibold w-4 h-4 fill-current text-gray-500 -ml-12 z-10">
              ETH
            </div>
          </div>
          {Number(currentBid) > 0 ?
            <button className="ml-1 px-12 py-3 rounded text-sm font-semibold text-white bg-black">
              Update
            </button>
          : 
            <button className="ml-1 px-12 py-3 rounded text-sm font-semibold text-white bg-black">
              Bid
            </button>
          }
        </div>}
        {/* current top biders section */}
        <div className="w-4/6 flex flex-col space-y-4 rounded-lg mb-2">
          {allBids.map((value) => (
            (!value.bidder.startsWith('0x000000') && 
              <div className="py-2 w-full bg-offwhite flex justify-between px-4 border border-black rounded text-xs">
                <div className="flex space-x-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-gray-300" />
                  <div className="truncate w-28">{value.bidder}</div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="truncate w-10">{ethers.utils.formatEther(value.bid.toString()).toString()} ETH</div>
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
            )
          ))}
        </div>
        <div className="w-4/6 flex justify-between">
          <div onClick={() => open()} className="text-offgrey hover:text-gray-900 cursor-pointer flex items-center space-x-2 text-sm">
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

          {Number(currentBid) > 0 && 
            <div onClick={() => revokeBid('', getDayOnDate(selectedDate))} className="bg-red-600 text-white p-1 rounded-md cursor-pointer flex items-center text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>Delete Bid</span>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default DisplayData;
