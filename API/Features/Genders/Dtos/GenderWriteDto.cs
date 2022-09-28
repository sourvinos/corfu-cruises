namespace API.Features.Genders {

    public class GenderWriteDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}