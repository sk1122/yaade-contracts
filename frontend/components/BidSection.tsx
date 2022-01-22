import DisplayData from "./DisplayData";
import StackeCard from "./StackedCard";

type Props = {};

const BidSection = (props: Props) => {
  return (
    <div className="flex justify-between space-x-80 mt-24 h-fit">
      <StackeCard />
      <DisplayData />
    </div>
  );
};

export default BidSection;
