namespace API.Features.Users {

    public interface IUserNewValidation {

        int IsValid(UserNewDto user);

    }

}