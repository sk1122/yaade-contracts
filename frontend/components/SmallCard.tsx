import React, { useEffect, useState } from "react";
import { useAccountContext } from "../pages/_context";
import Modal from './Modal'

type Props = {
  day: number
  bidder: Listing
  customClick: any
  winner: boolean
  nft: string
  d: number
};

interface Listing {
  date: string
  owner: string
}

const SmallCard = ({day, bidder, customClick, winner, nft, d}: Props) => {
  const { year, month, nextDate, isOpen, selectedDate, account, mintNFT, changeNFT, getDayOnDate } = useAccountContext()
  const [text, setText] = useState('')

  return (
    <div onClick={customClick} className="bg-white w-[165px] h-[165px] rounded">
        <div className="h-1/4 flex justify-end items-center px-1">
          <span className="bg-black text-white px-3 rounded-full text-xs py-1">
            {(bidder?.owner && bidder?.owner.startsWith('0x000') || new Date().getDate() >= day + 1) ? 
              "Sold"
              :
              "Free"
            }
            {(bidder?.owner && bidder?.owner.startsWith(account)) && "Winner"}
          </span>
        </div>
        <div className="h-3/4 flex items-center justify-center font-bold text-7xl">
          {day + 1}
        </div>

        <Modal>
          
          <img src={nft} alt="" />
          <h3
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Day of the year - {d}
          </h3>
          <h3>Winner - {bidder?.owner && bidder?.owner}</h3>
          {winner && !bidder?.owner.startsWith('0x0000') && !nft && 
            <div onClick={() => mintNFT(getDayOnDate(selectedDate), 'Satyam')}>
              Claim
            </div>
          }

          {nft &&
            <div>
              <input value={text} onChange={(e) => setText(e.target.value)} type="text" className="p-1" placeholder="Update Text" />
              <div onClick={() => changeNFT(getDayOnDate(selectedDate), text)}>
                Update NFT
              </div>
            </div> 
          }
        </Modal>
    </div>
  );
};

export default SmallCard;
