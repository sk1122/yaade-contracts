import { ethers } from "ethers";
import abi from '../interface/abi_nft.json'

const CONTRACT_ADDRESS = '0x0b306bf915c4d645ff596e518faf3f9669b97016'

var provider: any, signer: any, contract: any;
const connectContract = () => {
	provider = new ethers.providers.JsonRpcProvider()
	signer = provider.getSigner()
	contract = new ethers.Contract(CONTRACT_ADDRESS, abi.abi, signer)
}

const mintNFT = async () => {
	connectContract()

	const data = {
		"name": "EpicLordHamburger",
		"description": "An NFT from the highly acclaimed square collection",
		"image": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4NCiAgICA8c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDE0cHg7IH08L3N0eWxlPg0KICAgIDxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9ImJsYWNrIiAvPg0KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+DQo8L3N2Zz4="
	}

	const minted = await contract.mint(JSON.stringify(data))

	console.log(minted)
}
export default mintNFT