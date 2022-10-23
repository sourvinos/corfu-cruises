using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Helpers;
using API.Infrastructure.Responses;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Features.Users {

    public class UserRepository : IUserRepository {

        #region Variables

        private readonly IHttpContextAccessor httpContext;
        protected readonly AppDbContext context;
        private readonly IMapper mapper;
        private readonly UserManager<UserExtended> userManager;
        private readonly TestingEnvironment testingSettings;

        #endregion

        public UserRepository(AppDbContext context, IHttpContextAccessor httpContext, IMapper mapper, UserManager<UserExtended> userManager, IOptions<TestingEnvironment> testingSettings) {
            this.context = context;
            this.httpContext = httpContext;
            this.mapper = mapper;
            this.userManager = userManager;
            this.testingSettings = testingSettings.Value;
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
                .SingleOrDefaultAsync(x => x.Id == id);
        }

        public async Task Create(UserExtended user, string password) {
            using var transaction = context.Database.BeginTransaction();
            var result = await userManager.CreateAsync(user, password);
            if (result.Succeeded) {
                await userManager.AddToRoleAsync(user, user.IsAdmin ? "Admin" : "User");
                DisposeOrCommit(transaction);
            } else {
                throw new CustomException() {
                    ResponseCode = 498
                };
            }
        }

        public async Task Update(UserExtended x, UserUpdateDto user) {
            await UpdateUser(x, user);
            await UpdateUserRole(x);

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

        private async Task<bool> UpdateUser(UserExtended x, UserUpdateDto user) {
            x.Displayname = user.Displayname;
            if (await IsAdmin()) {
                x.CustomerId = user.CustomerId == 0 ? null : user.CustomerId;
                x.UserName = user.Username;
                x.Email = user.Email;
                x.IsAdmin = user.IsAdmin;
                x.IsActive = user.IsActive;
            }
            var result = await userManager.UpdateAsync(x);
            return result.Succeeded;
        }

        private async Task UpdateUserRole(UserExtended user) {
            var roles = await userManager.GetRolesAsync(user);
            await userManager.RemoveFromRolesAsync(user, roles);
            await userManager.AddToRoleAsync(user, user.IsAdmin ? "admin" : "user");

        }

        private void DisposeOrCommit(IDbContextTransaction transaction) {
            if (testingSettings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

    }

}