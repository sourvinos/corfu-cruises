using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Ports {

    [Route("api/[controller]")]
    public class PortsController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IPortRepository portRepo;
        private readonly IPortValidation portValidation;

        #endregion

        public PortsController(IMapper mapper, IPortRepository portRepository, IPortValidation portValidation) {
            this.mapper = mapper;
            this.portRepo = portRepository;
            this.portValidation = portValidation;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PortListVM>> Get() {
            return await portRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PortActiveVM>> GetActive() {
            return await portRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await portRepo.GetById(id);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Port, PortReadDto>(x)
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
        public Response Post([FromBody] PortWriteDto port) {
            var x = portValidation.IsValid(port);
            if (x == 200) {
                portRepo.Create(mapper.Map<PortWriteDto, Port>((PortWriteDto)portRepo.AttachUserIdToDto(port)));
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
        public async Task<Response> Put([FromBody] PortWriteDto port) {
            var x = await portRepo.GetById(port.Id);
            if (x != null) {
                var z = portValidation.IsValid(port);
                if (z == 200) {
                    portRepo.Update(mapper.Map<PortWriteDto, Port>((PortWriteDto)portRepo.AttachUserIdToDto(port)));
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

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete([FromRoute] int id) {
            var x = await portRepo.GetById(id);
            if (x != null) {
                portRepo.Delete(x);
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