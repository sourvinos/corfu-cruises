using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace ShipCruises.Features.Ships {

    // [Authorize]
    [Route("api/[controller]")]

    public class ShipOwnersController : ControllerBase {

        private readonly IMapper mapper;
        private readonly IShipOwnerRepository repo;
        private readonly ILogger<ShipOwnersController> logger;

        public ShipOwnersController(IShipOwnerRepository repo, ILogger<ShipOwnersController> logger, IMapper mapper) {
            this.repo = repo;
            this.logger = logger;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IEnumerable<ShipOwnerListResource>> Get() {
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<ShipOwnerListResource>>(await repo.Get(x => x.Id > 1));
        }

        [HttpGet("[action]")]
        public async Task<IEnumerable<ShipOwnerListResource>> GetActive() {
            return mapper.Map<IEnumerable<ShipOwner>, IEnumerable<ShipOwnerListResource>>(await repo.GetActive(x => x.IsActive));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShipOwner(int id) {
            ShipOwner record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            return StatusCode(200, record);
        }

        [HttpPost]
        // [Authorize(Roles = "Admin")]
        public IActionResult PostShipOwner([FromBody] ShipOwner record) {
            if (ModelState.IsValid) {
                try {
                    repo.Create(record);
                    return StatusCode(200, new {
                        response = ApiMessages.RecordCreated()
                    });
                } catch (Exception exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, record, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")]
        public IActionResult PutShipOwner([FromRoute] int id, [FromBody] ShipOwner record) {
            if (id == record.Id && ModelState.IsValid) {
                try {
                    repo.Update(record);
                    return StatusCode(200, new {
                        response = ApiMessages.RecordUpdated()
                    });
                } catch (DbUpdateException exception) {
                    LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                    return StatusCode(490, new {
                        response = ApiMessages.RecordNotSaved()
                    });
                }
            }
            LoggerExtensions.LogException(0, logger, ControllerContext, record, null);
            return StatusCode(400, new {
                response = ApiMessages.InvalidModel()
            });
        }

        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteShipOwner([FromRoute] int id) {
            ShipOwner record = await repo.GetById(id);
            if (record == null) {
                LoggerExtensions.LogException(id, logger, ControllerContext, null, null);
                return StatusCode(404, new {
                    response = ApiMessages.RecordNotFound()
                });
            }
            try {
                repo.Delete(record);
                return StatusCode(200, new {
                    response = ApiMessages.RecordDeleted()
                });
            } catch (DbUpdateException exception) {
                LoggerExtensions.LogException(0, logger, ControllerContext, record, exception);
                return StatusCode(491, new {
                    response = ApiMessages.RecordInUse()
                });
            }
        }

    }

}