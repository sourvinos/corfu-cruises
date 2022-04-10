using System;
using System.IO;
using API.Features.Vouchers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelectPdf;

namespace API.Features.Embarkation.Printer {

    [Route("api/[controller]")]

    public class EmbarkationPrinterController : Controller {

        #region variables

        private readonly ICompositeViewEngine compositeViewEngine;
        private readonly IEmbarkationPrinterRepository repo;

        public EmbarkationPrinterController(ICompositeViewEngine compositeViewEngine, IEmbarkationPrinterRepository repo) {
            this.compositeViewEngine = compositeViewEngine;
            this.repo = repo;
        }

        #endregion

        [HttpPost("[action]")]
        public void CreateReport([FromBody] EmbarkationPrinterCriteria criteria) {
            CreatePDF(repo.DoReportTasks(criteria));
        }

        [HttpGet("[action]/{filename}")]
        public IActionResult DownloadReport([FromRoute] string filename) {
            return repo.DownloadReport(filename);
        }

        private async void CreatePDF(EmbarkationPrinterGroupVM<EmbarkationPrinterVM> report) {
            using var stringWriter = new StringWriter();
            // report.Logo = Logo.GetLogo();
            var viewResult = compositeViewEngine.FindView(ControllerContext, "EmbarkationReport", false);
            var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = report };
            var viewContext = new ViewContext(ControllerContext, viewResult.View, viewDictionary, TempData, stringWriter, new HtmlHelperOptions());
            var htmlToPdf = new HtmlToPdf();
            htmlToPdf.Options.PdfPageSize = PdfPageSize.A4;
            htmlToPdf.Options.PdfPageOrientation = PdfPageOrientation.Landscape;
            htmlToPdf.Options.MarginLeft = 10;
            htmlToPdf.Options.MarginRight = 10;
            htmlToPdf.Options.MarginTop = 20;
            htmlToPdf.Options.MarginBottom = 20;
            await viewResult.View.RenderAsync(viewContext);
            var pdf = htmlToPdf.ConvertHtmlString(stringWriter.ToString());
            var pdfBytes = pdf.Save();
            if (!Directory.Exists("Reports")) {
                Directory.CreateDirectory("Reports");
            }
            using var streamWriter = new StreamWriter("Reports\\Report.pdf");
            await streamWriter.BaseStream.WriteAsync(pdfBytes.AsMemory(0, pdfBytes.Length));
        }

    }

}