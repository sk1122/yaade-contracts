import { useEffect } from "react";
import DisplayData from "./DisplayData";
import StackeCard from "./StackedCard";
import { useAccountContext } from '../pages/_context'

type Props = {};

const BidSection = (props: Props) => {
  const {
    account,
    setAccount,
    isAuthenticated,
    setIsAuthenticated,
    isOpen,
    setIsOpen,
    date,
    setDate,
    month,
    setMonth,
    year,
    setYear,
    availableDay,
    setAvailableDay,
    endsIn,
    setEndsIn,
    selectedDate,
    setSelectedDate,
    bid,
    setBid,
    currentBid,
    setCurrentBid,
    allBids,
    setAllBids,
    sold,
    setSold,
    checkWalletIsConnected,
    login,
    fetchBid,
    bidOnDate,
    updateBid,
    revokeBid,
    getAllBids,
    submit,
    listNFT,
    findHighestBidder,
    getNFT,
    provider,
    signer,
    contract,
    connectContract
  } = useAccountContext()

  useEffect(() => {
    let tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    let dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)

    setAvailableDay([tomorrow, dayAfterTomorrow])
    setSelectedDate(tomorrow)
    setDate(tomorrow.getDate())
    setMonth(tomorrow.toLocaleDateString(undefined, { month: 'long' }))
    setYear(tomorrow.toLocaleDateString(undefined, { year: 'numeric' }))
  }, [])

  // Will update ends in
  useEffect(() => {
    setEndsIn(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1))
  }, [selectedDate])

  // will get all bids for current date
  useEffect(() => {
    getAllBids(selectedDate.getDate())
  }, [selectedDate])

  useEffect(() => {
    console.log("All Bids --> ", allBids)
  }, [allBids])

  return (
    <div className="flex flex-col items-center space-y-20 md:space-y-0 md:flex-row md:space-x-80 mt-24 h-fit">
      <StackeCard />
      <DisplayData />
    </div>
  );
};

export default BidSection;
