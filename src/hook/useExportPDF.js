import React, { useState, useEffect } from "react";
import { PDFDocument } from "pdf-lib";

import jsPDF from "jspdf";
import "jspdf-autotable";
import { renderToString } from "react-dom/server";
import { uiAction } from "../store/uiStore";
import { useDispatch } from "react-redux";

const shouldInclude = (check, text) => {
  if (check) return text + "\n";
  return "";
};
const generateTablePDF = async (data) => {
  const doc = new jsPDF();
  const tableData = [
    ["Student Name", data?.student_info?.name?.student_name],
    ["Student Phone", data?.student_info?.name?.student_phone],
    ["Student Email", data?.student_info?.name?.student_email],
    ["Current Education", data?.student_info?.name?.current_education],
    ["Student Address", data?.student_info?.name?.student_address],
    ["Country Interested", data?.student_info?.name?.country_interested],
    ["University Interested", data.university_interested?.univ_name],
    ["Level applying for", data.level_applying_for?.levels],
    ["Course Interested", data.course_interested?.course_name],
    [
      "Intake Interested",
      data.intake_interested?.intake_month +
        " " +
        data.intake_interested?.intake_year,
    ],
    ["Assigned User", data.assigned_users?.username],
  ];

  const startY = 70; // Adjust the vertical position of the table

  const tableOptions = {
    startY,
    margin: { horizontal: 10 },
  };

  doc.autoTable({
    head: [["Student Info", "Details"]],
    body: tableData,
    ...tableOptions,
  });
  let text = "Below are the documents included in Application\n\n";
  text += shouldInclude(data.Tenth_Marksheet, "10th Marksheet");
  text += shouldInclude(data.Twelveth_Marksheet, "12th Marksheet");
  text += shouldInclude(data.Diploma_Marksheet, "Diploma Marksheet");
  text += shouldInclude(data.Bachelor_Marksheet, "Bachelor Marksheet");
  text += shouldInclude(data.Master_Marksheet, "Master Marksheet");
  text += shouldInclude(data.Language_Exam, "Language Exam");
  text += shouldInclude(data.Resume, "Resume");
  text += shouldInclude(data.Sop, "Sop");
  text += shouldInclude(data.Lor, "Lor");
  text += shouldInclude(data.passport, "passport");
  text += shouldInclude(data.rcvd_offer_letter, "Offer Letter");
  const textX = doc.internal.pageSize.width / 2; // Center the text horizontally
  const textY = doc.autoTable.previous.finalY + 20; // Adjust the vertical position of the text
  doc.text(text, textX, textY, { align: "center" });
  return doc.output("arraybuffer");
};
const fetchPdf = async (url) => {
  const response = await fetch(url);
  const pdfData = await response.arrayBuffer();
  return pdfData;
};
const createPdfFromImage = async (imageUrl) => {
  const existingPdfBytes = await fetchPdf(imageUrl); // Fetch the image data (implement fetchPdf function accordingly)

  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();

  const jpgImage = await pdfDoc.embedJpg(existingPdfBytes); // Embed the image data as a JPG image

  const { width, height } = jpgImage.scale(1); // Get the original dimensions of the image

  const pageWidth = page.getSize().width;
  const pageHeight = page.getSize().height;

  // Calculate the scaling factor to fit the image within the A4 page
  const scaleX = pageWidth / width;
  const scaleY = pageHeight / height;
  const scale = Math.min(scaleX, scaleY);

  const scaledWidth = width * scale;
  const scaledHeight = height * scale;

  page.drawImage(jpgImage, {
    x: (pageWidth - scaledWidth) / 2, // Center the image horizontally
    y: (pageHeight - scaledHeight) / 2, // Center the image vertically
    width: scaledWidth,
    height: scaledHeight,
  });

  const pdfBytes = await pdfDoc.save(); // Save the PDF document as bytes

  return pdfBytes;
};
const useExportPDF = () => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState("");
  const [shouldMerge, setShouldMerge] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const generatePdfFromHtml = async (htmlContent) => {
    const tablePdfBytes = await generateTablePDF(data);

    let pdfUrls = [
      tablePdfBytes,
      data.Tenth_Marksheet,
      data.Twelveth_Marksheet,
      data.Diploma_Marksheet,
      data.Bachelor_Marksheet,
      data.Master_Marksheet,
      data.Language_Exam,
      data.Resume,
      data.Sop,
      data.Lor,
      data.passport,
      data.rcvd_offer_letter,
    ];
    pdfUrls = pdfUrls.filter((pdf) => {
      if (pdf) return true;
      else return false;
    });
    const mergedPdf = await PDFDocument.create();

    for (const [index, pdfUrl] of pdfUrls.entries()) {
      let pdfData, pdfDoc;
      if (index === 0) {
        pdfDoc = await PDFDocument.load(pdfUrl);
      } else if (pdfUrl.endsWith(".pdf")) {
        pdfData = await fetchPdf(pdfUrl);
        pdfDoc = await PDFDocument.load(pdfData);
      } else if (
        pdfUrl.endsWith(".jpg") ||
        pdfUrl.endsWith(".jpeg") ||
        pdfUrl.endsWith(".png")
      ) {
        const imagePdf = await createPdfFromImage(pdfUrl);
        pdfDoc = await PDFDocument.load(imagePdf);
      }
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const pdfUrl = URL.createObjectURL(
      new Blob([mergedPdfBytes], { type: "application/pdf" })
    );

    return pdfUrl;
  };

  useEffect(() => {
    try {
      if (shouldMerge && data) {
        const htmlContent = (
          <table className="table table-striped">
          </table>
        );

        generatePdfFromHtml(renderToString(htmlContent))
          .then((pdfUrl) => {
            setMergedPdfUrl(pdfUrl);
            setShouldMerge(false);
            setData(null);
          })
          .catch((error) => {
            dispatch(
              uiAction.setNotification({
                show: true,
                heading: `Export PDF`,
                msg: `Some Problem Occured while generating PDF, Please try again, If this problem persist contact developer`,
              })
            );
            setShouldMerge(false);
            setData(null);
          });
      }
    } catch {
      dispatch(
        uiAction.setNotification({
          show: true,
          heading: `Export PDF`,
          msg: `Can't export more then 1 pdf at a same time, Please wait...`,
        })
      );
      setShouldMerge(false);
      setData(null);
    }
  }, [shouldMerge, data]);

  return [
    shouldMerge,
    setShouldMerge,
    mergedPdfUrl,
    setData,
    setMergedPdfUrl,
    data,
  ];
};

export default useExportPDF;
