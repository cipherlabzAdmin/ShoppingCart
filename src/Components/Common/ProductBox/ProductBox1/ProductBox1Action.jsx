import QuickView from "../QuickView";
import AddToWishlist from "../AddToWishlist";
import AddToCompare from "../AddToCompare";

const ProductBoxAction = ({ productObj, listClass }) => {
  return (
    <ul 
    className={listClass} 
    style={{
      width: "50%",
      display: "flex",
      justifyContent: "center",
      gap: "1rem", 
    }}
  >
      <QuickView productObj={productObj} />
      <AddToWishlist productObj={productObj} />
    </ul>
  );
};

export default ProductBoxAction;
