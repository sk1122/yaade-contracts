import SmallCard from "./SmallCard";

type Props = {};

const Calender = (props: Props) => {
  return (
    <div className="flex flex-col items-center bg-[#FCF2EA] h-fit mt-32 pb-20">
      <div className="text-4xl font-bold mt-12 mb-10">
        With Calendar NFT cherish your memories forever
      </div>
      <div className="w-5/6 flex justify-end font-semibold mb-6">
        <span>January 2022</span>
        {/* left */}
        <svg
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
      <div className="w-5/6 grid grid-cols-7 gap-y-4 place-items-center">
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
        <SmallCard />
      </div>
    </div>
  );
};

export default Calender;
