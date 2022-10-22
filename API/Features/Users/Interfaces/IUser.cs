namespace API.Features.Users {

    public interface IUser {

        string Id { get; set; }
        int? CustomerId { get; set; }
        string Email { get; set; }
        string Username { get; set; }

    }

}