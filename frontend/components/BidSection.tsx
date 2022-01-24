import DisplayData from "./DisplayData";
import StackeCard from "./StackedCard";

type Props = {};

const BidSection = (props: Props) => {
  return (
    <div className="flex flex-col items-center space-y-20 md:space-y-0 md:flex-row md:space-x-80 mt-24 h-fit">
      <StackeCard />
      <DisplayData />
    </div>
  );
};

export default BidSection;
