using API.Infrastructure.Classes;

namespace API.Features.Destinations {

    public class DestinationWriteDto : BaseEntity {

        public int Id { get; set; }
        public string Abbreviation { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }

    }

}