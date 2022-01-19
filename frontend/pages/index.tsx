import { useState, useEffect } from 'react'

import Head from 'next/head'
import { ethers } from 'ethers'
import abi from '../interface/abi.json'
import Modal from '../components/Modal'
import { Bid } from '../types/bid'
import mintNFT from '../utils/mint'

// const CONTRACT_ADDRESS = '0x5a28172e8afc0b79f743fef4cbe2724c3c8358e4'
const CONTRACT_ADDRESS = '0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0'

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
      listNFT(day)
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
    <div className="flex flex-col items-center justify-center h-full">
      <Head>
        <title>Yaade</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="text-inter text-white w-full h-full bg-gray-800 flex flex-col justify-start items-center p-36 space-y-16">
        <h1 className='text-5xl font-bold'>Buy Calendar NFT and cherish your memories</h1>
        
        {!isAuthenticated && <a onClick={() => login()} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">Connect Wallet</a>}
        {isAuthenticated && <a onClick={() => listNFT(0)} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">List NFT</a>}
        {isAuthenticated && <p>{account}</p>}
        {/* {isAuthenticated && <a onClick={() => revokeBid('dsa', 0)} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">List NFT</a>}
        {isAuthenticated && <a onClick={() => updateBid('dsa', 0, '150000000000000000', false)} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">List NFT</a>}
        {isAuthenticated && <a onClick={() => bidOnDate(0, '1210000000000000')} id="btn-2" className="cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 px-5 py-2 text-xl rounded-md hover:bg-gradient-to-br hover:duration-700 duration-700">List NFT</a>} */}
        <button onClick={async () => {console.log(await fetchBid(0))}}>Click ME</button>
          <button onClick={() => mintNFT()}>NFT</button>

        <div className="w-full h-screen grid grid-cols-7 grid-rows-5">
          {[...Array(31).keys()].map((i) => (
            <div onClick={() => {setDate(i.toString()); setIsOpen(!isOpen)}} className='w-32 h-32 bg-yellow-400 flex justify-center items-center text-5xl cursor-pointer' key={i}>{i}</div>
          ))}
        </div>
      </div>


      {isOpen && <Modal title={date} isOpen={isOpen} setIsOpen={setIsOpen} submit={submit} bid={bid} setBid={setBid} currentBid={currentBid} updateBid={updateBid} allBids={allBids}></Modal> }
    </div>
  )
}
