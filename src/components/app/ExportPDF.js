import React, { useEffect } from "react";
import useExportPDF from "../../hook/useExportPDF";
import { uiAction } from "../../store/uiStore";
import { useDispatch } from "react-redux";
import pdfImg from "../../assets/img/pdfIcon.png";
function ExportPDF(props) {
  const [
    isPDFGenerating,
    startPDFGenerating,
    generatedPdfUrl,
    setPDFData,
    setGeneratedPdfUrl,
  ] = useExportPDF();
  const dispatch = useDispatch();

  // for generated pdf
  useEffect(() => {
    if (generatedPdfUrl) {
      try {
        window.open(generatedPdfUrl, "_blank").focus();
        setGeneratedPdfUrl("");
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: `Export PDF`,
            msg: `PDF Exported`,
          })
        );
      } catch {
        dispatch(
          uiAction.setNotification({
            show: true,
            heading: `Export PDF`,
            msg: `Some Problem occured while exporting pdf please try again.`,
          })
        );
        setGeneratedPdfUrl("");
      }
    }
  }, [generatedPdfUrl]);
  const generatePdf = function () {
    if (!isPDFGenerating) {
      startPDFGenerating(true);
      setPDFData(props.data);
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: `Export PDF`,
          msg: `Exporting PDF for ${props.data.name}...`,
        })
      );
    } else {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: `Export PDF`,
          msg: `Generating PDF, Please Wait`,
        })
      );
    }
  };
  return (
    <img
      onClick={generatePdf}
      className="pointer exportPDFIcon"
      src={pdfImg}
      alt="Export PDF"
    />
  );
}

export default ExportPDF;
