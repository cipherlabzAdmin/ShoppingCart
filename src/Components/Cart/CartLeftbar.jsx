import { useContext } from "react";
import { Col } from "reactstrap";
import Btn from "@/Elements/Buttons/Btn";
import CartContext from "@/Helper/CartContext";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import Link from "next/link";
import Cookies from "js-cookie";
import Image from 'next/image';
import { RiArrowLeftLine } from "react-icons/ri";
import { RiShoppingCart2Fill } from "react-icons/ri";
import Standard from "../../../public/assets/DeliveryOptions/Standard.png";
import Express from "../../../public/assets/DeliveryOptions/Express.png";
import Bullet from "../../../public/assets/DeliveryOptions/Bullet.png";
import Flash from "../../../public/assets/DeliveryOptions/Flash.png";
import DriveThrough from "../../../public/assets/DeliveryOptions/DriveThrough.png";
import ChoosePick from "../../../public/assets/DeliveryOptions/ChoosePick.png";

const CartLeftbar = () => {
  const { cartProducts, getTotal } = useContext(CartContext);
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const isAuth = Cookies.get("uat");
  return (
    <Col xxl={3} xl={4}>
      <div
        className="summery-box p-sticky"
        style={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px" }}
      >
        <div
          style={{
            background: "var(--theme-color)",
            color: "white",
          }}
          className="summery-header"
        >
          <h3>{t("Delivery Method")}</h3>
        </div>

        <div className="summery-contain">
          <div class="radio-list">
            <div class="radio-item" style={{display: 'flex', gap: '20%'}}>
              
              <Image src={Standard} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>Standard</h6>
                <p>Day After Day Ordered</p>
              </div>
              {/* <input type="radio" id="option1" name="options" value="option1" /> */}
            </div>
            <hr/>
            <div class="radio-item" style={{display: 'flex',  gap: '20%'}}>
            <Image src={Express} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>Express</h6>
                <p>Within the Day Ordered</p>
              </div>
              {/* <input type="radio" id="option1" name="options" value="option1" /> */}
            </div>
            <hr/>
            <div class="radio-item" style={{display: 'flex',  gap: '20%'}}>
            <Image src={Bullet} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>bullet</h6>
                <p>Within 8 Hours</p>
              </div>
              {/* <input type="radio" id="option1" name="options" value="option1" /> */}
            </div>
            <hr/>
            <div class="radio-item" style={{display: 'flex',  gap: '20%'}}>
            <Image src={Flash} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>flash</h6>
                <p>Within 4 Hours</p>
              </div>
              {/* <input type="radio" id="option1" name="options" value="option1" /> */}
            </div>
            <hr/>
            <div class="radio-item" style={{display: 'flex',  gap: '20%'}}>
            <Image src={DriveThrough} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>drive through</h6>
                <p></p>
              </div>
              {/* <input type="radio" id="option1" name="options" value="option1" /> */}
            </div>
            <hr/>
            <div class="radio-item" style={{display: 'flex',  gap: '20%'}}>
            <Image src={ChoosePick} className='img-fluid' alt='error page' height={50} width={50} />
              <div>
                <h6 style={{fontWeight: 'bold',textTransform: 'uppercase'}}>choose & pick</h6>
                <p></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default CartLeftbar;
