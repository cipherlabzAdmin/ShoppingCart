import I18NextContext from '@/Helper/I18NextContext';
import { useTranslation } from '@/app/i18n/client';
import { useContext } from 'react';
import { RiCloseLine } from 'react-icons/ri';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';

const CustomModal = ({ classes = {},extraFunction, modal, setModal, ...props }) => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, 'common');
  const toggle = () =>  extraFunction ?extraFunction() :setModal((prev) => prev !== prev);
  const selectedWarehouse = JSON.parse(localStorage.getItem('selectedWarehouse'));
  return (
    <Modal className={classes?.modalClass || ''} isOpen={selectedWarehouse ? modal : true} centered>
      {classes?.customChildren ? (
        props.children
      ) : (
        <> {selectedWarehouse &&
          <ModalHeader className={classes?.modalHeaderClass || ''} toggle={toggle}>
            {classes?.title && t(classes?.title)}
           <RiCloseLine className='modal-close-btn' />
          </ModalHeader>}
          <ModalBody className={classes?.modalBodyClass || ''}>{props.children}</ModalBody>
        </>
      )}
    </Modal>
  );
};

export default CustomModal;
