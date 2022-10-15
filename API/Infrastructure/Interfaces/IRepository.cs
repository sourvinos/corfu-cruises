using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Infrastructure.Interfaces {

    public interface IRepository<T> where T : class {

        Task<T> GetById(int id);
        void Create(T entity);
        void CreateList(List<T> entities);
        void Update(T entity);
        void Delete(T entity);
        void DeleteRange(IEnumerable<T> entities);

    }

}