"use client";
import { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Col } from "reactstrap";
import WrapperComponent from "@/Components/Common/WrapperComponent";
import AuthHeadings from "../Common/AuthHeadings";
import loginImage from "../../../../public/assets/images/inner-page/log-in.jpg";
import I18NextContext from "@/Helper/I18NextContext";
import { useTranslation } from "@/app/i18n/client";
import LoginForm from "./LoginForm";
import Breadcrumb from "@/Components/Common/Breadcrumb";
import RadioField from "@/Components/Common/InputFields/RadioField";
import { Button, ButtonGroup } from "reactstrap";
import Btn from "@/Elements/Buttons/Btn";

const LoginContent = () => {
  const { i18Lang } = useContext(I18NextContext);
  const { t } = useTranslation(i18Lang, "common");
  const [rSelected, setRSelected] = useState(1);

  useEffect(() => {
    //console.log(rSelected);
  }, [rSelected]);

  return (
    <>
      <Breadcrumb title={"Login"} subNavigation={[{ name: "Login" }]} />
      <WrapperComponent
        classes={{
          sectionClass: "log-in-section background-image-2 section-b-space",
          fluidClass: "w-100",
        }}
        customCol={true}
      >
        <Col xxl={6} xl={5} lg={6} className="d-lg-block d-none ms-auto">
          <div className="image-contain">
            <Image
              src={loginImage}
              className="img-fluid"
              alt="loginImage"
              height={465}
              width={550}
            />
          </div>
        </Col>

        <Col xxl={4} xl={5} lg={6} sm={8} className="mx-auto">
          <div className="log-in-box">
            <AuthHeadings
              heading1={"WelcomeToFastkart"}
              heading2={"LogInYourAccount"}
            />

            <div className="log-in-title">
              <ButtonGroup className="d-flex">
                <Btn
                  className={`btn-md fw-bold w-100 ${
                    rSelected === 1
                      ? "theme-bg-color text-white"
                      : "btn-theme-outline"
                  }`}
                  onClick={() => setRSelected(1)}
                  active={rSelected === 1}
                >
                  {t("Use Email")}
                </Btn>
                <Btn
                  className={`btn-md fw-bold w-100 ${
                    rSelected === 2
                      ? "theme-bg-color text-white"
                      : "btn-theme-outline"
                  }`}
                  outline
                  onClick={() => setRSelected(2)}
                  active={rSelected === 2}
                >
                  {t("Use Tel No")}
                </Btn>
              </ButtonGroup>
            </div>

            <div className="input-box">
              <LoginForm rSelected={rSelected} />
            </div>

            <div className="other-log-in">
              <h6>{t("or")}</h6>
            </div>

            <div className="sign-up-box">
              <h4>{t("Don'thaveanaccount")}?</h4>
              <Link href={`/${i18Lang}/auth/register`}>{t("SignUp")}</Link>
            </div>
          </div>
        </Col>
      </WrapperComponent>
    </>
  );
};

export default LoginContent;
