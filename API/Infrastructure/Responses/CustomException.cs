using System;

namespace API.Infrastructure.Responses {

    public class CustomException : Exception {

        public CustomException() : base() { }
        public int HttpResponseCode { get; set; }

    }

}