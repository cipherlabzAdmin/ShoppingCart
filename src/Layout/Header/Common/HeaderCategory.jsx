import React, { useContext, useMemo, useState } from "react";
import Link from "next/link";
import { Col } from "reactstrap";
import Avatar from "@/Components/Common/Avatar";
import TodaysDeal from "./TodaysDeal";
import Btn from "@/Elements/Buttons/Btn";
import ClassicHeaderMenu from "./ClassicHeaderMenu";
import { placeHolderImage } from "../../../../Data/CommonPath";
import placeHolderImg from "../../../../public/assets/images/placeholder1.png";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import CategoryContext from "@/Helper/CategoryContext";
import ThemeOptionContext from "@/Helper/ThemeOptionsContext";
import { RiAlignLeft, RiCloseLine, RiArrowDropRightLine } from "react-icons/ri";
import WarehouseHeader from "./WarehouseHeader";

const HeaderCategory = ({ customClass, icon, dropDownClass }) => {
  const { filterCategory } = useContext(CategoryContext);
  const categoryData = filterCategory("product");
  const { category, subCategory } = useContext(CategoryContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const { themeOption } = useContext(ThemeOptionContext);

  const [catId, setCatId] = useState();

  const filteredCategories = useMemo(() => {
    return categoryData?.filter((elem) =>
      themeOption?.header?.category_ids?.includes(elem.id)
    );
  });

  function showSubCategory() {
    const elem = document.getElementById("sub-cat");
    document.getElementById("sub-cat").style.opacity = 1;
    document.getElementById("sub-cat").style.visibility = "visible";
  }

  function hideSubCategory() {
    document.getElementById("sub-cat").style.opacity = 0;
    document.getElementById("sub-cat").style.visibility = "hidden";
  }

  return (
    <Col xs={12}>
      <div className={`${customClass ? customClass : "header-nav"}`}>
        <div className="header-nav-left">
          <Btn className="deal-btn">
            <span>{t(" AllCategories")}</span>
            {icon ? icon : <RiAlignLeft style={{ color: "var(--theme)" }} />}
          </Btn>

          <div className="category-dropdown">
            <div className="category-title">
              <h5>{t("Categories")}</h5>
              <Btn type="button" className="p-0 close-button text-content">
                <RiCloseLine />
              </Btn>
            </div>

            <ul className="category-list">
              {category && category.length > 0 &&
                category?.map((elem, i) => (
                  <li
                    className="onhover-category-list"
                    key={i}
                    onMouseEnter={() => {
                      setCatId(elem.id);
                      showSubCategory();
                    }}
                    onMouseLeave={hideSubCategory}
                  >
                    <Link
                      href={`/${i18Lang}/collections?category=${elem?.name}`}
                      className="category-name"
                    >
                      <div
                        className="cat-item"
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                        }}
                      >
                        <h6>{elem?.name}</h6>
                        <span style={{ marginLeft: "auto" }}>
                          <RiArrowDropRightLine size="2em" />
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>

          <div
            className="sub-category-dropdown"
            id="sub-cat"
            onMouseEnter={showSubCategory}
            onMouseLeave={hideSubCategory}
          >
            <div className="sub-category-title">
              <h5>{t("Categories")}</h5>
              <Btn type="button" className="p-0 close-button text-content">
                <RiCloseLine />
              </Btn>
            </div>

            <ul className="sub-category-list">
              {subCategory &&
                subCategory
                  .filter((subcategory) => subcategory.categoryId === catId)
                  .map((elem, i) => (
                    <li className="onhover-sub-category-list" key={i}>
                      <Link
                        href={`/${i18Lang}/collections?subCategory=${elem?.name}`}
                        className="category-name"
                      >
                        <div className="cat-item">
                          <h6>{elem.name}</h6>
                        </div>
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
        </div>
        <ClassicHeaderMenu />

        <WarehouseHeader />
        <TodaysDeal />
      </div>
    </Col>
  );
};

export default HeaderCategory;
