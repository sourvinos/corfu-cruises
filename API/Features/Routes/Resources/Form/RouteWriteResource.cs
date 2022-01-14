using API.Infrastructure.Interfaces;

namespace API.Features.Routes {

    public class RouteWriteResource : IEntity {

        public int Id { get; set; }
        public int PortId { get; set; }
        public string Description { get; set; }
        public string Abbreviation { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}
