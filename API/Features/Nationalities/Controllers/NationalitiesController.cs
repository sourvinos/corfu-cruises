using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Nationalities {

    [Route("api/[controller]")]
    public class NationalitiesController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly INationalityRepository nationalityRepo;

        #endregion

        public NationalitiesController(IMapper mapper, INationalityRepository nationalityRepo) {
            this.mapper = mapper;
            this.nationalityRepo = nationalityRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<NationalityListVM>> Get() {
            return await nationalityRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<NationalityActiveVM>> GetActive() {
            return await nationalityRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await nationalityRepo.GetById(id);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Nationality, NationalityReadDto>(x)
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
        public async Task<Response> Post([FromBody] NationalityWriteDto nationality) {
            nationalityRepo.Create(mapper.Map<NationalityWriteDto, Nationality>(await nationalityRepo.AttachUserIdToDto(nationality)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] NationalityWriteDto nationality) {
            var x = await nationalityRepo.GetById(nationality.Id);
            if (x != null) {
                nationalityRepo.Update(mapper.Map<NationalityWriteDto, Nationality>(await nationalityRepo.AttachUserIdToDto(nationality)));
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
            var x = await nationalityRepo.GetById(id);
            if (x != null) {
                nationalityRepo.Delete(x);
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