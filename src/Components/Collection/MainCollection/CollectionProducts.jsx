
import { useState, useEffect} from 'react';
import { useParams } from 'next/navigation';
import { Col, Row } from 'reactstrap';
import NoDataFound from '@/Components/Common/NoDataFound';
import Pagination from '@/Components/Common/Pagination';
import ProductBox1 from '@/Components/Common/ProductBox/ProductBox1/ProductBox1';
import request from '@/Utils/AxiosUtils';
import { ProductAPI } from '@/Utils/AxiosUtils/API';
import { useQuery } from '@tanstack/react-query';
import noProduct from '../../../../public/assets/svg/no-product.svg';
import ProductSkeletonComponent from '@/Components/Common/SkeletonLoader/ProductSkeleton/ProductSkeletonComponent';
import { NextResponse } from "next/server";
import { useContext } from 'react';
import CategoryContext from '@/Helper/CategoryContext';
import { useSearchParams } from 'next/navigation';
import CustomerContext from '@/Helper/CustomerContext';
const baseUrl = process?.env?.API_BASE_URL;

const CollectionProducts = ({ filter, grid }) => {
  const { slug } = useParams();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(0);
  const [products, setProducts] = useState([]);
  const { category, subCategory } = useContext(CategoryContext);
  const { warehouseSelect, setWarehouseSelect } = useContext(CustomerContext);

  const searchParams = useSearchParams();
  const priceParam = searchParams.get('price');

  const storedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouse'));
  
  const { data, fetchStatus } = useQuery(
    [page, filter],
    () =>
      request({
        url: ProductAPI,
        params: {
          page,
          status: 1,
          paginate: 40,
          field: filter?.field ?? '',
          price: filter?.price.join(',') ?? '',
          category: filter?.category.join(','),
          sort: '',
          sortBy: filter?.sortBy ?? 0,
          rating: filter?.rating.join(',') ?? '',
          attribute: filter?.attribute.join(',') ?? '',
          store_slug: slug ? slug : null,
        },
      }),
    {
      enabled: true,
      refetchOnWindowFocus: false,
      select: (data) => data.data,
    },
  );

  useEffect(() => {

    const calculatedSkipCount = (page - 1) * 10;

    setSkipCount(calculatedSkipCount);
    
  }, [page])

  const getCategoryIds = (cat) => {
    const categoryIds = [];
    filter.category.forEach(name => {
      const category = cat?.find(cat => cat.name === name);
      if (category) {
        categoryIds.push(category.id);
      }
    });
    return categoryIds;
  };

  const getsubCategoryIds = (cat) => {
    const subCategoryIds = [];
    if(subCategory && filter.subCategory){
      filter.subCategory.forEach(name => {
        const category = cat?.find(cat => cat.name === name);
        if (category) {
          subCategoryIds.push(category.id);
        }
      });
    }
   
    return subCategoryIds;
  };
  

  useEffect(() => {

    const categoryIdsArray = getCategoryIds(category);
    const subCategoryIdsArray = getsubCategoryIds(subCategory);
    let lowp = null;
    let highp = null;

    if(priceParam){
      [lowp, highp] = priceParam.split("-").map(Number);
    }
   
   

    async function fetchProducts() {
      try {
        const response = await fetch(`${baseUrl}services/app/product/GetAll`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Add any additional headers if needed
          },
          body: JSON.stringify({
            "keyword": "",
            "isActive": true,
            "sortType": filter.sortBy,
            "isQuantityRequired": true,
            "skipCount": skipCount,
            "priceFrom": lowp,
            "priceTo": highp,
            "categoryIds":categoryIdsArray,
            "subCateoryIds": subCategoryIdsArray,
            "warehouseId": storedWarehouse ? storedWarehouse.id : null,
            "maxResultCount": 16
          }),
        });
    
        const result = await response.json();
        setTotal(result.result.totalCount);
        setProducts(result.result.items);
      } catch (error) {
        return NextResponse.json({
          message: "Something went wrong with the POST request",
        });
      }
    }

    fetchProducts();
  }, [filter, page, total, warehouseSelect]);

  return (
    <>
      {fetchStatus == 'fetching' ? (
        <Row xxl={grid !== 3 && grid !== 5 ? 4 : ''} xl={grid == 5 ? 5 : 3} lg={grid == 5 ? 4 : 2} md={3} xs={2} className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}>
          <ProductSkeletonComponent item={40} />
        </Row>
      ) : products?.length > 0 ? (
        <Row xxl={grid !== 3 && grid !== 5 ? 4 : ''} xl={grid == 5 ? 5 : 3} lg={grid == 5 ? 4 : 2} md={3} xs={2} className={`g-sm-4 g-3 product-list-section ${grid == 'list' ? 'list-style' : ''}`}>
          {products?.map((product, i) => (
            <Col key={i}>
              <ProductBox1 imgUrl={product?.product_thumbnail} productDetail={{ ...product }} classObj={{ productBoxClass: 'product-box-3' }} />
            </Col>
          ))}
        </Row>
      ) : (
        <NoDataFound
          data={{
            imageUrl: noProduct,
            customClass: 'no-data-added collection-no-data',
            title: "Sorry! Couldn't find the products you were looking For!",
            description: 'Please check if you have misspelt something or try searching with other way.',
            height: 345,
            width: 345,
          }}
        />
      )}

      {products?.length > 0 && (
        <nav className='custome-pagination'>
          <Pagination current_page={page} total={total} per_page={16} setPage={setPage} />
        </nav>
      )}
    </>
  );
};

export default CollectionProducts;
