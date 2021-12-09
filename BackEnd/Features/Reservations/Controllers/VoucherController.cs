using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.Extensions.Logging;
using SelectPdf;

namespace BlueWaterCruises.Features.Reservations {

    [Route("api/[controller]")]

    public class VoucherController : Controller {

        private readonly ICompositeViewEngine compositeViewEngine;
        private readonly IEmailSender emailSender;
        private readonly ILogger<VoucherController> logger;

        public VoucherController(ICompositeViewEngine compositeViewEngine, IEmailSender emailSender, ILogger<VoucherController> logger) {
            this.compositeViewEngine = compositeViewEngine;
            this.emailSender = emailSender;
            this.logger = logger;
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> Create([FromBody] Voucher voucher) {

            using (var stringWriter = new StringWriter()) {

                voucher.Logo = Logo.GetLogo();
                voucher.BarCode = "data:image/png;base64," + Convert.ToBase64String(QrCodeCreator.CreateQrCode(voucher.TicketNo));
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

        [HttpPost("[action]")]
        [Authorize(Roles = "user, admin")]
        public IActionResult Email([FromBody] Voucher voucher) {
            if (ModelState.IsValid) {
                try {
                    var response = emailSender.SendVoucher(voucher).Message;
                    if (response == "OK") {
                        return StatusCode(200, new { response = ApiMessages.EmailInstructions() });
                    } else {
                        throw new Exception(response);
                    }
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, voucher.Email, exception);
                    return StatusCode(493, new {
                        response = ApiMessages.EmailNotSent()
                    });
                }
            }
            return StatusCode(400, new { response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage) });
        }

    }

}
