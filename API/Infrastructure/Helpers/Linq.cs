using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Infrastructure.Helpers {

    // https://exceptionnotfound.net/using-conditional-csharp-linq-clauses-to-make-a-multiple-input-search-engine/

    public static class LinqExtensions {

        public static IEnumerable<T> If<T>(this IEnumerable<T> query, bool should, params Func<IEnumerable<T>, IEnumerable<T>>[] transforms) {
            return should ? transforms.Aggregate(query, (current, transform) => transform.Invoke(current)) : query;
        }

        public static T If<T>(this T query, bool should, params Func<T, T>[] transforms) {
            return should ? transforms.Aggregate(query, (current, transform) => transform.Invoke(current)) : query;
        }

    }

}