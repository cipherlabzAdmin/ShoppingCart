import { useContext, useEffect } from 'react';
import ThemeOptionContext from '@/Helper/ThemeOptionsContext';
import TabFocusChecker from '@/Utils/CustomFunctions/TabFocus';
import CookiesComponent from './Cookies';
import MainFooter from './Footer';
import MainHeader from './Header';
import MobileMenu from './MobileMenu';
import NewsLetterModal from './NewsLetter/NewsLetterModal';
import RecentPurchase from './RecentPurchase';
import Cart from './Cart';
import TapTop from './TapTop';
import ExitModal from './ExitModal';

const SubLayout = ({ children }) => {
  const isTabActive = TabFocusChecker();
  const { themeOption } = useContext(ThemeOptionContext);
  useEffect(() => {
    const message = ['PickPack'];
    let timer;

    const updateTitle = (index) => {
      document.title = message[index];
      timer = setTimeout(() => {
        const nextIndex = (index + 1) % message.length;
        updateTitle(nextIndex);
      }, 500);
    };

    if (!isTabActive) {
      updateTitle(0);
    } else {
      let value =
        themeOption?.general?.site_title && themeOption?.general?.site_tagline
          ? `${themeOption?.general?.site_title} | ${themeOption?.general?.site_tagline}`
          : 'PickPack';
      document.title = value;
      clearTimeout(timer);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isTabActive, themeOption]);
  return (
    <>
      <MainHeader />
      <MobileMenu />
      {children}
      <TapTop />
      <MainFooter />
      <CookiesComponent />
      {/* <StickyCompare /> */}
      <RecentPurchase />
      <NewsLetterModal />
      <ExitModal />
    </>
  );
};

export default SubLayout;
