using API.Infrastructure.Classes;

namespace API.Features.Drivers {

    public class DriverWriteDto : BaseEntity {

        public int Id { get; set; }
        public string Description { get; set; }
        public string Phones { get; set; }
        public bool IsActive { get; set; }
 
    }

}