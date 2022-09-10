namespace API.Infrastructure.Responses {

    public class Response {

        public int Code { get; set; }
        public string Icon { get; set; }
        public string Message { get; set; }
        public object Body { get; set; } = "";

    }

}