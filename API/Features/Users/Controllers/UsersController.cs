using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Extensions;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Features.Users {

    [Route("api/[controller]")]
    public class UsersController : ControllerBase {

        #region variables

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly IUserRepository userRepo;
        private readonly IUserValidation userValidation;

        #endregion

        public UsersController(IHttpContextAccessor httpContext, IMapper mapper, IUserRepository userRepo, IUserValidation userValidation) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userRepo = userRepo;
            this.userValidation = userValidation;
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
                if (Identity.IsUserAdmin(httpContext) || userValidation.IsUserOwner(x.Id)) {
                    return new ResponseWithBody {
                        Code = 200,
                        Icon = Icons.Info.ToString(),
                        Message = ApiMessages.OK(),
                        Body = mapper.Map<UserExtended, UserReadDto>(x)
                    };
                } else {
                    throw new CustomException() {
                        ResponseCode = 490
                    };
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
        public async Task<Response> Post([FromBody] UserNewDto user) {
            var x = userValidation.IsValid(user);
            if (x == 200) {
                await userRepo.Create(mapper.Map<UserNewDto, UserExtended>(user), user.Password);
                await userRepo.AddUserToRole(mapper.Map<UserNewDto, UserExtended>(user));
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
        [Authorize(Roles = "user, admin")]
        [ServiceFilter(typeof(ModelValidationAttribute))]
        public async Task<Response> Put([FromBody] UserUpdateDto user) {
            var x = await userRepo.GetById(user.Id);
            if (x != null) {
                var z = userValidation.IsValid(user);
                if (z == 200) {
                    if (Identity.IsUserAdmin(httpContext) || userValidation.IsUserOwner(x.Id)) {
                        await userRepo.Update(x, user);
                        await userRepo.UpdateRole(x);
                        return new Response {
                            Code = 200,
                            Icon = Icons.Success.ToString(),
                            Message = ApiMessages.OK()
                        };
                    } else {
                        throw new CustomException() {
                            ResponseCode = 490
                        };
                    }
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