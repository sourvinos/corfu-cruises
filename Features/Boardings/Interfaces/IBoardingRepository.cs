using System.Collections.Generic;
using System.Threading.Tasks;

namespace CorfuCruises {

    public interface IBoardingRepository : IRepository<Booking> {

        Task<IEnumerable<BoardingResource>> Get(string date, int destinationId, int portId, int shipId);
        bool DoBoarding(int id);

    }

}