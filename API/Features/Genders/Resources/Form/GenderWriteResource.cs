using API.Infrastructure.Interfaces;

namespace API.Features.Genders {

    public class GenderWriteResource : IEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}