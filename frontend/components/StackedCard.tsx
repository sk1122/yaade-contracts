import { useContext, useEffect } from 'react'
import { useAccountContext } from '../pages/_context'

type Props = {};

const StackedCard = ({}: Props) => {  
  const { selectedDate } = useAccountContext()
  
  return (
    <main className="w-full relative flex justify-center md:justify-end h-fit rounded-r-lg">
      <div className="relative h-96 w-80">
        <div className="bg-[#DFD3C9] shadow-md inline-block w-80 h-96 rounded-lg absolute bottom-0 transform -rotate-6 border border-black">
          <div className="h-1/5 border-b-2 border-black flex items-center justify-center">
            <div className="bg-black w-1/3 h-1/6 rounded-full" />
          </div>
        </div>
        <div className="bg-[#DFD3C9] shadow-lg inline-block w-80 h-96 rounded-lg absolute bottom-0 transform -rotate-3 border border-black">
          <div className="h-1/5 border-b-2 border-black flex items-center justify-center">
            <div className="bg-black w-1/3 h-1/6 rounded-full" />
          </div>
        </div>
        <div className="bg-[#DFD3C9] shadow-lg inline-block w-80 h-96 rounded-lg absolute bottom-0 transform rotate-3 border border-black">
          <div className="h-1/5 border-b-2 border-black flex items-center justify-center">
            <div className="bg-black w-1/3 h-1/6 rounded-full" />
          </div>
        </div>
        <div className="bg-[#DFD3C9] overflow-hidden border border-black transition shadow-xl w-80 h-96 rounded-lg absolute bottom-0 z-10">
          <div className="h-1/5 border-b-2 border-black flex items-center justify-center">
            <div className="bg-black w-1/2 h-1/6 rounded-full" />
          </div>
          <div className="w-full h-full absolute top-0 flex flex-col items-center justify-center">
            <div className="text-[140px] font-bold">{selectedDate.getDate()}</div>
            <div className="text-xl font-bold">{selectedDate.toLocaleDateString(undefined, { month: 'long' })}, {selectedDate.toLocaleDateString(undefined, { year: 'numeric' })}</div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StackedCard;
