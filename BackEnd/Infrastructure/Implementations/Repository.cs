using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BlueWaterCruises {

    public class Repository<T> : IRepository<T> where T : class {

        protected readonly AppDbContext context;
        private readonly TestingEnvironment settings;

        public Repository(AppDbContext context, IOptions<TestingEnvironment> settings) {
            this.context = context;
            this.settings = settings.Value;
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
            using var transaction = context.Database.BeginTransaction();
            context.Add(entity);
            Save();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
            return entity;
        }

        public void Update(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Entry(entity).State = EntityState.Modified;
            Save();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

        public void Delete(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Remove(entity);
            Save();
            if (settings.IsTesting) {
                transaction.Dispose();
            } else {
                transaction.Commit();
            }
        }

        private void Save() {
            context.SaveChanges();
        }

    }

}