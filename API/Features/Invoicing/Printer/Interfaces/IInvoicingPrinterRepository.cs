using Microsoft.AspNetCore.Mvc;

namespace API.Features.Invoicing.Printer {

    public interface IInvoicingPrinterRepository {

        InvoicingPrinterVM Get(InvoicingPrinterCriteria Criteria);
        FileStreamResult OpenReport(string filename);

    }

}