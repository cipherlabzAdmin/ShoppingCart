import React, { useContext } from 'react';
import Image from 'next/image';
import AccountContext from '@/Helper/AccountContext';
import coverImage from '../../../../public/assets/images/inner-page/cover-img.jpg';
import Avatar from '@/Components/Common/Avatar';
import Cookies from "js-cookie";

const SidebarProfile = () => {
  const { accountData } = useContext(AccountContext);
  const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;

  const isAuthCusString = Cookies.get("cusTemp");
  const isAuthCus = isAuthCusString ? JSON.parse(isAuthCusString) : null;
  return (
    <>
      <div className='profile-box'>
        <div className='cover-image'>
          <Image src={coverImage} className='img-fluid' alt='cover-image' height={150} width={378} />
        </div>

        <div className='profile-contain'>
          <div className='profile-image'>
            <div className='position-relative'>
              <div className='user-round'>
                <Avatar name={isAuth ? isAuth.firstName : isAuthCus ? isAuthCus.firstName : 'user'} customImageClass={'update_img'} alt='profile-image' height={108} width={108} />
              </div>
            </div>
          </div>

          <div className='profile-name'>
            <h3>{isAuth ? isAuth.firstName : isAuthCus ? isAuthCus.firstName : 'user'}</h3>
            <h6 className='text-content' style={{color: 'var(--theme-color)'}}>{isAuth ? isAuth.email : isAuthCus ? isAuthCus.email : 'user'}</h6>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarProfile;
