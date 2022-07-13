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

namespace API.Features.Customers {

    [Route("api/[controller]")]
    public class CustomersController : ControllerBase {

        #region variables

        private readonly ICustomerRepository repo;
        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;

        #endregion

        public CustomersController(ICustomerRepository repo, IHttpContextAccessor httpContext, IMapper mapper) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.repo = repo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<CustomerListDto>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<CustomerReadDto> GetCustomer(int id) {
            return mapper.Map<Customer, CustomerReadDto>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PostCustomerAsync([FromBody] CustomerWriteDto record) {
            repo.Create(mapper.Map<CustomerWriteDto, Customer>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> PutCustomerAsync([FromBody] CustomerWriteDto record) {
            repo.Update(mapper.Map<CustomerWriteDto, Customer>(await AttachUserIdToRecord(record)));
            return ApiResponses.OK();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> DeleteCustomer([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return ApiResponses.OK();
        }

        private async Task<CustomerWriteDto> AttachUserIdToRecord(CustomerWriteDto record) {
            var user = await Identity.GetConnectedUserId(httpContext);
            record.UserId = user.UserId;
            return record;
        }

     }

}