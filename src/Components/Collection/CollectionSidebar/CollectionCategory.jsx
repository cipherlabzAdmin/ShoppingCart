import { useContext } from "react";
import { AccordionBody, Input, Label } from "reactstrap";
import CategoryContext from "@/Helper/CategoryContext";
import { usePathname, useRouter } from "next/navigation";
import { useCustomSearchParams } from "@/Utils/Hooks/useCustomSearchParams";

const CollectionCategory = ({ filter, setFilter }) => {
  const [attribute, price, rating, sortBy, field, layout] =
    useCustomSearchParams([
      "attribute",
      "price",
      "rating",
      "sortBy",
      "field",
      "layout",
    ]);
  const { filterCategory } = useContext(CategoryContext);
  const { category, subCategory } = useContext(CategoryContext);
  const categoryData = filterCategory("product");
  const router = useRouter();
  const pathname = usePathname();

  const redirectToCollection = (event, slug) => {
    event.preventDefault();
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
        ...attribute,
        ...price,
        ...sortBy,
        ...field,
        ...rating,
        ...layout,
        category: temp,
      }).toString();
      router.push(`${pathname}?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({
        ...attribute,
        ...price,
        ...sortBy,
        ...field,
        ...rating,
        ...layout,
      }).toString();
      router.push(`${pathname}?${queryParams}`);
    }
  };

  const redirectToSubCollection = (event, slug) => {
    event.preventDefault();
    // eslint-disable-next-line no-unsafe-optional-chaining
    let temp = [...filter?.subCategory];
    if (!temp.includes(slug)) {
      temp.push(slug);
    } else {
      temp = temp.filter((elem) => elem !== slug);
    }

    setFilter((prev) => {
      return {
        ...prev,
        subCategory: temp,
      };
    });
    if (temp.length > 0) {
      const queryParams = new URLSearchParams({
        ...attribute,
        ...price,
        ...sortBy,
        ...field,
        ...rating,
        ...layout,
        subCategory: temp,
      }).toString();
      router.push(`${pathname}?${queryParams}`);
    } else {
      const queryParams = new URLSearchParams({
        ...attribute,
        ...price,
        ...sortBy,
        ...field,
        ...rating,
        ...layout,
      }).toString();
      router.push(`${pathname}?${queryParams}`);
    }
  };
  return (
    <AccordionBody accordionId="1">
      <ul className="category-list custom-padding custom-height">
        {category?.map((elem, i) => (
          <li key={i}>
            <div className="form-check category-list-box">
              <Input
                className="checkbox_animated"
                type="checkbox"
                id={elem?.name}
                checked={filter?.category?.includes(elem?.name)}
                onChange={(e) => redirectToCollection(e, elem?.name)}
              />
              <Label className="form-check-label" htmlFor={elem?.name}>
                <b>
                  <span className="name">{elem?.name}</span>
                </b>
                <b>
                  {" "}
                  <span className="number">({elem?.productCount})</span>
                </b>
              </Label>
            </div>

            <ul className="subcategory-list ms-4 mt-2">
              {subCategory
                .filter((subcategory) => subcategory.categoryId === elem.id)
                .map((subCategoryElem, j) => (
                  <li key={j}>
                    <div className="form-check category-list-box">
                      <Input
                        className="checkbox_animated"
                        type="checkbox"
                        id={subCategoryElem?.name}
                        checked={filter?.subCategory?.includes(
                          subCategoryElem?.name
                        )}
                        onChange={(e) =>
                          redirectToSubCollection(e, subCategoryElem?.name)
                        }
                      />
                      <Label
                        className="form-check-label"
                        htmlFor={subCategoryElem?.name}
                      >
                        <span className="name">{subCategoryElem?.name}</span>
                      </Label>
                    </div>
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </AccordionBody>
  );
};

export default CollectionCategory;
