using API.Infrastructure.Interfaces;

namespace API.Features.Drivers {

    public class DriverWriteResource : IEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Phones { get; set; }
        public bool IsActive { get; set; }
        public string UserId { get; set; }

    }

}