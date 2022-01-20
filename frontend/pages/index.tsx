import { useState, useEffect } from 'react'

import Head from 'next/head'
import { ethers } from 'ethers'
import abi from '../interface/abi.json'
import Modal from '../components/Modal'
import { Bid } from '../types/bid'
import mintNFT from '../utils/mint'

// const CONTRACT_ADDRESS = '0x5a28172e8afc0b79f743fef4cbe2724c3c8358e4'
const CONTRACT_ADDRESS = '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9'

function dateFromDay(year: number, day: number){
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

export default function Home() {
  const [account, setAccount] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [date, setDate] = useState('')
  const [bid, setBid] = useState('')
  const [currentBid, setCurrentBid] = useState('0')
  const [allBids, setAllBids] = useState<Bid[]>([])
  const [sold, setSold] = useState(false)

  var provider: any, signer: any, contract: any;

  const connectContract = () => {
    provider = new ethers.providers.Web3Provider(window.ethereum)
    signer = provider.getSigner()
    contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer)
  }

  useEffect(() => {
    connectContract()
    contract.on('BidAdded', (bidder: string, id: number, bid: number, index: number) => {
      console.log(bidder, id, index, bid)
    })

    contract.on('UpdateNFTListed', (owner: string, minAmount: number, date: string, sold: boolean, highestBidderId: number) => {
      console.log('NFT', highestBidderId.toString())
    })

    contract.on('BidWinner', (bidder: string, _listingId: number, bid: number, bidId: number) => {
      console.log('NFT', bidder, _listingId.toString(), bid.toString, bidId.toString())
    })
  }, [account])
  
  const checkWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      
      if(ethereum) {
        const accounts = await ethereum.request({ method: 'eth_accounts' })
        
        if(accounts.length !== 0) {
          setAccount(accounts[0])
          setIsAuthenticated(true)
          
          console.log(accounts[0])
        } else {
          console.log("Do not have access")
        }
      } else {
        console.log("Install Metamask")
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  const login = async () => {
    try {
      const { ethereum } = window;
      
      if(ethereum) {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
        
        if(accounts.length !== 0) {
          setAccount(accounts[0])
          setIsAuthenticated(true)
        } else {
          console.log("Not Found")
        }
      } else {
        console.log("Install Metamask")
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  const fetchBid = async (listingId: number) => {
    connectContract()

    try {
      console.log(contract, listingId, account)
      let [bidId, found] = await contract.findBid(listingId, account)
      if(!found) return null
      bidId = bidId.toNumber()
  
      let bid = await contract.bids(listingId, bidId)
      
      return bid
    } catch (e) {
      console.log(e)
      return false
    }
  }
  
  const bidOnDate = async (day: number, bidAmount: string) => {
    connectContract()
    try {
      const options = { value: ethers.utils.parseEther(ethers.utils.formatEther(bidAmount)) }
      const bid: any = await contract.addBid(day, bidAmount, options)
      await bid.wait()
    } catch (e) {
      return false
    }

    return true
  }
  
  const updateBid = async (date: string, listingId: number, bidAmount: string, sold: boolean) => {
    connectContract()

    const bid = await fetchBid(listingId)
    let bidAmountt = ethers.utils.parseEther(bidAmount)
    let value: string = bidAmountt.sub(bid.bid).toString()

    console.log(bid, bid.bid.toString(), "Yo")

    const options = { value: ethers.utils.parseEther(ethers.utils.formatEther(value)) }
    let updateNFT = await contract.updateBid(listingId, bidAmountt, options)
    updateNFT = await updateNFT.wait()
  }

  const revokeBid = async (date: string, listingId: number) => {
    connectContract()

    let deleteBid = await contract.deleteBid(listingId)
    deleteBid = await deleteBid.wait()
  }

  const getAllBids = async (listingId: number) => {
    connectContract()

    let bids = await contract.getBids(listingId)
    console.log(bids, "das")
    return bids
  }

  const submit = async () => {
    let bidAmount = ethers.utils.parseEther(bid.toString()).toString()
    
    const thatBid = await bidOnDate(Number(date), bidAmount)

    if(thatBid) console.log("Finished")
    else console.log("Not Finished:(")
  }

  const listNFT = async (date: number) => {
    connectContract()
    let listNFT = await contract.createListing(date, dateFromDay(new Date().getFullYear(), date).toJSON().slice(0, 10), 120);
  }

  const findHighestBidder = async () => {
    connectContract()

    let highestBidder = await contract.getHighestBid(0)
  }

  const declareWinner = async () => {
    connectContract()
    let winner = await contract.declareWinner(1, 0)
  }

  const getNFT = async (day: number) => {
    connectContract()

    let nft = await contract.getNFT(day)

    console.log(nft)

    return nft
  }

  useEffect(() => {
    if(account.length !== 0) {
      // listNFT()
      // listNFT()
    }
  }, [account])

  useEffect(() => {
    (async function() {
      if(isOpen) {
        console.log(date)
        try {
          let bid = await fetchBid(Number(date))
          setCurrentBid(bid.bid.toString())
        } catch (e) {
          setCurrentBid('0')
        }
      }
    })()
  }, [isOpen])

  useEffect(() => {
    (async function() {
      if(isOpen) {
        let nft = await getNFT(Number(date))

        if(nft.sold) {
          setSold(true)
        } else {
          setSold(false)
        }
      }
    })()
  }, [isOpen])

  useEffect(() => {
    (async function() {
      if(isOpen) {
        try {
          let bids = await getAllBids(Number(date))
          setAllBids(bids)
        } catch (e) {
          console.log(e)
        }
      }
    })()
  }, [isOpen])

  useEffect(() => {
    allBids.map(value => {
      console.log(value.bid.toString())
    })
  }, [allBids])

  useEffect(() => {
    checkWalletIsConnected()
  }, [])

  // submit

  return (
    <div className='w-full min-h-screen bg-gray-800 flex flex-col justify-start items-center text-white space-y-10'>
      <div className="text-inter text-white w-full h-full bg-gray-800 flex flex-col justify-start items-center px-36 pt-20 space-y-16">
        <h1 className='text-5xl font-bold'>Buy Calendar NFT and cherish your memories</h1>
      </div>
      <div className="flex justify-end items-center w-full px-16 space-x-3">
        <h2 className='text-lg font-semibold'>{new Date().toLocaleString('default', { month: 'long' })}</h2>
        <h2 className='text-lg font-semibold'>'{new Date().toLocaleString('default', { year: '2-digit' })}</h2>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 cursor-pointer" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="w-full h-full flex justify-end items-center px-16">  
        <div className="w-full h-screen grid grid-cols-7 grid-rows-5 gap-5">
          {[...Array(31).keys()].map((i) => (
            <div onClick={() => {setDate((i + 1).toString()); setIsOpen(!isOpen)}} className='relative w-full h-full bg-yellow-400 flex justify-center items-center text-5xl rounded-xl cursor-pointer' key={i}>{(new Date().getDate() + 2) !== (i + 1) ?  <p><span className='bg-yellow-900 p-2 rounded-xl absolute top-5 right-5 text-sm'>Sold</span> {i+1}</p> : <p><span className='bg-green-500 p-2 rounded-xl absolute top-5 right-5 text-sm'>Available</span>{i+1}</p>}</div>
            ))}
        </div>
      </div>
      {isAuthenticated && <a onClick={() => declareWinner()} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">Highest Bidder</a>}
      {isOpen && <Modal title={date} isOpen={isOpen} setIsOpen={setIsOpen} submit={submit} bid={bid} setBid={setBid} currentBid={currentBid} updateBid={updateBid} allBids={allBids}></Modal> }
    </div>
  )
}