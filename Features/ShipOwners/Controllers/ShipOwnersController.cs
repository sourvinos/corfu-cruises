using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace CorfuCruises {

    [Authorize]
    [Route("api/[controller]")]

    public class ShipOwnersController : ControllerBase {

        private readonly IShipOwnerRepository repo;
        private readonly ILogger<ShipOwnersController> logger;

        public ShipOwnersController(IShipOwnerRepository repo, ILogger<ShipOwnersController> logger) {
            this.repo = repo;
            this.logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<ShipOwner>> Get() {
            return await repo.Get(x => x.Id > 1);
        }

    }

}