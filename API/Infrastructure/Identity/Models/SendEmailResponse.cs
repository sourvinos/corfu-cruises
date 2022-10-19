namespace API.Infrastructure.Identity {

    public class SendEmailResponse {

        public bool Successful => ErrorMsg == null;
        public string ErrorMsg;

    }

}