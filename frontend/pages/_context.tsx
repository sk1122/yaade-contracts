import { useEffect, FC, createContext, useContext, useState } from 'react';
import { ethers } from 'ethers'
import { Bid } from "../types/bid";
import abi from "../interface/abi.json";

export interface Context {
	account: string,
	setAccount: Function,
	isAuthenticated: boolean,
	setIsAuthenticated: Function,
	isOpen: boolean,
	setIsOpen: Function,
	date: string,
	setDate: Function,
	month: string,
	setMonth: Function,
	year: string,
	setYear: Function,
	selectedDate: Date,
	setSelectedDate: Function,
	availableDay: Array<Date>,
	setAvailableDay: Function,
	endsIn: Date,
	setEndsIn: Function,
	bid: string,
	setBid: Function,
	currentBid: string,
	setCurrentBid: Function,
	allBids: Bid[],
	setAllBids: Function,
	sold: boolean,
	setSold: Function,
	checkWalletIsConnected: Function,
	login: Function,
	fetchBid: Function,
	bidOnDate: Function,
	updateBid: Function,
	revokeBid: Function,
	getAllBids: Function,
	submit: Function,
	listNFT: Function,
	setHighestBidder: Function,
	findHighestBidder: Function,
	getNFT: Function,
	provider: any,
	signer: any,
	contract: any,
	connectContract: Function,
	getWinner: Function,
	getListing: Function,
	mintNFT: Function,
	getMintedNFT: Function,
	changeNFT: Function
}

export const AppContext = createContext<Context>({} as Context);

export function useAccountContext() {
  return useContext(AppContext);
}
