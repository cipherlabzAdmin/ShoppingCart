import { useState } from 'react';
import { RiEyeLine } from 'react-icons/ri';
import VariationModal from './ProductBox1/VariationModal';

const QuickView = ({ productObj }) => {
  const [variationModal, setVariationModal] = useState('');

  const handleVariationModal = () => {
      setVariationModal(productObj.id);
  }

  return (
    <>
      <li title='View' onClick={() => handleVariationModal()}>
        <a>
          <RiEyeLine />
        </a>
      </li>
      <VariationModal setVariationModal={setVariationModal} variationModal={variationModal} productObj={productObj} />
    </>
  );
};

export default QuickView;
