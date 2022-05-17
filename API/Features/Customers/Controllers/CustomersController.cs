using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
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
        public async Task<IEnumerable<CustomerListResource>> Get() {
            return await repo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<SimpleResource>> GetActiveForDropdown() {
            return await repo.GetActiveForDropdown();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<CustomerReadResource> GetCustomer(int id) {
            return mapper.Map<Customer, CustomerReadResource>(await repo.GetById(id));
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PostCustomer([FromBody] CustomerWriteResource record) {
            repo.Create(mapper.Map<CustomerWriteResource, Customer>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordCreated()
            });
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public IActionResult PutCustomer([FromBody] CustomerWriteResource record) {
            repo.Update(mapper.Map<CustomerWriteResource, Customer>(AttachUserIdToRecord(record)));
            return StatusCode(200, new {
                response = ApiMessages.RecordUpdated()
            });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> DeleteCustomer([FromRoute] int id) {
            repo.Delete(await repo.GetByIdToDelete(id));
            return StatusCode(200, new {
                response = ApiMessages.RecordDeleted()
            });
        }

        private CustomerWriteResource AttachUserIdToRecord(CustomerWriteResource record) {
            var userId = Identity.GetConnectedUserId(httpContext);
            record.UserId = userId;
            return record;
        }

    }

}