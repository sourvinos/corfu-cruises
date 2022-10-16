using API.Infrastructure.Classes;

namespace API.Features.Genders {

    public class GenderWriteDto : BaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }

    }

}