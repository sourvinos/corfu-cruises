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

namespace API.Features.Ports {

    [Route("api/[controller]")]
    public class PortsController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IPortRepository portRepository;

        #endregion

        public PortsController(IHttpContextAccessor httpContext, IMapper mapper, IPortRepository portRepository) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.portRepository = portRepository;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<PortListVM>> Get() {
            return mapper.Map<IEnumerable<Port>, IEnumerable<PortListVM>>(await portRepository.Get());
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActive() {
            return mapper.Map<IEnumerable<Port>, IEnumerable<SimpleResource>>(await portRepository.GetActive());
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var port = await portRepository.GetById(id, false);
            if (port != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Port, PortReadDto>(port)
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
        public async Task<Response> Post([FromBody] PortWriteDto port) {
            var responseCode = portRepository.IsValid(port);
            if (responseCode == 200) {
                portRepository.Create(mapper.Map<PortWriteDto, Port>(await AttachUserIdToRecord(port)));
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                throw new CustomException() {
                    ResponseCode = responseCode
                };
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] PortWriteDto port) {
            var x = await portRepository.GetById(port.Id, false);
            if (x != null) {
                var responseCode = portRepository.IsValid(port);
                if (responseCode == 200) {
                    portRepository.Update(mapper.Map<PortWriteDto, Port>(await AttachUserIdToRecord(port)));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = responseCode
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
            var port = await portRepository.GetById(id, false);
            if (port != null) {
                portRepository.Delete(port);
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

        private async Task<PortWriteDto> AttachUserIdToRecord(PortWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

    }

}