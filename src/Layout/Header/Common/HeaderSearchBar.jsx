import { useContext, useState } from "react";
import { Input, InputGroup } from "reactstrap";
import I18NextContext from "@/Helper/I18NextContext";
import { useRouter } from "next/navigation";
import Btn from "@/Elements/Buttons/Btn";
import { FaSearch } from "react-icons/fa";

const HeaderSearchBar = () => {
  const [searchValue, setSearchValue] = useState("");
  const { i18Lang } = useContext(I18NextContext);
  const router = useRouter();

  const onHandleSearch = () => {
    if (searchValue) {
      router.push(`/${i18Lang}/search?search=${searchValue}`);
    } else {
      router.push(`/${i18Lang}/search`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onHandleSearch();
    }
  };

  return (
    <div className="middle-box">
      <div className="search-box">
        <InputGroup>
          <Input
            type="search"
            className="form-control"
            placeholder="I'm searching for..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleKeyDown} 
          />
          {/* <Btn className="btn" type="button" id="button-addon2" onClick={onHandleSearch}>
            <FaSearch />
          </Btn> */}
        </InputGroup>
      </div>
    </div>
  );
};

export default HeaderSearchBar;
