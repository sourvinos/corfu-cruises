using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace BlueWaterCruises {

    public class Repository<T> : IRepository<T> where T : class {

        protected readonly AppDbContext context;

        public Repository(AppDbContext context) {
            this.context = context;
        }

        public async Task<IEnumerable<T>> Get(Expression<Func<T, bool>> expression) {
            return await context.Set<T>().Where(expression).ToListAsync();
        }

        public async Task<IEnumerable<T>> GetActive(Expression<Func<T, bool>> expression) {
            return await context.Set<T>().Where(expression).ToListAsync();
        }

        public async Task<T> GetById(int id) {
            return await context.Set<T>().FindAsync(id);
        }

        public T Create(T entity) {
            context.Add(entity);
            Save();
            return entity;
        }

        public void Update(T entity) {
            context.Entry(entity).State = EntityState.Modified;
            Save();
        }

        public void Delete(T entity) {
            context.Remove(entity);
            Save();
        }

        private void Save() {
            context.SaveChanges();
        }

    }

}