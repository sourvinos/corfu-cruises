using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;

namespace API.Features.Invoicing.Printer {

    [Route("api/[controller]")]

    public class InvoicingPrinterController : Controller {

        #region variables

        private readonly ICompositeViewEngine compositeViewEngine;
        private readonly IInvoicingPrinterRepository repo;

        public InvoicingPrinterController(ICompositeViewEngine compositeViewEngine, IInvoicingPrinterRepository repo) {
            this.compositeViewEngine = compositeViewEngine;
            this.repo = repo;
        }

        #endregion

        [HttpPost("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<Response> CreateReport([FromBody] InvoicingPrinterCriteria criteria, InvoicingPrinterVM report) {

            var viewResult = compositeViewEngine.FindView(ControllerContext, "InvoicingReport", false);
            var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = report };
            var viewContext = new ViewContext(ControllerContext, viewResult.View, viewDictionary, TempData, new StringWriter(), new HtmlHelperOptions());
            var result = repo.Get(criteria);

            return await repo.CreatePDF(viewResult, viewContext, result);

        }

        [HttpGet("[action]/{filename}")]
        [Authorize(Roles = "admin")]
        public IActionResult OpenReport([FromRoute] string filename) {
            return repo.OpenReport(filename);
        }

    }

}