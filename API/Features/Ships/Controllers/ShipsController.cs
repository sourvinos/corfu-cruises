using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Ships {

    [Route("api/[controller]")]
    public class ShipsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IShipRepository shipRepo;
        private readonly IShipValidation shipValidation;

        #endregion

        public ShipsController(IMapper mapper, IShipRepository shipRepo, IShipValidation shipValidation) {
            this.mapper = mapper;
            this.shipRepo = shipRepo;
            this.shipValidation = shipValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipListVM>> Get() {
            return await shipRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<ShipActiveVM>> GetActive() {
            return await shipRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await shipRepo.GetById(id, true);
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
                shipRepo.Create(mapper.Map<ShipWriteDto, Ship>(await shipRepo.AttachUserIdToDto(ship)));
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

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutShip([FromBody] ShipWriteDto ship) {
            var x = await shipRepo.GetById(ship.Id, false);
            if (x != null) {
                var z = shipValidation.IsValid(ship);
                if (z == 200) {
                    shipRepo.Update(mapper.Map<ShipWriteDto, Ship>(await shipRepo.AttachUserIdToDto(ship)));
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
            var x = await shipRepo.GetById(id, false);
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

    }

}