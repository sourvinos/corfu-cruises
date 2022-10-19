using System.Collections.Generic;
using System.Threading.Tasks;
using API.Features.Users;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Users {

    [Route("api/[controller]")]
    public class UsersController : ControllerBase {

        #region variables

        private readonly IMapper mapper;
        private readonly IUserRepository userRepo;

        #endregion

        public UsersController(IMapper mapper, IUserRepository userRepo) {
            this.mapper = mapper;
            this.userRepo = userRepo;
        }

        [HttpGet]
        [Authorize(Roles = "admin")]
        public async Task<IEnumerable<UserListVM>> Get() {
            return await userRepo.Get();
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<ResponseWithBody> GetById(string id) {
            var x = await userRepo.GetById(id);
            if (x != null) {
                return new ResponseWithBody {
                    Code = 200,
                    Icon = Icons.Info.ToString(),
                    Message = ApiMessages.OK(),
                    Body = mapper.Map<UserExtended, UserReadDto>(x)
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpPost]
        [Authorize(Roles = "admin")]
        public Response Post([FromBody] UserNewDto user) {
            userRepo.Create(user);
            return new Response {
                Code = 200,
                Icon = Icons.Success.ToString(),
                Message = ApiMessages.OK()
            };
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user, admin")]
        public async Task<Response> Put([FromBody] UserUpdateDto user) {
            var x = await userRepo.GetById(user.Id);
            if (x != null) {
                if (await userRepo.Update(x, user)) {
                    await userRepo.UpdateRole(x);
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } else {
                    return new Response {
                        Code = 498,
                        Icon = Icons.Error.ToString(),
                        Message = ApiMessages.NotUniqueUser()
                    };
                };
            } else {
                throw new CustomException() {
                    ResponseCode = 404
                };
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "admin")]
        public async Task<Response> Delete(string id) {
            var x = await userRepo.GetById(id);
            if (x != null) {
                await userRepo.Delete(x);
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