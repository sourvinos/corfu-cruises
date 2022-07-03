using System;

namespace API.Infrastructure.Exceptions {

    public class CustomException : Exception {

        public CustomException() : base() { }
        public CustomException(string message) : base(message) { }
        public CustomException(string message, Exception innerException) : base(message, innerException) { }
        public int HttpResponseCode { get; set; }

    }

}