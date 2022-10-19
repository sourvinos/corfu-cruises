using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Responses;
using Microsoft.AspNetCore.Identity;

namespace API.Features.Users {

    public interface IUserRepository {

        Task<IEnumerable<UserListVM>> Get();
        Task<UserExtended> GetById(string id);
        Task<IdentityResult> Create(UserExtended entity, string password);
        Task<bool> Update(UserExtended x, UserUpdateDto user);
        Task AddUserToRole(UserExtended user);
        Task UpdateRole(UserExtended user);
        Task<Response> Delete(UserExtended user);

    }

}