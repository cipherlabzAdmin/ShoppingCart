'use client';
import { useContext, useEffect, useState } from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import { LeafSVG } from '../Common/CommonSVG';
import { Input, InputGroup } from 'reactstrap';
import WrapperComponent from '../Common/WrapperComponent';
import Btn from '@/Elements/Buttons/Btn';
import { useRouter, useSearchParams } from 'next/navigation';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import SearchedData from './SearchedData';
import ProductContext from '@/Helper/ProductContext';
import { NextResponse } from "next/server";
const baseUrl = process?.env?.API_BASE_URL;

const SearchModule = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const [searchState, setSearchState] = useState('');
  const router = useRouter();
   const searchParams = useSearchParams()
   const search = searchParams.get('search');
   const storedWarehouse = JSON.parse(localStorage.getItem("selectedWarehouse"));

   useEffect(() => {

    search && setSearchState(search);

   }, [search])
   
   
   const [data,setData]=useState([])
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
            "keyword": search,
            "isActive": true,
            "isQuantityRequired": true,
            "skipCount": 0,
            "warehouseId": storedWarehouse.id,
            "maxResultCount": 16
          }),
        });
       
    
        const result = await response.json();
        // return NextResponse.json(result.result.items);
        setData(result.result.items);
        
      } catch (error) {
        console.log(error);
        return NextResponse.json({
          message: "Something went wrong with the POST request",
        });
      }
    }
    fetchProducts();

  }, [search]);

  const onHandleSearch = () => {
    router.push(`/${i18Lang}/search?search=${searchState}`);
  };
  const onChangeHandler = (value) => {
    if (!value) {
      router.push(`/${i18Lang}/search?search=`);
    }
    setSearchState(value);
  };

  return (
    <>
      <Breadcrumb title={'Search'} subNavigation={[{ name: 'Search' }]} />
      <WrapperComponent classes={{ sectionClass: 'search-section', col: 'mx-auto' }} colProps={{ xxl: 6, xl: 8 }}>
        <div className='title d-block text-center'>
          <h2>{t('Searchforproducts')}</h2>
          <span className='title-leaf'>
            <LeafSVG />
          </span>
        </div>

        <div className='search-box'>
          <InputGroup>
            <Input type='text' className='form-control' value={searchState} onChange={(e) => onChangeHandler(e.target.value)} />
            <Btn className='theme-bg-color text-white m-0' type='button' title='Search' onClick={onHandleSearch} />
          </InputGroup>
        </div>
      </WrapperComponent>
      <SearchedData data={data} />
    </>
  );
};

export default SearchModule;