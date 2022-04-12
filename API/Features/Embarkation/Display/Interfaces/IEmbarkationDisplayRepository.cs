using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Interfaces;

namespace API.Features.Embarkation.Display {

    public interface IEmbarkationDisplayRepository : IRepository<Reservation> {

        Task<EmbarkationDisplayGroupVM<EmbarkationDisplayVM>> Get(string date, int destinationId, int portId, string shipId);
        Task<int> GetShipIdFromDescription(string description);
        bool DoEmbarkation(int id);
    }

}