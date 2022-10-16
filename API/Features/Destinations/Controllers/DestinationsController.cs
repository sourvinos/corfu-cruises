using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Destinations {

    [Route("api/[controller]")]
    public class DestinationsController : ControllerBase {

        #region variables

        private readonly IDestinationRepository destinationRepo;
        private readonly IMapper mapper;

        #endregion

        public DestinationsController(IDestinationRepository destinationRepo, IMapper mapper) {
            this.destinationRepo = destinationRepo;
            this.mapper = mapper;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<DestinationListVM>> Get() {
            return await destinationRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<DestinationActiveVM>> GetActive() {
            return await destinationRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ResponseWithBody> GetById(int id) {
            var x = await destinationRepo.GetById(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Destination, DestinationReadDto>(x)
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
        public Response Post([FromBody] DestinationWriteDto destination) {
            destinationRepo.Create(mapper.Map<DestinationWriteDto, Destination>((DestinationWriteDto)destinationRepo.AttachUserIdToDto(destination)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] DestinationWriteDto destination) {
            var x = await destinationRepo.GetById(destination.Id);
            if (x != null) {
                destinationRepo.Update(mapper.Map<DestinationWriteDto, Destination>((DestinationWriteDto)destinationRepo.AttachUserIdToDto(destination)));
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
            var x = await destinationRepo.GetById(id);
            if (x != null) {
                destinationRepo.Delete(x);
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