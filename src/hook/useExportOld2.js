import { useState, useEffect } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";

const fetchPdf = async (url) => {
  const response = await fetch(url);
  const pdfData = await response.arrayBuffer();
  return pdfData;
};
const useExportPDF = () => {
  const [mergedPdfUrl, setMergedPdfUrl] = useState("");
  const [shouldMerge, setShouldMerge] = useState(false);
  const [data, setData] = useState(null);

  const mergePDFs = async () => {
    const mergedPdf = await PDFDocument.create();
    // Generate PDF from HTML
    const htmlContent = `<table class="table table-striped"><thead>
          <tr>
            <th scope="col">Student Info</th>
            <th scope="col">Details</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Student Nname</td>
            <td>vvv</td>
          </tr>
          <tr>
            <td>Student Phone </td>
            <td>9638544455</td>
          </tr>

          <tr>
            <td>Student Email</td>
            <td>xyz@gmail.com</td>
          </tr>
          <tr>
            <td>Current Education</td>
            <td>Bcom</td>
          </tr>
          <tr>
            <td>Student Address</td>
            <td>xyqq</td>
          </tr>
          <tr>
            <td>Country Interested</td>
            <td>UK</td>
          </tr>
          <tr>
            <td>University Interested</td>
            <td>University Of East London</td>
          </tr>
          <tr>
            <td>Level applying for</td>
            <td>Post-Graduate</td>
          </tr>
          <tr>
            <td>Course Interested</td>
            <td>MSC ELECTRIC VEHICLE ENGINEERING</td>
          </tr>

          <tr>
            <td>Intake Interested</td>
            <td>JAN-FEB-2024</td>
          </tr>
          <tr>
            <td>Assigned Uuser</td>
            <td>Agent123</td>
          </tr>
        </tbody>
      </table>`;
    const htmlPdf = await PDFDocument.create();
    const htmlPage = htmlPdf.addPage();
    const htmlText = await htmlPdf.embedFont(StandardFonts.Helvetica);
    htmlPage.drawText(htmlContent, { x: 50, y: 50, font: htmlText, size: 12 });
    const htmlPdfBytes = await htmlPdf.save();
    const htmlPdfDoc = await PDFDocument.load(htmlPdfBytes);
    const htmlPages = await mergedPdf.copyPages(
      htmlPdfDoc,
      htmlPdfDoc.getPageIndices()
    );
    htmlPages.forEach((page) => mergedPdf.addPage(page));

    // Merge other PDF files from URLs
    let pdfUrls = [
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

    pdfUrls = pdfUrls.filter((pdf) => pdf); // Filter out empty URLs

    for (const pdfUrl of pdfUrls) {
      const pdfData = await fetchPdf(pdfUrl);
      const pdfDoc = await PDFDocument.load(pdfData);
      const copiedPages = await mergedPdf.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    // Set author metadata (optional)
    mergedPdf.setAuthor("Your Name");

    // Set title metadata (optional)
    mergedPdf.setTitle("Merged PDF");

    // Get the merged PDF as a Blob object
    const mergedPdfBytes = await mergedPdf.save();
    const url = URL.createObjectURL(
      new Blob([mergedPdfBytes], { type: "application/pdf" })
    );

    setShouldMerge(false);
    setMergedPdfUrl(url);
  };

  useEffect(() => {
    if (shouldMerge && data) {
      mergePDFs();
    }
  }, [shouldMerge, data]);

  return [shouldMerge, setShouldMerge, mergedPdfUrl, setData, setMergedPdfUrl];
};

export default useExportPDF;
