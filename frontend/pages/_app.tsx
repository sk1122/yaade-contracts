import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppContext, useAccountContext, Context } from './_context'
import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { Bid } from "../types/bid";
import abi from "../interface/abi.json";
import abi_nft from "../interface/abi_nft.json";


declare global {
  interface Window {
    ethereum?: any
  }
}

const CONTRACT_ADDRESS = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const CONTRACT_ADDRESS_NFT = "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0";

function getSVG(text: string) {
  return `data:image/svg+xml;base64,${btoa(`<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: black; font-family: Inter; font-size: 14px; }</style><rect width='100%' height='100%' fill='white' /><text x='50%' y='50%' class='base' dominant-baseline='middle' text-anchor='middle'>${text}</text></svg>`)}`
}

function dateFromDay(year: number, day: number) {
  var date = new Date(year, 0); // initialize a date in `year-01-01`
  return new Date(date.setDate(day)); // add the number of days
}

function MyApp({ Component, pageProps }: AppProps) {
    const [account, setAccount] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [date, setDate] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [bid, setBid] = useState("");
    const [currentBid, setCurrentBid] = useState("0");
    const [allBids, setAllBids] = useState<Bid[]>([]);
    const [sold, setSold] = useState(false);
    const [availableDay, setAvailableDay] = useState([])
    const [endsIn, setEndsIn] = useState(new Date())

    var provider: any, signer: any, contract: any;
    var provider_nft: any, signer_nft: any, contract_nft: any;

    const connectContract = () => {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer);
    };

    const connectContract_nft = () => {
      provider_nft = new ethers.providers.Web3Provider(window.ethereum);
      signer_nft = provider.getSigner();
      contract_nft = new ethers.Contract(CONTRACT_ADDRESS_NFT, abi_nft.abi, signer);
    };

    useEffect(() => {
      connectContract();
      contract.on("BidAdded", (bidder: string, id: number, bid: number, index: number) => {
        getAllBids(selectedDate.getDate())
        fetchBid(selectedDate.getDate())
      });

      contract.on("BidUpdated", (bidder: string, id: number, bid: number, index: number) => {
        getAllBids(selectedDate.getDate())
        fetchBid(selectedDate.getDate())
      });

      contract.on("BidRevoked", (bidder: string, id: number, bid: number, index: number) => {
        getAllBids(selectedDate.getDate())
        fetchBid(selectedDate.getDate())
      });

      contract.on("UpdateNFTListed", (owner: string, minAmount: number, date: string, sold: boolean, highestBidderId: number) => {
        console.log("NFT", highestBidderId.toString());
      });

      contract.on("BidWinner", (bidder: string, _listingId: number, bid: number, bidId: number) => {
          console.log("NFT", bidder, _listingId.toString(), bid.toString, bidId.toString());
      });
    }, [account]);

    const checkWalletIsConnected = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const accounts = await ethereum.request({ method: "eth_accounts" });

          if (accounts.length !== 0) {
            setAccount(accounts[0]);
            setIsAuthenticated(true);

            console.log(accounts[0]);
          } else {
            console.log("Do not have access");
          }
        } else {
          console.log("Install Metamask");
        }
      } catch (e) {
        console.log(e);
      }
    };

    const login = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          if (accounts.length !== 0) {
            setAccount(accounts[0]);
            setIsAuthenticated(true);
            console.log('Found')
          } else {
            console.log("Not Found");
          }
        } else {
          console.log("Install Metamask");
        }
      } catch (e) {
        console.log(e);
      }
    };

    const getListing = async (listingId: number) => {
      connectContract()

      let data = await contract.listings(listingId)

      return data
    }

    const fetchBid = async (listingId: number) => {
      connectContract();

      try {
        console.log(contract, listingId, account);
        let [bidId, found] = await contract.findBid(listingId, account);
        if (!found) return null;
        bidId = bidId.toNumber();

        let bid = await contract.bids(listingId, bidId);
        console.log(bid, bidId, listingId)
        setCurrentBid(ethers.utils.formatEther(bid.bid.toString()))
        return bid;
      } catch (e) {
        console.log(e);
        return false;
      }
    };

    const bidOnDate = async (day: number, bidAmount: string) => {
      connectContract();
      try {
        const options = {
          value: ethers.utils.parseEther(bidAmount),
        };
        const bid: any = await contract.addBid(day, options.value, options);
        await bid.wait();
      } catch (e) {
        console.log(e)
        return false;
      }

      return true;
    };

    const updateBid = async (
      date: string,
      listingId: number,
      bidAmount: string,
      sold: boolean
    ) => {
      connectContract();

      const bid = await fetchBid(listingId);
      let bidAmountt = ethers.utils.parseEther(bidAmount);
      let value: string = bidAmountt.sub(bid.bid).toString();
      const options = {
        value: ethers.utils.parseEther(ethers.utils.formatEther(value)),
      };
      let updateNFT = await contract.updateBid(listingId, bidAmountt, options);
      updateNFT = await updateNFT.wait();
    };

    const revokeBid = async (date: string, listingId: number) => {
      connectContract();

      let deleteBid = await contract.deleteBid(listingId);
      deleteBid = await deleteBid.wait();
    };

    const getAllBids = async (listingId: number) => {
      try {
        connectContract();
        var bids = await contract.getBids(listingId);
      } catch (e) {
        console.log(e)
        return
      }
      setAllBids(bids)
      return bids;
    };

    const submit = async () => {
      let bidAmount = ethers.utils.parseEther(bid.toString()).toString();

      const thatBid = await bidOnDate(Number(date), bidAmount);

      if (thatBid) console.log("Finished");
      else console.log("Not Finished:(");
    };

    const listNFT = async (date: number) => {
      connectContract();
      let listNFT = await contract.createListing(
        date,
        dateFromDay(new Date().getFullYear(), date).toJSON().slice(0, 10),
        120
      );
    };

    const setHighestBidder = async (listingId: number) => {
      connectContract();

      try {
        let highestBidder = await contract.getHighestBid(listingId);
        return highestBidder
      } catch (e) {
        console.log(e)
        return false
      }
    };
    
    const findHighestBidder = async (listingId: number) => {
      connectContract();
      
      try {
        await contract.getHighestBid(listingId);
        let highestBidder = await contract.getHighestBidReturn(listingId);
        console.log(highestBidder.bid.toString())
        let winner = await contract.declareWinner(listingId, highestBidder.index.toNumber());
        return highestBidder
      } catch (e) {
        console.log(e)
        return false
      }
    };

    const declareWinner = async (listingId: number) => {
      connectContract();
    };

    const getWinner = async (listingId: number) => {
      connectContract()
      let winner = await contract.listings(listingId)
      console.log("---------------------------------------------------------------------")
      console.log("Winner --> ", winner.highestBidderId.toNumber())
      console.log("Winner --> ", winner)
      console.log("---------------------------------------------------------------------")
      // winner = await contract.bids(listingId, winner.highestBidderId.toNumber())
      winner = await contract.getBid(0, 0)
      return winner
    }

    const getNFT = async (day: number) => {
      connectContract();

      let nft = await contract.getNFT(day);

      console.log(nft);

      return nft;
    };
    
    const getMintedNFT = async (day: number) => {
      connectContract_nft()
      try {
        console.log(contract_nft)
        var nft = await contract_nft.tokenURI(day)
        var owner = await contract_nft.ownerOf(day)
        nft = atob(nft.split(',')[1])
      } catch (e) {
        console.log(e)
        return false
      }
      
      return [nft, owner]
    }

    const mintNFT = async (day: number, text: string) => {
      connectContract_nft()
      try {
        let svg = getSVG(text)
        let json = await contract_nft.getTokenURI(svg, text, 'Yaadein')
        let nft = await contract_nft.checkNFT(selectedDate.toLocaleDateString(), day, json)
      } catch (e) {
        console.log(e)
        return false
      }
      
      return true
    }
    
    const changeNFT = async (day: number, text: string) => {
      connectContract_nft()
      try {
        // let svg = getSVG(text)
        // let json = await contract_nft.getTokenURI(svg, text, 'Yaadein')
        let nft = await contract_nft.changeURI(day, text)
      } catch (e) {
        console.log(e)
        return false
      }
    }
  
  	let sharedState: Context = {
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
      setHighestBidder,
      findHighestBidder,
      declareWinner,
      getNFT,
      provider,
      signer,
      contract,
      connectContract,
      getWinner,
      getListing,
      mintNFT,
      getMintedNFT,
      changeNFT
	  }

  return (
    <AppContext.Provider value={sharedState}>
      <Component {...pageProps} />
    </AppContext.Provider> 
  ) 
}

export default MyApp
