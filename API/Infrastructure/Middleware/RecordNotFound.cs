using System;

namespace API.Infrastructure.Middleware {

    public class RecordNotFound : Exception {

        public RecordNotFound() : base() { }
        public RecordNotFound(string response) : base(response) { }
        public RecordNotFound(string message, Exception innerException) : base(message, innerException) { }

    }

}