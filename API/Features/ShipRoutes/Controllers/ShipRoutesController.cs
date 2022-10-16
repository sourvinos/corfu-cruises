using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.ShipRoutes {

    [Route("api/[controller]")]
    public class ShipRoutesController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IShipRouteRepository shipRouteRepo;

        #endregion

        public ShipRoutesController(IMapper mapper, IShipRouteRepository shipRouteRepo) {
            this.mapper = mapper;
            this.shipRouteRepo = shipRouteRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipRouteListVM>> Get() {
            return await shipRouteRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<ShipRouteActiveVM>> GetActive() {
            return await shipRouteRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetById(int id) {
            var x = await shipRouteRepo.GetById(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<ShipRoute, ShipRouteReadDto>(x)
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
        public Response Post([FromBody] ShipRouteWriteDto shipRoute) {
            shipRouteRepo.Create(mapper.Map<ShipRouteWriteDto, ShipRoute>((ShipRouteWriteDto)shipRouteRepo.AttachUserIdToDto(shipRoute)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] ShipRouteWriteDto shipRoute) {
            var x = await shipRouteRepo.GetById(shipRoute.Id);
            if (x != null) {
                shipRouteRepo.Update(mapper.Map<ShipRouteWriteDto, ShipRoute>((ShipRouteWriteDto)shipRouteRepo.AttachUserIdToDto(shipRoute)));
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
            var x = await shipRouteRepo.GetById(id);
            if (x != null) {
                shipRouteRepo.Delete(x);
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