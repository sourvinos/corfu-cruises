namespace API.Features.Users {

    public interface IUserValidation {

        bool IsUserOwner(string userId);

    }

}