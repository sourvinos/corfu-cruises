using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Features.Users {

    public class UserRepository : IUserRepository {

        private readonly IHttpContextAccessor httpContext;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;

        public UserRepository(IHttpContextAccessor httpContext,IMapper mapper, UserManager<UserExtended> userManager) {
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
        }

        public async Task<IEnumerable<UserListVM>> Get() {
            var users = await userManager.Users
                .AsNoTracking()
                .OrderBy(o => o.UserName)
                .ToListAsync();
            return mapper.Map<IEnumerable<UserExtended>, IEnumerable<UserListVM>>(users);
        }

        public async Task<UserExtended> GetById(string id) {
            return await userManager.Users
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task<Response> Create(UserNewDto user) {
            var x = mapper.Map<UserNewDto, UserExtended>(user);
            var result = await userManager.CreateAsync(x, user.Password);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(x, user.IsAdmin ? "Admin" : "User");
                return new Response {
                    Code = 200,
                    Icon = Icons.Success.ToString(),
                    Message = ApiMessages.OK()
                };
            } else {
                return new Response {
                    Code = 492,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.NotUniqueUser()
                };
            }
        }

        public async Task<bool> Update(UserExtended x, UserUpdateDto user) {
            x.UserName = user.UserName;
            x.Displayname = user.Displayname;
            if (await IsAdmin()) {
                user.CustomerId = user.CustomerId == 0 ? null : user.CustomerId;
                user.Email = user.Email;
                user.IsAdmin = user.IsAdmin;
                user.IsActive = user.IsActive;
            }
            var result = await userManager.UpdateAsync(x);
            return result.Succeeded;
        }

        public async Task UpdateRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");
        }

        public async Task<Response> Delete(UserExtended user) {
            var x = Infrastructure.Extensions.Identity.GetConnectedUserId(httpContext);
            if (x == user.Id) {
                return new Response {
                    Code = 499,
                    Icon = Icons.Error.ToString(),
                    Message = ApiMessages.UnableToDeleteConnectedUser()
                };
            } else {
                try {
                    IdentityResult result = await userManager.DeleteAsync(await userManager.FindByIdAsync(user.Id));
                    return new Response {
                        Code = 200,
                        Icon = Icons.Success.ToString(),
                        Message = ApiMessages.OK()
                    };
                } catch (Exception) {
                    return new Response {
                        Code = 491,
                        Icon = Icons.Error.ToString(),
                        Message = ApiMessages.RecordInUse()
                    };
                }
            }
        }

        private async Task<bool> IsAdmin() {
            var isUserAdmin = Task.Run(() => Infrastructure.Extensions.Identity.IsUserAdmin(httpContext));
            return await isUserAdmin;
        }

    }

}