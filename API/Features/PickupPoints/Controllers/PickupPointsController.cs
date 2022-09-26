using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Reservations;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.PickupPoints {

    [Route("api/[controller]")]
    public class PickupPointsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IPickupPointRepository pickupPointRepo;
        private readonly IPickupPointValidation pickupPointValidation;

        #endregion

        public PickupPointsController(IMapper mapper, IPickupPointRepository pickupPointRepo, IPickupPointValidation pickupPointValidation) {
            this.mapper = mapper;
            this.pickupPointRepo = pickupPointRepo;
            this.pickupPointValidation = pickupPointValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PickupPointListVM>> Get() {
            return await pickupPointRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<PickupPointWithPortVM>> GetActive() {
            return await pickupPointRepo.GetActiveWithPort();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await pickupPointRepo.GetById(id, false);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<PickupPoint, PickupPointReadDto>(x)
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
        public async Task<Response> Post([FromBody] PickupPointWriteDto record) {
            var x = pickupPointValidation.IsValid(record);
            if (x == 200) {
                pickupPointRepo.Create(mapper.Map<PickupPointWriteDto, PickupPoint>(await pickupPointRepo.AttachUserIdToRecord(record)));
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
        public async Task<Response> Put([FromBody] PickupPointWriteDto pickupPoint) {
            var x = await pickupPointRepo.GetById(pickupPoint.Id, false);
            if (x != null) {
                var z = pickupPointValidation.IsValid(pickupPoint);
                if (z == 200) {
                    pickupPointRepo.Update(mapper.Map<PickupPointWriteDto, PickupPoint>(await pickupPointRepo.AttachUserIdToRecord(pickupPoint)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
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

        [HttpPatch("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Patch([FromQuery(Name = "id")] int id, [FromQuery(Name = "coordinates")] string coordinates) {
            var x = await pickupPointRepo.GetById(id, true);
            if (x != null) {
                pickupPointRepo.UpdateCoordinates(id, coordinates);
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
            var x = await pickupPointRepo.GetById(id, true);
            if (x != null) {
                pickupPointRepo.Delete(x);
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