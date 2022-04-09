using API.Features.Reservations;
using API.Infrastructure.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Embarkation.Printer {

    public interface IEmbarkationPrinterRepository : IRepository<Reservation> {

        EmbarkationPrinterGroupVM<EmbarkationPrinterVM> DoReportTasks(string date, int destinationId, int portId, int shipId);
        FileStreamResult DownloadReport(string filename);

    }

}