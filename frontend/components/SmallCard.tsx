import React, { useEffect, useState } from "react";
import { useAccountContext } from "../pages/_context";
import Modal from './Modal'

type Props = {
  day: number
};

interface Listing {
  date: string
  owner: string
}

const SmallCard = (props: Props) => {
  const { getListing, setIsOpen, selectedDate, account } = useAccountContext()
  const [bidder, setBidder] = useState<Listing>()

  useEffect(() => {
    (async function() {
      // setBid(await getListing(props.day + 1))
      setBidder(await getListing(props.day + 1))
    })()
  }, [])

  useEffect(() => console.log(bidder?.owner), [bidder])
  
  return (
    <div onClick={() => setIsOpen(true)} className="bg-white w-[165px] h-[165px] rounded">
        <div className="h-1/4 flex justify-end items-center px-1">
          <span className="bg-black text-white px-3 rounded-full text-xs py-1">
            {(bidder?.owner && bidder?.owner.startsWith('0x000') || new Date().getDate() >= props.day + 1) ? 
              "Sold"
              :
              "Free"
            }
            {(bidder?.owner && bidder?.owner.startsWith(account)) && "Winner"}
          </span>
        </div>
        <div className="h-3/4 flex items-center justify-center font-bold text-7xl">
          {props.day + 1}
        </div>

        <Modal>
          <h3
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Day of the year - {selectedDate.getDate()} <span className='text-sm'>{selectedDate.toString()}</span>
          </h3>
          <h3>Winner - {bidder?.owner && bidder?.owner}</h3>
          {bidder?.owner && bidder?.owner.startsWith(account) && 
            <div>
              Claim
            </div>
          }
        </Modal>
    </div>
  );
};

export default SmallCard;
