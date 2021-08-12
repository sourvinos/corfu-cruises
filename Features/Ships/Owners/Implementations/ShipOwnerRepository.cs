using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises.Features.Ships {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}