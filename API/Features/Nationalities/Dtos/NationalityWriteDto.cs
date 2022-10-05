using API.Infrastructure.Classes;

namespace API.Features.Nationalities {

    public class NationalityWriteDto : IEntity {

        public int Id { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }

    }

}