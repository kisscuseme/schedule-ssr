"use client";

import { l } from "@/services/util/util";
import { showModalState } from "@/states/states";
import { Modal } from "react-bootstrap";
import { useSetRecoilState } from "recoil";
import { ModalProps } from "react-bootstrap";
import { styled } from "styled-components";
import { CustomButton } from "../atoms/CustomButton";

interface AlertOwnProps {
  /**
   * title
   */
  title?: React.ReactNode;
  /**
   * content
   */
  content?: React.ReactNode;
  /**
   * callback
   */
  callback?: () => void;
  /**
   * confirm
   */
  confirm?: () => void;
};

export type AlertProps = AlertOwnProps & ModalProps;

const CustomModal = styled(Modal)`
  font-family: 'GangwonEdu_OTFBoldA', 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;


export const Alert = ({
  show,
  title,
  content,
  callback,
  confirm,
  ...props
}: AlertProps) => {
  const setShowModal = useSetRecoilState(showModalState);
  if(!show) {
    title = "";
    content = "";
    callback = undefined;
    confirm = undefined;
  }
  return (
    <CustomModal
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" style={{margin: "auto"}}>
          {title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {content}
      </Modal.Body>
      <Modal.Footer>
        {confirm && <CustomButton
          onClick={() => {
            setShowModal({
              title: "",
              content: "",
              callback: undefined,
              confirm: undefined,
              show: false
            });
            if(confirm) confirm();            
          }}
          backgroundColor="#8e8e8e"
          color="#ffffff"
        >
          {l("Confirm")}
        </CustomButton>}
        <CustomButton
          onClick={() => {
            setShowModal({
              title: "",
              content: "",
              callback: undefined,
              confirm: undefined,
              show: false
            });
            if(callback) callback();
          }}
        >
          {l("Close")}
        </CustomButton>
      </Modal.Footer>
    </CustomModal>
  );
}