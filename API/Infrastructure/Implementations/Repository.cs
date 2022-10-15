using System;
using System.Collections.Generic;
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

        public void Create(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Add(entity);
            context.SaveChanges();
            DisposeOrCommit(transaction);
        }

        public void CreateList(List<T> entities) {
            var strategy = context.Database.CreateExecutionStrategy();
            strategy.Execute(() => {
                using var transaction = context.Database.BeginTransaction();
                context.AddRange(entities);
                context.SaveChanges();
                DisposeOrCommit(transaction);
            });
        }

        public void Update(T entity) {
            using var transaction = context.Database.BeginTransaction();
            context.Set<T>().Update(entity);
            context.SaveChanges();
            DisposeOrCommit(transaction);
        }

        public void Delete(T entity) {
            using var transaction = context.Database.BeginTransaction();
            try {
                context.Remove(entity);
                context.SaveChanges();
                DisposeOrCommit(transaction);
            } catch (Exception) {
                throw new CustomException { ResponseCode = 491 };
            }
        }

        public void DeleteRange(IEnumerable<T> entities) {
            context.RemoveRange(entities);
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