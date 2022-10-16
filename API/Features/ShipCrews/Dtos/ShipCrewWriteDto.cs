using API.Infrastructure.Classes;

namespace API.Features.ShipCrews {

    public class ShipCrewWriteDto : BaseEntity {

        public int Id { get; set; }
        public int GenderId { get; set; }
        public int NationalityId { get; set; }
        public int ShipId { get; set; }
        public string Lastname { get; set; }
        public string Firstname { get; set; }
        public string Birthdate { get; set; }
        public bool IsActive { get; set; }
 
    }

}