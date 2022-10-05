using API.Infrastructure.Classes;

namespace API.Features.CoachRoutes {

    public class CoachRouteWriteDto : IEntity {

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool HasTransfer { get; set; }
        public bool IsActive { get; set; }

    }

}
