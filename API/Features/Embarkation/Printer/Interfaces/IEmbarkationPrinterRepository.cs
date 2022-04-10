using API.Features.Reservations;
using API.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Embarkation.Printer {

    public interface IEmbarkationPrinterRepository : IRepository<Reservation> {

        EmbarkationPrinterGroupVM<EmbarkationPrinterVM> DoReportTasks(EmbarkationPrinterCriteria Criteria);
        FileStreamResult DownloadReport(string filename);

    }

}