using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelectPdf;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CorfuCruises {

    [Route("api/[controller]")]

    public class CreateVoucherController : Controller {

        protected readonly ICompositeViewEngine compositeViewEngine;

        public CreateVoucherController(ICompositeViewEngine compositeViewEngine) {
            this.compositeViewEngine = compositeViewEngine;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> CreateVoucher([FromBody] Voucher voucher) {

            using (var stringWriter = new StringWriter()) {

                var viewResult = compositeViewEngine.FindView(ControllerContext, "Voucher", false);
                var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary());
                var viewContext = new ViewContext(ControllerContext, viewResult.View, viewDictionary, TempData, stringWriter, new HtmlHelperOptions());
                var htmlToPdf = new HtmlToPdf(1000, 1414);

                viewContext.ViewData["Message"] = "Your application description page.";
                viewContext.ViewData["uri"] = voucher.URI;

                await viewResult.View.RenderAsync(viewContext);


                var pdf = htmlToPdf.ConvertHtmlString(stringWriter.ToString());
                var pdfBytes = pdf.Save();

                using (var streamWriter = new StreamWriter(@"Voucher.pdf")) {
                    await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);
                }

                return StatusCode(200);

            }

        }

    }

}
