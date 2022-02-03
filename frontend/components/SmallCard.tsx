import React, { useEffect, useState } from "react";
import { useAccountContext } from "../pages/_context";
import Modal from './Modal'

type Props = {
  day: number
  bidder: Listing
  customClick: any
  winner: boolean
  nft: any
  d: number,
  date: number
};

interface Listing {
  date: string
  owner: string
}

const SmallCard = ({day, bidder, customClick, winner, nft, d, date}: Props) => {
  const { year, month, nextDate, isOpen, selectedDate, account, mintNFT, changeNFT, getDayOnDate } = useAccountContext()

  const [nftImage, setNftImage] = useState('')

  var a = nft
  a.then((v: any) => {setNftImage(v)})

  return (
    <div onClick={customClick} className="relative bg-white w-[165px] h-[165px] rounded">
          {nftImage && nftImage.length > 0 && 
            <img src={nftImage} className='absolute h-full w-full p-0 m-0 ' alt="" />
          }
          {(!nftImage || (nftImage && !nftImage.startsWith('data:'))) && 
            <div className="h-full flex items-center justify-center font-bold text-7xl">
              <span>{day + 1}</span>
            </div>
          }
    </div>
  );
};

export default SmallCard;
