import api from "../services/api";

interface Props{
  reportId:string;
}

export default function ExportReportButton({
  reportId,
}:Props){

  async function downloadPDF(){
    const response=
      await api.get(
        `/reports/${reportId}/pdf`,
        {
          responseType:"blob",
        }
      );

    const url=
      URL.createObjectURL(
        response.data
      );

    const link=
      document.createElement("a");

    link.href=url;
    link.download="report.pdf";
    link.click();

    URL.revokeObjectURL(url);
  }

  async function downloadCSV(){
    const response=
      await api.get(
        `/reports/${reportId}/csv`,
        {
          responseType:"blob",
        }
      );

    const url=
      URL.createObjectURL(
        response.data
      );

    const link=
      document.createElement("a");

    link.href=url;
    link.download="report.csv";
    link.click();

    URL.revokeObjectURL(url);
  }

  return(
    <div className="mt-5 flex gap-3">
      <button
        onClick={downloadPDF}
        className="rounded bg-red-600 px-4 py-2 text-white"
      >
        Export PDF
      </button>

      <button
        onClick={downloadCSV}
        className="rounded bg-green-600 px-4 py-2 text-white"
      >
        Export CSV
      </button>
    </div>
  );
}
