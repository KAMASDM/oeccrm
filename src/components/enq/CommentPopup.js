import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import UiModal from "../UI/UiModal";
import AddComment from "./AddComment";
import LoadingData from "../UI/LoadingData";
import CommentSnippet from "./CommentSnippet";
import { ajaxCallWithHeaderOnly } from "../../helpers/ajaxCall";

const CommentPopup = ({ id, title, onHide }) => {
  const [modalStatus, setModalStatus] = useState({
    showModal: true,
    showHeader: true,
    headerContent: `Comments for ${title}`,
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

  const getComments =  useCallback(async () => {
    const response = await ajaxCallWithHeaderOnly(
      `app/getcomment/?ordering=posted&object_id=${id}`,
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
        headerContent: `Comments for ${title}`,
        bodyContent: (
          <>
            <h4 className="text-center">No Comments Found</h4>
            <AddComment
              enqId={id}
              refresh={() =>
                setModalStatus({
                  showModal: true,
                  showHeader: true,
                  headerContent: `Comments for ${title}`,
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
                  enqId={id}
                  parentId={parentComment.id}
                  refresh={() =>
                    setModalStatus({
                      showModal: true,
                      showHeader: true,
                      headerContent: `Comments for ${title}`,
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
            enqId={id}
            refresh={() =>
              setModalStatus({
                showModal: true,
                showHeader: true,
                headerContent: `Comments for ${title}`,
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
        headerContent: `Comments for ${title}`,
        bodyContent,
        showFooter: true,
        footerContent: null,
        reset: 0,
      });
    }
    return response;
  },[authData.accessToken, id, title]);
  
  useEffect(() => {
    try {
      getComments();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [getComments]);

  useEffect(() => {
    try {
      if (modalStatus.reset) getComments();
    } catch (e) {
      setThrowErr({ e, page: "enquiries" });
      return;
    }
  }, [getComments, modalStatus.reset]);

  return (
    <UiModal
      setModalStatus={onHide}
      showStatus={modalStatus.showModal}
      showHeader={modalStatus.showHeader}
      title={modalStatus.headerContent}
      body={modalStatus.bodyContent}
      showFooter={modalStatus.showFooter}
      footerContent={modalStatus.footerContent}
    />
  );
};

export default CommentPopup;
