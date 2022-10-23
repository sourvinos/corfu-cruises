namespace API.Features.Users {

    public interface IUserUpdateValidation {

        int IsValid(UserUpdateDto user);

    }

}