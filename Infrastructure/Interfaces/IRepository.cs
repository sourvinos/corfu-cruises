using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ShipCruises {

    public interface IRepository<T> where T : class {

        Task<IEnumerable<T>> Get(Expression<Func<T, bool>> expression);
        Task<IEnumerable<T>> GetActive(Expression<Func<T, bool>> expression);
        Task<T> GetById(int id);
        T Create(T entity);
        void Update(T entity);
        void Delete(T entity);

    }

}