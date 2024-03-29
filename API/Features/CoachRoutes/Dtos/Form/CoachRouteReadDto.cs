using API.Infrastructure.Classes;

namespace API.Features.CoachRoutes {

    public class CoachRouteReadDto {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool HasTransfer { get; set; }
        public bool IsActive { get; set; }
        public SimpleResource Port { get; set; }

    }

}