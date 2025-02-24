import { useContext } from "react";
import { Col, Row } from "reactstrap";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import { useHeaderScroll } from "@/Utils/HeaderScroll";
import HeaderCategory from "./Common/HeaderCategory";
import HeaderLogo from "./Common/HeaderLogo";
import HeaderSearchBar from "./Common/HeaderSearchBar";
import HeaderTopBar from "./Common/HeaderTopBar";
import RightSideHeader from "./RightSideHeader";


const BasicHeader = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const UpScroll = useHeaderScroll(false);
  return (
    <header
      className={`pb-md-4 pb-0 ${
        themeOption?.header?.sticky_header_enable && UpScroll ? "active" : ""
      }`}
    >
      {/* {themeOption?.header?.page_top_bar_enable && <HeaderTopBar />} */}
      <div className="top-nav top-header sticky-header p-0">
        <div className="container-fluid-lg">
          <Row>
            <Col xs="12">
              <div className="navbar-top">
                <HeaderLogo />

                <HeaderSearchBar />

                <div style={{ textAlign: "center" }}>
                  <h3 style={{ fontWeight: "bold" }}>Hotline</h3>
                  <b>
                    <h4 style={{ fontWeight: "bold" }}>011 3427 500</h4>
                  </b>
                </div>


                <RightSideHeader />
              </div>
            </Col>
          </Row>
        </div>
        <div className="category">
          <div className="container-fluid-lg" style={{background:'var(--yellow)'}}>
            <Row>
              <HeaderCategory />
            </Row>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BasicHeader;
