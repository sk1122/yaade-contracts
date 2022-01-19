import { Dialog, Transition } from '@headlessui/react'
import { ethers } from 'ethers'
import { FC, Fragment, useState } from 'react'
import { Bid } from '../types/bid'

type Props = {
	title: string,
	isOpen: boolean,
	setIsOpen: Function
	submit: Function
	setBid: Function
	updateBid: Function
  bid: string
  currentBid: string
  allBids: Array<Bid>
}

const Modal: FC<Props> = ({ title, isOpen, setIsOpen, submit, bid, setBid, currentBid, updateBid, allBids, children }) => {
  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }
  
  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
        >
          Open dialog
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="text-inter inline-block w-1/2 space-y-5 max-w-full p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Day of the year - {title} <span className='text-sm'>date</span>
                </Dialog.Title>
                {currentBid === '0' ? 
                  <div>
                    <input onChange={(e) => setBid(e.target.value)} type="text" className='border border-5 border-black' placeholder='bid' />
                    <button onClick={() => submit()}>Submit</button>
                  </div>
                : 
                  <div>
                    <h1>Your Current Bid - {ethers.utils.formatEther(currentBid)} E</h1>
                    <input onChange={(e) => setBid(e.target.value)} type="text" className='border border-5 border-black' placeholder='bid' />
                    <button onClick={() => {if(bid.length !== 0) updateBid(title, title, bid, false)}} className='ml-5 bg-yellow-400 p-1 cursor-pointer bg-gradient-to-r from-purple-400 to-violet-700 text-white'>Update</button>
                  </div>
                }

                {allBids.map(value => (
                  <div className='flex justify-center items-start flex-col space-y-4'>
                    <h1>{value.bidder} - {ethers.utils.formatEther(value.bid.toString())} E</h1>
                  </div>
                ))}
                
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>

  )
}

export default Modal