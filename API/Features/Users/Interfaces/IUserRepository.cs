using System.Collections.Generic;
using System.Threading.Tasks;
using API.Infrastructure.Responses;

namespace API.Features.Users {

    public interface IUserRepository {

        Task<IEnumerable<UserListVM>> Get();
        Task<UserExtended> GetById(string id);
        Task Create(UserExtended entity, string password);
        Task Update(UserExtended x, UserUpdateDto user);
        Task<Response> Delete(UserExtended user);

    }

}