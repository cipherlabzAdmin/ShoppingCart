import I18NextContext from '@/Helper/I18NextContext';
import Link from 'next/link';
import { useContext } from 'react';
import Image from 'next/image';
import { FaFacebookMessenger } from 'react-icons/fa';
import emptyImage from '../../../../public/assets/svg/messanger.svg';

const HeaderMessenger = () => {
  const { i18Lang } = useContext(I18NextContext);

  const messengerLink = "https://m.me/CocaColaSL?mibextid=2JQ9oc?ref=Hello%20there!";

  return (
    <li className='right-side'>
      <a href={messengerLink} target="_blank" className='btn p-0 position-relative header-messenger'>
      <Image src={emptyImage} className='img-fluid' alt='no-data' height={25} width={25} />
      </a>
    </li>
  );
};

export default HeaderMessenger;
