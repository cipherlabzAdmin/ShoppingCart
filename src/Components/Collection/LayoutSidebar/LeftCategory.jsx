import Image from "next/image";
import React, { useContext } from "react";
import { Nav, NavItem, NavLink } from "reactstrap";
import { placeHolderImage } from "../../../../Data/CommonPath";
import CategoryContext from "@/Helper/CategoryContext";
import I18NextContext from "@/Helper/I18NextContext";
import { useCustomSearchParams } from "@/Utils/Hooks/useCustomSearchParams";
import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter } from "next/navigation";

const LeftCategory = ({ filter, setFilter }) => {
  const { filterCategory } = useContext(CategoryContext);
  const categoryData = filterCategory("product");
  const { i18Lang } = useContext(I18NextContext);
  const [layout] = useCustomSearchParams(["layout"]);
  const { t } = useTranslation(i18Lang, "common");
  const router = useRouter();
  const pathname = usePathname();
  const redirectToCollection = (slug) => {
    // eslint-disable-next-line no-unsafe-optional-chaining
    let temp = [...filter?.category];
    if (!temp.includes(slug)) {
      temp.push(slug);
    } else {
      temp = temp.filter((elem) => elem !== slug);
    }
    setFilter((prev) => {
      return {
        ...prev,
        category: temp,
      };
    });
    if (temp.length > 0) {
      const queryParams = new URLSearchParams({
        ...layout,
        category: temp,
      }).toString();
      router.push(`${pathname}?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({ ...layout }).toString();
      router.push(`${pathname}?${queryParams}`);
    }
  };
  return (
    <div className="col-custome-3">
      <div className="left-box">
        <div className="shop-left-sidebar">
          <Nav className="nav-pills mb-3 custom-nav-tab">
            {filterCategory?.map((category, i) => (
              <NavItem
                onClick={() => redirectToCollection(category?.slug)}
                key={i}
              >
                <NavLink
                  className={
                    filter?.category?.includes(category?.slug) ? "active" : ""
                  }
                >
                  {category?.name}
                  <Image
                    src={
                      category?.category_icon?.original_url || placeHolderImage
                    }
                    alt={category?.name}
                    height={80}
                    width={80}
                  />
                </NavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default LeftCategory;
