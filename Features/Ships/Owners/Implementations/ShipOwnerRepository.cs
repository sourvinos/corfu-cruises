using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CorfuCruises {

    public class ShipOwnerRepository : Repository<ShipOwner>, IShipOwnerRepository {

        public ShipOwnerRepository(DbContext appDbContext) : base(appDbContext) { }

    }

}