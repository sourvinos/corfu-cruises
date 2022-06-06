using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using API.Infrastructure.Classes;
using API.Infrastructure.Interfaces;
using API.Infrastructure.Exceptions;
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
            var record = await context.Set<T>().FindAsync(id);
            if (record != null) {
                return record;
            } else {
                throw new CustomException { HttpResponseCode = 404 };
            }
        }

        public void Create(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Add(entity);
            try {
                Save();
                DisposeOrCommit(transaction);
            } catch (DbUpdateConcurrencyException) {
                transaction.Dispose();
            }
        }

        public void Update(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Entry(entity).State = EntityState.Modified;
            try {
                Save();
                DisposeOrCommit(transaction);
            } catch (DbUpdateConcurrencyException exception) {
                exception.Entries.Single().Reload();
                transaction.Dispose();
            }
        }

        public void Delete(T entity) {
            if (entity != null) {
                using var transaction = context.Database.BeginTransaction();
                try {
                    RemoveEntity(entity);
                    Save();
                    DisposeOrCommit(transaction);
                } catch (Exception) {
                    throw new CustomException { HttpResponseCode = 491 };
                }
            } else {
                throw new CustomException { HttpResponseCode = 404 };
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