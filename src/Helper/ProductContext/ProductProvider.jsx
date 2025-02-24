import React, { useEffect, useState, useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import request from '@/Utils/AxiosUtils';
import { ProductAPI } from '@/Utils/AxiosUtils/API';
import ProductContext from '.';
import CustomerContext from '../CustomerContext';
const baseUrl = process?.env?.API_BASE_URL;

const ProductProvider = (props) => {
  const [customProduct, setCustomProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [totalDealIds, setTotalDealIds] = useState('');
  const { warehouseSelect, setWarehouseSelect } = useContext(CustomerContext);

  const storedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouse'));

  const [productAPIData, setProductAPIData] = useState({ data: [], refetchProduct: '', params: { ...totalDealIds }, productIsLoading: false });
  const {
    data: productData,
    refetch: productRefetch,
    isLoading: productIsLoading,
  } = useQuery(
    [ProductAPI],
    () => request({ url: ProductAPI, params: { ...productAPIData.params, ids: totalDealIds, status: 1, paginate: Object.keys(totalDealIds).length > 5 ? Object.keys(totalDealIds).length : 5 } }),
    {
      enabled: false,
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    },
  );
  useEffect(() => {
    if (productData) {
      setProductAPIData((prev) => ({ ...prev, data: productData, productIsLoading: productIsLoading }));
    }
  }, [productData]);


  useEffect(() => {
    async function fetchProducts() {
      try {
       const response = await fetch(`${baseUrl}services/app/product/GetAll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
      body: JSON.stringify({
        "isQuantityRequired": true,
        "keyword": "",
        "isActive": true,
        "warehouseId": storedWarehouse ? storedWarehouse.id : null,
        "skipCount": 0,
        "maxResultCount": 10
      }),
    });

 
        const productsData = await response.json();
        setProducts(productsData.result.items);
        // setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        // setLoading(false);
      }
    }

    fetchProducts();
  }, [warehouseSelect]);
  return (
    <ProductContext.Provider value={{ ...props, productAPIData, setProductAPIData, customProduct, setCustomProduct, totalDealIds, setTotalDealIds, productRefetch, productData,products }}>
      {props.children}
    </ProductContext.Provider>
  );
};
export default ProductProvider;
