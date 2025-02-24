import { useState } from 'react';
import MenuList from './MenuList';
import { headerMenu } from '../../../../Data/HeadersMenu';
import { adminHeaderMenu, driverHeaderMenu } from '../../../../Data/AdminHeadersMenu';
import Cookies from "js-cookie";

const MainHeaderMenu = () => {
  const [isOpen, setIsOpen] = useState([]);
  const isAuthString = Cookies.get("uatTemp");
  const isAuth = isAuthString ? JSON.parse(isAuthString) : null;
  //change navigation for admin privileged users
  const Nav = isAuth?.userType === 5 ? driverHeaderMenu : (isAuth?.userType === null ? adminHeaderMenu : headerMenu);
  return (
    <ul className='navbar-nav'>
      {Nav.map((menu, i) => (
        <MenuList menu={menu} key={i} customClass={'nav-item'} level={0} isOpen={isOpen} setIsOpen={setIsOpen} />
      ))}
    </ul>
  );
};

export default MainHeaderMenu;
