using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ShipOwners {

    [Route("api/[controller]")]
    public class ShipOwnersController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IShipOwnerRepository shipOwnerRepo;

        #endregion

        public ShipOwnersController(IMapper mapper, IShipOwnerRepository shipOwnerRepo) {
            this.mapper = mapper;
            this.shipOwnerRepo = shipOwnerRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipOwnerListVM>> Get() {
            return await shipOwnerRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipOwnerActiveVM>> GetActive() {
            return await shipOwnerRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await shipOwnerRepo.GetById(id);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<ShipOwner, ShipOwnerReadDto>(x)
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
        public async Task<Response> Post([FromBody] ShipOwnerWriteDto record) {
            shipOwnerRepo.Create(mapper.Map<ShipOwnerWriteDto, ShipOwner>(await shipOwnerRepo.AttachUserIdToDto(record)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ShipOwnerWriteDto shipOwner) {
            var x = await shipOwnerRepo.GetById(shipOwner.Id);
            if (x != null) {
                shipOwnerRepo.Update(mapper.Map<ShipOwnerWriteDto, ShipOwner>(await shipOwnerRepo.AttachUserIdToDto(shipOwner)));
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] int id) {
            var x = await shipOwnerRepo.GetById(id);
            if (x != null) {
                shipOwnerRepo.Delete(x);
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