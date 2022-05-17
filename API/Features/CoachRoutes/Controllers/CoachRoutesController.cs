using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.CoachRoutes {

    [Route("api/[controller]")]
    public class CoachRoutesController : ControllerBase {

        #region variables

        private readonly ICoachRouteRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public CoachRoutesController(ICoachRouteRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CoachRouteListVM>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CoachRouteActiveForDropdownVM>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<CoachRouteReadDto> GetRoute(int id) {
            return await repo.GetById(id);
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostRoute([FromBody] CoachRouteWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Create(mapper.Map<CoachRouteWriteDto, CoachRoute>(AttachUserIdToRecord(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordCreated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutRoute([FromBody] CoachRouteWriteDto record) {
            var response = repo.IsValid(record);
            if (response == 200) {
                repo.Update(mapper.Map<CoachRouteWriteDto, CoachRoute>(AttachUserIdToRecord(record)));
                return StatusCode(200, new {
                    response = ApiMessages.RecordUpdated()
                });
            } else {
                return GetErrorMessage(response);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteRoute([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private CoachRouteWriteDto AttachUserIdToRecord(CoachRouteWriteDto record) {
            var userId = Identity.GetConnectedUserId(httpContext);
            record.UserId = userId;
            return record;
        }

        private IActionResult GetErrorMessage(int errorCode) {
            return errorCode switch {
                _ => StatusCode(450, new { Response = ApiMessages.FKNotFoundOrInactive("Port") }),
            };
        }

    }

}