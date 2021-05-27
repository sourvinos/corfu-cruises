using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;
using SelectPdf;
using System;
using System.IO;
using System.Threading.Tasks;

namespace CorfuCruises {

    [Route("api/[controller]")]

    public class VoucherController : Controller {

        private readonly ILogger<VoucherController> logger;
        protected readonly ICompositeViewEngine compositeViewEngine;

        public VoucherController(ILogger<VoucherController> logger, ICompositeViewEngine compositeViewEngine) {
            this.logger = logger;
            this.compositeViewEngine = compositeViewEngine;
        }

        [HttpPost("[action]")]
        public async Task<IActionResult> Create([FromBody] Voucher voucher) {

            using (var stringWriter = new StringWriter()) {

                voucher.Logo = Logo.GetLogo();
                voucher.Facebook = Facebook.GetLogo();
                voucher.YouTube = YouTube.GetLogo();
                voucher.Instagram = Instagram.GetLogo();

                var viewResult = compositeViewEngine.FindView(ControllerContext, "Voucher", false);
                var viewDictionary = new ViewDataDictionary(new EmptyModelMetadataProvider(), new ModelStateDictionary()) { Model = voucher };
                var viewContext = new ViewContext(ControllerContext, viewResult.View, viewDictionary, TempData, stringWriter, new HtmlHelperOptions());
                var htmlToPdf = new HtmlToPdf(1000, 1414);

                await viewResult.View.RenderAsync(viewContext);

                var pdf = htmlToPdf.ConvertHtmlString(stringWriter.ToString());
                var pdfBytes = pdf.Save();

                try {
                    using (var streamWriter = new StreamWriter("Vouchers\\Voucher" + voucher.TicketNo + ".pdf")) {
                        await streamWriter.BaseStream.WriteAsync(pdfBytes, 0, pdfBytes.Length);
                    }
                    return StatusCode(200, new {
                        response = ApiMessages.FileCreated()
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, voucher, exception);
                    return StatusCode(493, new {
                        response = ApiMessages.FileNotCreated()
                    });
                }

            }

        }

    }

}
