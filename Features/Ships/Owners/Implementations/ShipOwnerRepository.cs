using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace ShipCruises {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}