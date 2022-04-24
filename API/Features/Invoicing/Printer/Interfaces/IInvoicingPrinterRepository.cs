using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewEngines;

namespace API.Features.Invoicing.Printer {

    public interface IInvoicingPrinterRepository {

        InvoicingPrinterVM Get(InvoicingPrinterCriteria Criteria);
        Task<Response> CreatePDF(ViewEngineResult viewResult, ViewContext viewContext, InvoicingPrinterVM report);
        FileStreamResult OpenReport(string filename);

    }

}