import SmallCard from "./SmallCard";
import { useAccountContext } from '../pages/_context'
import { useEffect, useState } from "react";
import Modal from './Modal'

type Props = {};

interface Listing {
  date: string
  owner: string
}

const Calender = (props: Props) => {
  const { month, setMonth, year, setYear, nextDate, setNextDate, account, isOpen, setIsOpen, getListing, bid, getWinner, getMintedNFT, getNFT, getDayOnDate, mintNFT, selectedDate, changeNFT } = useAccountContext()

  const [bidder, setBidder] = useState<Listing>({} as Listing)
  const [date, setDate] = useState(0)
  const [winner, setWinner] = useState(false)
  const [nft, setNFT] = useState('')
  const [text, setText] = useState('')

  useEffect(() => {
    setNFT('')

    const dayOfTheYear = getDayOnDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), date)) + 1
    // console.log(dayOfTheYear, "dayOf")

    if(dayOfTheYear > 0) {
      getListing(dayOfTheYear)
      .then((v: any) => {setBidder(v)})

      getWinner(date)
      .then((v: any) => {})

      try {
        // console.log(1)
        getMintedNFT(dayOfTheYear)
        .then((json: any, owner: any) => {
          json = JSON.parse(json[0])
          setNFT(json['image_data'])
        })
      } catch (e) {
        // console.log(e)
      }
    }
  }, [isOpen])

  useEffect(() => {
    // console.log(bidder.owner, account)
    if(bidder && account) {
      // console.log(bidder.owner.toUpperCase() === account.toUpperCase())
      if(bidder.owner.toUpperCase() === account.toUpperCase()) setWinner(true)
      else setWinner(false)
    }
  }, [bidder])

  
  const [d, setD] = useState(0)
  useEffect(() => {
    setD(getDayOnDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), date)) + 1)
  }, [isOpen])

  useEffect(() => {
    // console.log(bid)
  }, [])

  const nextMonth = () => {
    const currMonth = new Date(Date.parse(month +" 1, 2012")).getMonth() + 1
    const currYear = new Date(Date.parse(currMonth + " 1, " + year)).getFullYear()
    const nextMonth = new Date(currYear, currMonth, 1);
    
    setMonth(nextMonth.toLocaleString(undefined, { month: 'long' }))
    setYear(nextMonth.getFullYear().toString())
    setNextDate(nextMonth)
  }
  
  const prevMonth = () => {
    let currMonth = new Date(Date.parse(month +" 1, 2012")).getMonth() - 1
    currMonth = currMonth == 0 ? -1 : currMonth
    const currYear = new Date(Date.parse(currMonth + " 1, " + year)).getFullYear()
    const nextMonth = new Date(currYear, currMonth, 1);
    
    setMonth(nextMonth.toLocaleString(undefined, { month: 'long' }))
    setYear(nextMonth.getFullYear().toString())
    setNextDate(nextMonth)
  }

  const getNFTs = async (value: number) => {
    value = getDayOnDate(new Date(nextDate.getFullYear(), nextDate.getMonth(), value))
    try {
      var nft = await getNFT(value + 1)
      nft = await atob(nft.split(',')[1])
      nft = await JSON.parse(nft)['image_data']
      return nft
    } catch(e) {}
  }

  return (
    <div className="flex flex-col items-center bg-[#FCF2EA] h-fit mt-32 pb-20">
      <div className="text-4xl font-bold mt-12 mb-10 mx-6 md:mx-2">
        With Calendar NFT cherish your memories forever
      </div>
      <div className="w-5/6 flex justify-end font-semibold mb-6">
        <span>{month} {year}</span>
        {/* left */}
        <svg
          onClick={() => prevMonth()}
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
          onClick={() => nextMonth()}
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
        {[...Array(new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()).keys()].map(value => (
          <SmallCard key={value} day={value} date={date} bidder={bidder} customClick={() => {setIsOpen(true); setDate(value)}} winner={winner} nft={getNFTs(value)} d={d} />
        ))}
      </div>

      <Modal date={date} d={d}>
          
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

          {nft && winner &&
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

export default Calender;
