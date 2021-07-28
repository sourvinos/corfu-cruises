using System.Collections.Generic;
using System.Threading.Tasks;

namespace ShipCruises.PickupPoints {

    public interface IPickupPointRepository : IRepository<PickupPoint> {

        Task<IEnumerable<PickupPointResource>> Get();
        Task<IEnumerable<PickupPoint>> GetActive();
        Task<IEnumerable<PickupPoint>> GetForRoute(int routeId);
        new Task<PickupPoint> GetById(int pickupPointId);
        int GetPortId(int pickupPointId);
        void UpdateCoordinates(int pickupPointId, string coordinates);

    }

}