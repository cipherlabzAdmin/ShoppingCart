import paris from '../public/assets/images/themes/01.jpg';
import tokyo from '../public/assets/images/themes/02.jpg';
import osaka from '../public/assets/images/themes/03.jpg';
import rome from '../public/assets/images/themes/04.jpg';
import madrid from '../public/assets/images/themes/05.jpg';
import berlin from '../public/assets/images/themes/06.jpg';
import denver from '../public/assets/images/themes/07.jpg';
import commingSoon from '../public/assets/images/themes/08.jpg';

export const headerMenu = [
  {
    id: 1,
    title: 'Home',
    styleType: 'image',
    path: '/theme/paris'
   
  },
  {
    id: 2,
    title: 'Offers',
    styleType: 'link',
    slider: 'product',
    path: '/offer'
   
  },
  {
    id: 3,
    title: 'About Us',
    styleType: 'link',
    slider: 'banner',
    path: '/about-us',
   
  },
  {
    id: 4,
    title: 'Contact Us',
    styleType: 'link',
   path: '/contact-us',
  },
 
  {
    id: 5,
    title: 'Complain',
    path: '/complain',
  },
];
