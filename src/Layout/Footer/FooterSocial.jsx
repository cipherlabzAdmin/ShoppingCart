import React, { useContext } from 'react';
import ThemeOptionContext from '@/Helper/ThemeOptionsContext';
import Link from 'next/link';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import { RiFacebookFill, RiInstagramLine, RiPinterestLine, RiTwitterFill } from 'react-icons/ri';
import { FaLinkedin } from "react-icons/fa";

const FooterSocial = () => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const isFooterSocial = themeOption?.footer?.social_media_enable || themeOption?.footer?.facebook || themeOption?.footer?.twitter || themeOption?.footer?.instagram || themeOption?.footer?.pinterest;
  return (
    <>
      {isFooterSocial ? (
        <div className='social-link'>
          <h6 className='text-content'>{t('Stayconnected')} :</h6>
          <ul>
            {themeOption?.footer?.facebook && (
              <li>
                <Link href='https://www.facebook.com/SmartPickPack/' target='_blank'>
                  <RiFacebookFill />
                </Link>
              </li>
            )}
            {themeOption?.footer?.pinterest && (
              <li>
                <Link href='https://www.linkedin.com/in/smart-pickpack-b68657231/?originalSubdomain=lk' target='_blank'>
                  <FaLinkedin />
                </Link>
              </li>
            )}
            {/* {themeOption?.footer?.twitter && (
              <li>
                <Link href={themeOption?.footer?.twitter} target='_blank'>
                  <RiTwitterFill />
                </Link>
              </li>
            )} 
            {themeOption?.footer?.instagram && (
              <li>
                <Link href={themeOption?.footer?.instagram} target='_blank'>
                  <RiInstagramLine />
                </Link>
              </li>
            )}
              */}
            
          </ul>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default FooterSocial;
