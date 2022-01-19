import { BigNumber } from "ethers"

export interface Bid {
	bid: BigNumber,
	bidder: string,
	index: BigNumber,
	tokenContract: string
}