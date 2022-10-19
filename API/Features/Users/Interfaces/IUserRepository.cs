using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Responses;

namespace API.Features.Users {

    public interface IUserRepository {

        Task<IEnumerable<UserListVM>> Get();
        Task<UserExtended> GetById(string id);
        Task<Response> Create(UserNewDto entity);
        Task<bool> Update(UserExtended x, UserUpdateDto user);
        Task UpdateRole(UserExtended user);
        Task<Response> Delete(UserExtended user);

    }

}