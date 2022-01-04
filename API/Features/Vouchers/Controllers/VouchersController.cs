using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Email;
using API.Infrastructure.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using SelectPdf;

namespace API.Features.Vouchers {

    [Route("api/[controller]")]
    public class VouchersController : Controller {

        private readonly ICompositeViewEngine compositeViewEngine;
        private readonly IEmailSender emailSender;

        public VouchersController(ICompositeViewEngine compositeViewEngine, IEmailSender emailSender) {
            this.compositeViewEngine = compositeViewEngine;
            this.emailSender = emailSender;
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IActionResult> Create([FromBody] Voucher voucher) {
            using var stringWriter = new StringWriter();
            voucher.Logo = Logo.GetLogo();
            voucher.BarCode = "data:image/png;base64," + Convert.ToBase64String(QrCodeCreator.CreateQrCode(voucher.TicketNo));
            voucher.ValidPassengerIcon = IconToDisplay(voucher.TotalPersons, voucher.Passengers.Count);
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
            if (!Directory.Exists("Vouchers")) {
                Directory.CreateDirectory("Vouchers");
            }
            using (var streamWriter = new StreamWriter("Vouchers\\Voucher" + voucher.TicketNo + ".pdf")) {
                await streamWriter.BaseStream.WriteAsync(pdfBytes.AsMemory(0, pdfBytes.Length));
            }
            return StatusCode(200, new {
                response = ApiMessages.FileCreated()
            });
        }

        [HttpPost("[action]")]
        [Authorize(Roles = "user, admin")]
        public IActionResult SendToEmail([FromBody] VoucherEmail voucher) {
            if (ModelState.IsValid) {
                try {
                    var response = emailSender.SendVoucher(voucher).Message;
                    if (response == "OK") {
                        return StatusCode(200, new {
                            response = ApiMessages.EmailInstructions()
                        });
                    } else {
                        throw new Exception(response);
                    }
                } catch (Exception) {
                    return StatusCode(493, new {
                        response = ApiMessages.EmailNotSent()
                    });
                }
            }
            return StatusCode(400, new {
                response = ModelState.Values.SelectMany(x => x.Errors).Select(x => x.ErrorMessage)
            });
        }

        private static string IconToDisplay(int expectedPersons, int actualPassengers) {
            if (expectedPersons == actualPassengers) {
                return OK.GetLogo();
            } else {
                return Warning.GetLogo();
            }
        }

    }

}
