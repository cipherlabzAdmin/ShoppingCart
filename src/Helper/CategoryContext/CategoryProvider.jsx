import React, { useEffect, useState } from "react";
import { CategoryAPI } from "@/Utils/AxiosUtils/API";
import { useQuery } from "@tanstack/react-query";
import request from "@/Utils/AxiosUtils";
import CategoryContext from ".";

const CategoryProvider = (props) => {
  const [categoryAPIData, setCategoryAPIData] = useState({
    data: [],
    refetchCategory: "",
    params: {},
    categoryIsLoading: false,
  });
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const { data: categoryData, isLoading: categoryIsLoading } = useQuery(
    [CategoryAPI],
    () =>
      request({
        url: CategoryAPI,
        params: { ...categoryAPIData.params, status: 1 },
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: (data) => data?.data?.data,
    }
  );
  const filterCategory = (value) => {
    return categoryData?.filter((elem) => elem.type === value) || [];
  };

  // Setting Data on Category variables
  useEffect(() => {
    if (categoryData) {
      setCategoryAPIData((prev) => ({
        ...prev,
        data: categoryData,
        categoryIsLoading: categoryIsLoading,
      }));
    }
  }, [categoryData]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/category", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
        }); // Replace with your API endpoint
        const categoryData = await response.json();
        setCategory(categoryData);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchSubCategory() {
      try {
        const response = await fetch("/api/subCategory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
        }); // Replace with your API endpoint
        const categoryData = await response.json();
        setSubCategory(categoryData.items);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchSubCategory();
  }, []);

  return (
    <CategoryContext.Provider
      value={{
        ...props,
        categoryAPIData,
        category,
        subCategory,
        setCategoryAPIData,
        filterCategory: filterCategory,
        categoryIsLoading,
      }}
    >
      {props.children}
    </CategoryContext.Provider>
  );
};

export default CategoryProvider;
