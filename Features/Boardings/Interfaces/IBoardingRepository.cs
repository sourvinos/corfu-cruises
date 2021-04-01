using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IBoardingRepository : IRepository<Reservation> {

        Task<BoardingGroupResultResource<BoardingResource>> Get(string date, int destinationId, int portId, int shipId);
        bool DoBoarding(int id);

    }

}