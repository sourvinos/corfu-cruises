namespace API.Features.Users {

    public interface IUserValidation {

        int IsValid(UserNewDto user);

    }

}