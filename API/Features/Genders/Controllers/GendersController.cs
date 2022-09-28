﻿using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Genders {

    [Route("api/[controller]")]
    public class GendersController : ControllerBase {

        #region variables

        private readonly IGenderRepository genderRepo;
        private readonly IMapper mapper;

        #endregion

        public GendersController(IGenderRepository genderRepo, IMapper mapper) {
            this.mapper = mapper;
            this.genderRepo = genderRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<GenderListVM>> Get() {
            return await genderRepo.Get();
        }

        [HttpGet("[action]")]
        [Authorize(Roles = "user, admin")]
        public async Task<IEnumerable<GenderActiveVM>> GetActive() {
            return await genderRepo.GetActive();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> GetById(int id) {
            var x = await genderRepo.GetById(id, false);
            if (x != null) {
                return new Response {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<Gender, GenderReadDto>(x)
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
        public async Task<Response> Post([FromBody] GenderWriteDto gender) {
            genderRepo.Create(mapper.Map<GenderWriteDto, Gender>(await genderRepo.AttachUserIdToDto(gender)));
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut]
        [Authorize(Roles = "admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] GenderWriteDto gender) {
            var x = await genderRepo.GetById(gender.Id, false);
            if (x != null) {
                genderRepo.Update(mapper.Map<GenderWriteDto, Gender>(await genderRepo.AttachUserIdToDto(gender)));
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
            var gender = await genderRepo.GetById(id, true);
            if (gender != null) {
                genderRepo.Delete(gender);
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