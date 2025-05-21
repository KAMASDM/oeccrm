import React, { useEffect, useState } from "react";
import UiModal from "../UI/UiModal";
import LoadingData from "../UI/LoadingData";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";
import { useSelector } from "react-redux";
import CommentSnippet from "./CommentSnippet";
import AddComment from "./AddComment";

function CommentPopup(props) {
  const [modalStatus, setModalStatus] = useState({
    showModal: true,
    showHeader: true,
    headerContent: `Comments for ${props.title}`,
    bodyContent: <LoadingData />,
    showFooter: true,
    footerContent: null,
    reset: 0,
  });
  const [throwErr, setThrowErr] = useState(null);
  const authData = useSelector((state) => state.authStore);

  useEffect(() => {
    if (throwErr) throw throwErr;
  }, [throwErr]);

  const getComments = async () => {
    const response = await ajaxCallWithHeaderOnly(
      `app/getcomment/?ordering=posted&object_id=${props.id}`,
      {
        Authorization: `Bearer ${authData.accessToken}`,
      },
      "GET",
      null
    );
    if (response?.isNetwork) {
      setThrowErr({ ...response, page: "enqForm", status: response?.status });
      return;
    }
    if (response?.status && response?.status !== 200) {
      setThrowErr({ ...response, page: "enqForm" });
      return;
    }
    if (!response?.length) {
      setModalStatus({
        showModal: true,
        showHeader: true,
        headerContent: `Comments for ${props.title}`,
        bodyContent: (
          <>
            <h4 className="text-center">No Comments Found</h4>
            <AddComment
              enqId={props.id}
              refresh={() =>
                setModalStatus({
                  showModal: true,
                  showHeader: true,
                  headerContent: `Comments for ${props.title}`,
                  bodyContent: <LoadingData />,
                  showFooter: true,
                  footerContent: null,
                  reset: 1,
                })
              }
            />
          </>
        ),
        showFooter: true,
        footerContent: null,
        reset: 0,
      });
    } else {
      const transformedComment = [];
      for (let i = 0; i < response.length; i++) {
        const parentComment = response[i];
        parentComment.childs = [];
        if (parentComment.parent != null) {
          continue;
        }
        for (let j = i + 1; j < response.length; j++) {
          const childComment = response[j];
          if (
            childComment.parent === null ||
            childComment.parent !== parentComment.id
          )
            continue;
          parentComment.childs.unshift(childComment);
        }

        transformedComment.unshift(parentComment);
      }
      const bodyContent = (
        <>
          <ul className="parentComment">
            {transformedComment.map((parentComment) => {
              return (
                <CommentSnippet
                  parentComment={parentComment}
                  enqId={props.id}
                  parentId={parentComment.id}
                  refresh={() =>
                    setModalStatus({
                      showModal: true,
                      showHeader: true,
                      headerContent: `Comments for ${props.title}`,
                      bodyContent: <LoadingData />,
                      showFooter: true,
                      footerContent: null,
                      reset: 1,
                    })
                  }
                />
              );
            })}
          </ul>
          <AddComment
            enqId={props.id}
            refresh={() =>
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: `Comments for ${props.title}`,
                bodyContent: <LoadingData />,
                showFooter: true,
                footerContent: null,
                reset: 1,
              })
            }
          />
        </>
      );
      setModalStatus({
        showModal: true,
        showHeader: true,
        headerContent: `Comments for ${props.title}`,
        bodyContent,
        showFooter: true,
        footerContent: null,
        reset: 0,
      });
    }
    return response;
  };
  useEffect(() => {
    try {
      getComments();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, []);

  useEffect(() => {
    try {
      if (modalStatus.reset) getComments();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [modalStatus.reset]);

  return (
    <UiModal
      setModalStatus={props.onHide}
      showStatus={modalStatus.showModal}
      showHeader={modalStatus.showHeader}
      title={modalStatus.headerContent}
      body={modalStatus.bodyContent}
      showFooter={modalStatus.showFooter}
      footerContent={modalStatus.footerContent}
    />
  );
}

export default CommentPopup;
