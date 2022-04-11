using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
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
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> CreateReport([FromBody] EmbarkationPrinterCriteria criteria) {
            return await CreatePDF(repo.DoReportTasks(criteria));
        }

        [HttpGet("[action]/{filename}")]
        [Authorize(Roles = "admin")]
        public IActionResult OpenReport([FromRoute] string filename) {
            return repo.OpenReport(filename);
        }

        private async Task<IActionResult> CreatePDF(EmbarkationPrinterGroupVM<EmbarkationPrinterVM> report) {
            using var stringWriter = new StringWriter();
            var viewResult = compositeViewEngine.FindView(ControllerContext, "EmbarkationReport", false);
            var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = report };
            var viewContext = new ViewContext(ControllerContext, viewResult.View, viewDictionary, TempData, stringWriter, new HtmlHelperOptions());
            var htmlToPdf = new HtmlToPdf();
            htmlToPdf.Options.PdfPageSize = PdfPageSize.A4;
            htmlToPdf.Options.PdfPageOrientation = PdfPageOrientation.Portrait;
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
            var filename = Guid.NewGuid().ToString("N");
            using var streamWriter = new StreamWriter("Reports\\" + filename + ".pdf");
            await streamWriter.BaseStream.WriteAsync(pdfBytes.AsMemory(0, pdfBytes.Length));
            pdf.Close();
            return StatusCode(200, new {
                response = filename
            });
        }

    }

}