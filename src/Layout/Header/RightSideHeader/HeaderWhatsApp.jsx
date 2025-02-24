import I18NextContext from '@/Helper/I18NextContext';
import Link from 'next/link';
import { useContext } from 'react';
import { RiWhatsappFill } from 'react-icons/ri';

const HeaderWishList = () => {
  const { i18Lang } = useContext(I18NextContext);
  return (
    <li className='right-side'>
      <Link href="https://api.whatsapp.com/send?phone=94704707000&text=Hello%20there!" target="_blank" className='btn p-0 position-relative header-wishlist'>
        <RiWhatsappFill color="#3caf41"/>
      </Link>
    </li>
  );
};

export default HeaderWishList;
