import SmallCard from "./SmallCard";
import { useAccountContext } from '../pages/_context'
import { useEffect, useState } from "react";

type Props = {};

interface Listing {
  date: string
  owner: string
}

const Calender = (props: Props) => {
  const { account, isOpen, setIsOpen, getListing, bid, getWinner, getMintedNFT } = useAccountContext()

  const [bidder, setBidder] = useState<Listing>({} as Listing)
  const [date, setDate] = useState(0)
  const [winner, setWinner] = useState(false)
  const [nft, setNFT] = useState('')

  useEffect(() => {
    setNFT('')
    if(date > 0) {
      getListing(date + 1)
      .then((v: any) => {setBidder(v)})

      getWinner(date)
      .then((v: any) => console.log(v))

      try {
        console.log(1)
        getMintedNFT(date + 1)
        .then((json: any, owner: any) => {
          json = JSON.parse(json[0])
          setNFT(json['image_data'])
        })
      } catch (e) {
        console.log(e)
      }
    }
  }, [isOpen])

  useEffect(() => {
    console.log(bidder.owner, account)
    if(bidder && account) {
      if(bidder.owner.toUpperCase() === account.toUpperCase()) setWinner(true)
    }
  }, [bidder])

  useEffect(() => {
    console.log(bid)
  }, [])

  return (
    <div onClick={() => setIsOpen(true)} className="flex flex-col items-center bg-[#FCF2EA] h-fit mt-32 pb-20">
      <div className="text-4xl font-bold mt-12 mb-10 mx-6 md:mx-2">
        With Calendar NFT cherish your memories forever
      </div>
      <div className="w-5/6 flex justify-end font-semibold mb-6">
        <span>January 2022</span>
        {/* left */}
        <svg
          className="w-6 h-6"
          fill="rgba(0, 0, 0, 0.5)"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"></path>
        </svg>
        {/* right */}
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"></path>
        </svg>
      </div>
      <div className="w-5/6 grid grid-cols-2 md:grid-cols-7 gap-y-4 place-items-center">
        {[...Array(new Date(new Date().getFullYear(), new Date().getMonth(), 0).getDate()).keys()].map(value => (
          <SmallCard day={value} bidder={bidder} customClick={() => {setIsOpen(true); setDate(value)}} winner={winner} nft={nft} />
        ))}
      </div>
    </div>
  );
};

export default Calender;
