using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace API.Infrastructure.Interfaces {

    public interface IRepository<T> where T : class {

        Task<IEnumerable<T>> Get(Expression<Func<T, bool>> expression);
        Task<IEnumerable<T>> GetActive(Expression<Func<T, bool>> expression);
        IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges);
        Task<T> GetById(int id);
        void Create(T entity);
        void CreateList(List<T> entities);
        void Update(T entity);
        void Delete(T entity);

    }

}