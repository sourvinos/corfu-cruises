using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Ships {

    [Route("api/[controller]")]
    public class ShipsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IShipRepository shipRepo;
        private readonly IShipValidation shipValidation;

        #endregion

        public ShipsController(IHttpContextAccessor httpContext, IMapper mapper, IShipRepository shipRepo, IShipValidation shipValidation) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.shipRepo = shipRepo;
            this.shipValidation = shipValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<SimpleResource>> Get() {
            return await shipRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActive() {
            return await shipRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await shipRepo.GetById(id, false);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Ship, ShipReadDto>(x)
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Post([FromBody] ShipWriteDto ship) {
            var x = shipValidation.IsValid(ship);
            if (x == 200) {
                await AttachUserIdToRecord(ship);
                shipRepo.Create(mapper.Map<ShipWriteDto, Ship>(ship));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = x
                };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutShip([FromBody] ShipWriteDto ship) {
            var x = await shipRepo.GetById(ship.Id, false);
            if (x != null) {
                var z = shipValidation.IsValid(ship);
                if (z == 200) {
                    await AttachUserIdToRecord(ship);
                    shipRepo.Update(mapper.Map<ShipWriteDto, Ship>(await AttachUserIdToRecord(ship)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK(),
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = z
                    };
                }
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteShip([FromRoute] int id) {
            var x = await shipRepo.GetById(id, true);
            if (x != null) {
                shipRepo.Delete(x);
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        private async Task<ShipWriteDto> AttachUserIdToRecord(ShipWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

    }

}