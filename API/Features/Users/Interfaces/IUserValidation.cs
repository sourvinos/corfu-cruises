namespace API.Features.Users {

    public interface IUserValidation {

        int IsValid(IUser user);
        bool IsUserOwner(string userId);

    }

}