import { useContext } from 'react';
import { Col } from 'reactstrap';
import Link from 'next/link';
import ThemeOptionContext from '@/Helper/ThemeOptionsContext';
import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import CategoryContext from '@/Helper/CategoryContext';

const FooterCategory = ({ footerMenu, setFooterMenu }) => {
  const { themeOption } = useContext(ThemeOptionContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const { category , filterCategory} = useContext(CategoryContext);
  const categoryData = filterCategory('product');
  return (
    <Col xl={2} lg={3} md={4} sm={6}>
      <div className={`footer-title ${footerMenu == 'category' ? 'show' : ''}`} onClick={() => setFooterMenu((prev) => (prev !== 'category' ? 'category' : ''))}>
        <h4>{t('Categories')}</h4>
      </div>

      <div className='footer-contain'>
        <ul>
          {category.map((result, i) => (
              <li key={i}>
                <Link style={{color: 'var(--theme-color)'}} href={`/${i18Lang}/collections?category=${result?.name}`} className='text-content'>
                  {result?.name}
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </Col>
  );
};

export default FooterCategory;
