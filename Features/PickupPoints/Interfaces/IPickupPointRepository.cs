using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPoint>> Get();
        Task<IEnumerable<PickupPoint>> GetActive();
        Task<IEnumerable<PickupPoint>> GetForRoute(int routeId);
        new Task<PickupPoint> GetById(int pickupPointId);
        int GetPortId(int pickupPointId);
        void UpdateCoordinates(int pickupPointId, string coordinates);

    }

}