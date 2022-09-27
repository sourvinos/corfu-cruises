using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;
using API.Infrastructure.Responses;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Options;

namespace API.Infrastructure.Implementations {

    public class Repository<T> : IRepository<T> where T : class {

        protected readonly AppDbContext context;
        private readonly TestingEnvironment testingSettings;

        public Repository(AppDbContext context, IOptions<TestingEnvironment> testingSettings) {
            this.context = context;
            this.testingSettings = testingSettings.Value;
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

        public IQueryable<T> FindByCondition(Expression<Func<T, bool>> expression, bool trackChanges) {
            return !trackChanges
                ? context.Set<T>().Where(expression).AsNoTracking()
                : context.Set<T>().Where(expression);
        }

        public void Create(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Add(entity);
            Save();
            DisposeOrCommit(transaction);
        }

        public void Update(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Entry(entity).State = EntityState.Modified;
            context.Set<T>().Update(entity);
            Save();
            DisposeOrCommit(transaction);
        }

        public void Delete(T entity) {
            using var transaction = context.Database.BeginTransaction();
            try {
                RemoveEntity(entity);
                Save();
                DisposeOrCommit(transaction);
            } catch (Exception) {
                throw new CustomException { ResponseCode = 491 };
            }
        }

        private void Save() {
            context.SaveChanges();
        }

        private void RemoveEntity(T entity) {
            context.Remove(entity);
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