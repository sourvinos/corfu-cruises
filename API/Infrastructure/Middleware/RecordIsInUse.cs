using System;

namespace API.Infrastructure.Middleware {

    public class RecordIsInUse : Exception {

        public RecordIsInUse() : base() { }
        public RecordIsInUse(string response) : base(response) { }
        public RecordIsInUse(string message, Exception innerException) : base(message, innerException) { }

    }

}