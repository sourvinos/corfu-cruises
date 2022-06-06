using System;

namespace API.Infrastructure.Exceptions {

    public class CustomException : Exception {

        public CustomException() : base() { }
        public int HttpResponseCode { get; set; }

    }

}